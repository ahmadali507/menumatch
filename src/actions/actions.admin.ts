"use server";

import { getAuth } from "firebase-admin/auth";
import { TAddRestaurantSchema, TEditRestaurant } from "@/lib/schema";
import { initAdmin } from "@/firebase/adminFirebase";
import { RestaurantType, resAdminType } from "@/types";
import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";


type SuperAdminData = {
  name: string, 
  email: string,
  password: string, 
  role: string, 
}

/////////////// FUNCTION TO CREATE A SUPER_ADMIN WITH A CUSTOM CLAIM //////////////////

export const createSuperAdmin = async (data: SuperAdminData ) =>{
  await initAdmin(); 
  const firestore = getFirestore(); 
  const auth = getAuth(); 
  // now we need to create a superAdmin and then assign it a custom claim of role: "super Admin"
  const userRecord = await auth.createUser({
    email: data.email, 
    password: data.password, 
    displayName: data.name, 
  }); 

  if(!userRecord){
    return {error: "Failed to create user"}
  }
  await auth.setCustomUserClaims(userRecord?.uid, {
    role : "super_admin",
  }).then(()=>{
    console.log("Custom claim assigned successfully"); 
  }).catch((err)=>{
    console.log("error while assigning custom claim setup ", err); 
  })
  // now storing hte data of the superAdmin to the firestore  ... 
  const userAdded = await firestore.collection("users").doc(userRecord.uid).set({
    name: data.name,
    email: data.email,
    role: "super_admin",
    createdAt: new Date().toISOString(),
  })

  if(!userAdded){
    return {error: "Failed to add user to the firestore"}; 
  }
  console.log("User added to the firestore", userAdded);

  return {
    success : true, 
    message: "Super admin created successfully",
    data : {
      id : userRecord.uid, 
      email : userRecord.email, 
      name : userRecord.displayName, 
      role : "super_admin"
    } 
  }
}

///////////////////  Restaurant creation and admin creation tasks //////////////////////


export const createRestaurant = async (data: TAddRestaurantSchema, idToken : string) => {
  await initAdmin();
  const firestore = getFirestore();
  const auth = getAuth(); 
  try {
    const claims = await auth.verifyIdToken(idToken);
    if(claims.role !== "super_admin"){
      throw new Error("You are not authorized to create Restaurants");
    }
    const restaurantRef = await firestore.collection("restaurants").add(data);
    return { success: true, restaurantId: restaurantRef.id };
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return { error: (error as Error).message ||  "Failed to create restaurant" };
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
      ...doc.data() as Omit<RestaurantType, "RestaurantId">,
      id: doc.id,
    }));
    return { success: true, restaurants };
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return { success: false, error: "Failed to fetch restaurants" };
  }
};

export const editRestaurant = async (restaurantId: string, data: TEditRestaurant, idToken: string) => {
  // console.log('editing restaurant')
  await initAdmin();
  const firestore = getFirestore();
  const auth = getAuth(); 
  try {

    const claims = await auth.verifyIdToken(idToken);
    if(claims.role !== "super_admin"){
      throw new Error("You are not authorized to edit Restaurants");
    }
    await firestore.collection("restaurants").doc(restaurantId).update(data);
    console.log("Restaurant edited successfully");

    revalidatePath(`/restaurants/${restaurantId}`);

    return { success: true, message: "Restaurant edited successfully" };
  } catch (error) {
    console.error("Error editing restaurant:", error);
    // return { error: "Failed to edit restaurant" };
    return { success: false, error : (error as Error).message || "Failed to edit restaurant" };
  }

}


export const deleteRestaurant = async (restaurantId: string, idToken : string) => {
  await initAdmin();
  const firestore = getFirestore();
  const auth = getAuth(); 
  try {
    const claims = await auth.verifyIdToken(idToken);
    if(claims.role !== "super_admin"){
      throw new Error("You are not authorized to delete Restaurants");
    }
    console.log("Deleteing the restaurant with id", restaurantId);
    await firestore.collection("restaurants").doc(restaurantId).delete();

    revalidatePath("/restaurants");
    return { success: true, message: "Restaurant deleted successfully" };
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return { success: false, error : (error as Error).message || "Failed to delete restaurant" };
  }
}

///////////////////////////// RESTAURANT ADMIN CREATION AND FETCHING /////////////////////////

export const addRestaurantAdmin = async (data: resAdminType, idToken : string) => {
  await initAdmin();
  const auth = getAuth();
  const firestore = getFirestore();
  try {
    ///// checking idToken to check whether user is a superAdmin or not to allow for creation of admins.
    const claims = await auth.verifyIdToken(idToken);
    if (claims.role !== "super_admin") {
      throw new Error("You are not authorized to create Admins");
    }
    const userRecord = await auth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
    });
    if (!userRecord) {
      return { success: false, error: "Failed to create user" };
    }

    await auth.setCustomUserClaims(userRecord.uid, {
      role: "admin",
    }).then(() => {
      console.log("Custom claim assigned successfully");
    }).catch((err) => {
      console.log("error while assigning custom claim setup ", err);
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

export const getRestaurantData = cache(async (restaurantId: string) => {
  await initAdmin();
  const firestore = getFirestore();

  const [restaurantSnap, adminResponse] = await Promise.all([
    firestore.collection('restaurants').doc(restaurantId).get(),
    fetchRestaurantAdmins(restaurantId)
  ]);

  if (!restaurantSnap.exists) {
    return notFound()
  }

  const restaurantData = restaurantSnap.data() as RestaurantType;

  // Enhance restaurant data with admin information
  if (adminResponse.success && adminResponse.admins) {
    restaurantData.admins = adminResponse.admins;
  } else {
    console.error('Failed to fetch admins:', adminResponse.error);
    restaurantData.admins = [];
  }

  return restaurantData;
});
