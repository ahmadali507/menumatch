'use server'
import { cookies } from 'next/headers';
import { initAdmin } from '@/firebase/adminFirebase';
import { getFirestore } from 'firebase-admin/firestore';
import { decryptData, encryptData } from '@/lib/encrypt';
import { UserData } from '@/types';

export async function setUserCookie(uid: string | null) {
  try {
    console.log("INSIDE SETTING THE COOKIES HAHA", uid)
    await initAdmin();
    const firestore = getFirestore();

    console.log("user data for setting cookie", uid);
    const userSnap = await firestore.collection('users').doc(uid as string).get();
    console.log("user data for setting cookie", userSnap.data());

    if (!userSnap) {
      return { error: "User not found" };
    }

    const userData = userSnap.data() as UserData;
    console.log("this is the actual user data after snapshot", userData);
    const dataToEncrypt = {
      ...userData,
      uid: uid as string,
    };

    // Encrypt user data
    const encryptedData = await encryptData(dataToEncrypt);

    console.log("encrypted data", encryptedData);

    console.log("cookies", await cookies());
    // Set encrypted cookie
    (await cookies()).set("auth", encryptedData, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 7 days
    });

    return { success: true, user: userData };
  } catch (error) {
    console.error('Error setting user cookie:', error);
    return { error: "Failed to set user cookie" };
  }
}


export async function getUser() {

  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');

    if (!authCookie?.value) {
      return null;
    }

    const user = await decryptData(authCookie.value) as UserData;
    if (!user?.role) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}
