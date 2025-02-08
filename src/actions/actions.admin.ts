"use server";

import { getAuth } from "firebase-admin/auth";
import { TEditRestaurant } from "@/lib/schema";
import { initAdmin } from "@/firebase/adminFirebase";
import { RestaurantType, resAdminType } from "@/types";
import { getFirestore } from "firebase-admin/firestore";

export const createRestaurant = async (data: RestaurantType) => {
  await initAdmin();
  const firestore = getFirestore();

  try {
    const restaurantRef = await firestore.collection("restaurants").add(data);
    return { success: true, restaurantId: restaurantRef.id };
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return { error: "Failed to create restaurant" };
  }
};

export const fetchRestaurant = async (restaurantId: string) => {
  await initAdmin();
  const firestore = getFirestore();
  try {
    const restaurantData = await firestore
      .collection("restaurants")
      .doc(restaurantId)
      .get();
    const data = {
      restaurantId,
      ...restaurantData.data(),
    };
    console.log("Restaurant Data", restaurantData.data());
    return { success: true, restaurant: data };
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return { error: "Failed to fetch restaurant" };
  }
};

export const fetchAllRestaurants = async () => {
  await initAdmin();
  const firestore = getFirestore();
  try {
    const restaurantsSnapshot = await firestore.collection("restaurants").get();
    if (restaurantsSnapshot.empty) {
      return { success: true, restaurants: [] };
    }
    const restaurants = restaurantsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data() as Omit<RestaurantType, "RestaurantId">,
    }));
    return { success: true, restaurants };
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return { success: false, error: "Failed to fetch restaurants" };
  }
};

export const editRestaurant = async (restaurantId: string, data: TEditRestaurant) => {
    await initAdmin(); 
    const firestore = getFirestore();
    try {
        await firestore.collection("restaurants").doc(restaurantId).update(data);
        return { success: true, message: "Restaurant edited successfully" };
    } catch (error) {
        console.error("Error editing restaurant:", error);
        return { error: "Failed to edit restaurant" };
    }

}


export const deleteRestaurant = async (restaurantId: string) => {
    await initAdmin(); 
    const firestore = getFirestore(); 
    try {
        await firestore.collection("restaurants").doc(restaurantId).delete();
        return { success: true, message: "Restaurant deleted successfully" };
    } catch (error) {
        console.error("Error deleting restaurant:", error);
        return { error: "Failed to delete restaurant" };
}
}


export const addRestaurantAdmin = async (data: resAdminType) => {
  await initAdmin();
  const auth = getAuth();
  const firestore = getFirestore();

  try {
    // Create user with email/password
    const userRecord = await auth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
    });

    // Store additional user data in Firestore
    await firestore.collection("users").doc(userRecord.uid).set({
      name: data.name,
      email: data.email,
      role: "admin",
      restaurantId: data.restaurantId,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      adminId: userRecord.uid,
      message: "Admin created successfully",
    };
  } catch (error) {
    console.error("Error adding restaurant admin:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to add restaurant admin",
    };
  }
};

export const fetchRestaurantAdmins = async (restaurantId: string) => {
  await initAdmin();
  const firestore = getFirestore();

  try {
    const adminsSnapshot = await firestore
      .collection("users")
      .where("restaurantId", "==", restaurantId)
      .where("role", "==", "admin")
      .get();

    if (adminsSnapshot.empty) {
      return { success: true, admins: [] };
    }

    const admins = adminsSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name as string,
      email: doc.data().email as string,
      restaurantId: doc.data().restaurantId as string,
      role: doc.data().role as string,
    }));

    return { success: true, admins };
  } catch (error) {
    console.error("Error fetching restaurant admins:", error);
    return {
      success: false,
      error: "Failed to fetch restaurant admins",
    };
  }
};
