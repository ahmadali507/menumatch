'use server';

import { cookies } from 'next/headers';
import { initAdmin } from '@/firebase/adminFirebase';
import { getAuth } from 'firebase-admin/auth';
// import { connectFirestoreEmulator } from 'firebase/firestore';

export const logoutUser = async () => {
  try {
    await initAdmin();
    const auth = getAuth();
    console.log("the user to be ", auth); 

    // Get the auth cookie
    const cookieStore = cookies();
    const authCookie = (await cookieStore).get('auth');

    if (!authCookie) {
      return { success: true, message: 'Already logged out' };
    }

    console.log("Deleting the user Cookie"); 
    // Delete the auth cookie
     (await cookieStore).delete('auth');

    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Logout error:', error);
    return { 
      success: false, 
      error: 'Failed to logout' 
    };
  }
};