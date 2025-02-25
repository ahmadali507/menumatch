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

export type RestaurantStats = {
  totalMenus: number;
  totalAdmins: number;
  totalOrders: number;
  recentOrders: number;
};

export async function getRestaurantStats(restaurantId: string): Promise<RestaurantStats> {
  await initAdmin();
  const firestore = getFirestore();

  try {
    const [menusSnap, adminsSnap] = await Promise.all([
      firestore.collection('restaurants').doc(restaurantId).collection('menus').get(),
      firestore.collection('users')
        .where('restaurantId', '==', restaurantId)
        .where('role', '==', 'admin')
        .get(),
    ]);

    // Dummy trends for now
    return {
      totalMenus: menusSnap.size,
      totalAdmins: adminsSnap.size,
      totalOrders: 150, // Dummy data
      recentOrders: 24, // Dummy data

    };
  } catch (error) {
    console.error('Error fetching restaurant stats:', error);
    return {
      totalMenus: 0,
      totalAdmins: 0,
      totalOrders: 0,
      recentOrders: 0,

    };
  }
}