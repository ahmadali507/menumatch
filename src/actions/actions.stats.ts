"use server";

import { initAdmin } from "@/firebase/adminFirebase";
import { getFirestore } from "firebase-admin/firestore";

export type DashboardStats = {
  totalRestaurants: number;
  totalAdmins: number;
  activeMenus: number;
  recentAdmins: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await initAdmin();
  const firestore = getFirestore();

  try {
    // Get restaurants and admins first
    const [restaurantsSnap, adminsSnap] = await Promise.all([
      firestore.collection('restaurants').get(),
      firestore.collection('users').where('role', '==', 'admin').get(),
    ]);

    // Get active menus count from all restaurants
    const activeMenusPromises = restaurantsSnap.docs.map(doc =>
      firestore.collection('restaurants').doc(doc.id).collection('menus')
        .where('status', '==', 'active')
        .get()
    );

    const menuSnapshots = await Promise.all(activeMenusPromises);
    const totalActiveMenus = menuSnapshots.reduce((total, snap) => total + snap.size, 0);

    const recentAdmins = adminsSnap.docs
      .map(doc => ({
        id: doc.id,
        name: doc.data().name as string,
        email: doc.data().email as string,
      }));

    return {
      totalRestaurants: restaurantsSnap.size,
      totalAdmins: adminsSnap.size,
      activeMenus: totalActiveMenus,
      recentAdmins
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalRestaurants: 0,
      totalAdmins: 0,
      activeMenus: 0,
      recentAdmins: []
    };
  }
}