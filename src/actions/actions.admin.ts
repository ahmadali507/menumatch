'use server'

import { initAdmin } from "@/firebase/adminFirebase";
import { createRestaurantType, resAdminType } from "@/types"
import { getFirestore } from "firebase-admin/firestore";

export const createRestaurant = async (data: createRestaurantType) => {

    await initAdmin(); 
    const firestore = getFirestore(); 

    try {
        const restaurantRef = await firestore.collection('restaurants').add(data);
        return { success: true, restaurantId: restaurantRef.id };
    } catch (error) {
        console.error('Error creating restaurant:', error);
        return { error: "Failed to create restaurant" };
    }

}

export const fetchRestaurant = async (restaurantId : string) =>{
    await initAdmin(); 
    const firestore = getFirestore(); 
    try{
        const restaurantData = await firestore.collection("restaurants").doc(restaurantId).get();
        console.log("Restaurant Data", restaurantData.data());
        return { success: true, restaurant: restaurantData.data() };
    }catch(error){
        console.error('Error fetching restaurant:', error);
        return { error: "Failed to fetch restaurant" };
    }
}


export const addRestaurantAdmin = async (data : resAdminType) =>{
    
    await initAdmin(); 
    const firestore = getFirestore(); 
    try{
        const adminRef = await firestore.collection("users").add(data);
        return { success: true, adminId: adminRef.id}
}
    catch(error){
        console.error('Error adding restaurant admin:', error);
        return { error: "Failed to add restaurant admin" };
    }

}

export const fetchRestaurantAdmins = async (restaurantId : string) =>{
    await initAdmin(); 
    const firestore = getFirestore(); 
    try{
        const adminData = await firestore.collection("admin").doc(restaurantId).get(); 
        const admins = adminData.data()?.admins || [];
        return { success: true, admins };
    }catch(error){
        console.error('Error fetching restaurant admins:', error);
        return { error: "Failed to fetch restaurant admins" };
    }
}   