"use server"

import { TAddMenuFormSchema } from "@/lib/schema";
import { initAdmin } from "@/firebase/adminFirebase";
import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { Menu, MenuItem, MenuSection } from "@/types";
import { getUser } from "./actions.cookies";
import { formatFirebaseTimestamp } from "@/lib/utils";

// Add restaurantId parameter to the function
export const addMenu = async ({ restaurantId, data }: { restaurantId: string; data: TAddMenuFormSchema }) => {
  await initAdmin();
  const firestore = getFirestore();

  try {
    // Get reference to the specific restaurant
    const restaurantRef = firestore.collection("restaurants").doc(restaurantId);
    if (!(await restaurantRef.get()).exists) {
      return {
        success: false,
        error: "Restaurant not found"
      };
    }

    // Add menu to the menus subcollection
    const menuRef = await restaurantRef.collection("menus").add({
      ...data,
      sections: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    });

    revalidatePath("/restaurant/menu");

    console.log("Menu created with ID: ", menuRef.id);
    return {
      success: true,
      menuId: menuRef.id
    };
  } catch (error) {
    console.error("Error creating menu:", error);
    return {
      success: false,
      error: "Failed to create menu"
    };
  }
};

export const getRestaurantMenus = async (restaurantId: string) => {
  await initAdmin();
  const firestore = getFirestore();

  try {
    const menusRef = firestore
      .collection("restaurants")
      .doc(restaurantId)
      .collection("menus");

    const menusSnapshot = await menusRef.get();

    if (menusSnapshot.empty) {
      return {
        success: true,
        menus: []
      };
    }

    const menus: Menu[] = menusSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamps to JavaScript Dates
      name: doc.data().name,
      startDate: formatFirebaseTimestamp(doc.data().startDate),
      endDate: formatFirebaseTimestamp(doc.data().endDate),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sections: doc.data().sections.map((section: any) => ({
        ...section,
        createdAt: formatFirebaseTimestamp(section.createdAt)
      })
      ),
      createdAt: formatFirebaseTimestamp(doc.data().createdAt),
      updatedAt: formatFirebaseTimestamp(doc.data().updatedAt),
    }));

    return {
      success: true,
      menus
    };

  } catch (error) {
    console.error("Error fetching menus:", error);
    return {
      success: false,
      error: "Failed to fetch menus"
    };
  }
};

export const getRestaurantIdForAdmin = async () => {
  return (await getUser())?.restaurantId as string;
}

export const getMenu = async (restaurantId: string, menuId: string) => {
  await initAdmin();
  const firestore = getFirestore();

  try {
    const menuRef = firestore
      .collection("restaurants")
      .doc(restaurantId)
      .collection("menus")
      .doc(menuId);

    const menuSnapshot = await menuRef.get();

    if (!menuSnapshot.exists) {
      return {
        success: false,
        error: "Menu not found"
      };
    }


    const menu = {
      id: menuSnapshot.id,
      ...menuSnapshot.data(),
      name: menuSnapshot.data()?.name,
      // Convert Firestore Timestamps to JavaScript Dates
      startDate: menuSnapshot.data()?.startDate.toDate(),
      endDate: menuSnapshot.data()?.endDate.toDate(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sections: menuSnapshot.data()?.sections.map((section: any) => ({
        ...section,
        createdAt: formatFirebaseTimestamp(section.createdAt),
      })),
      createdAt:formatFirebaseTimestamp( menuSnapshot.data()?.createdAt),
      updatedAt: formatFirebaseTimestamp(menuSnapshot.data()?.updatedAt),
    } as Menu;

    return {
      success: true,
      menu
    };

  } catch (error) {
    console.error("Error fetching menu:", error);
    return {
      success: false,
      error: "Failed to fetch menu"
    };
  }
}


export async function deleteMenu(menuId: string) {
  await initAdmin();
  const firestore = getFirestore();

  const restaurantId = await getRestaurantIdForAdmin();

  try {
    const menuRef = firestore
      .collection("restaurants")
      .doc(restaurantId)
      .collection("menus")
      .doc(menuId);

    await menuRef.delete();
    revalidatePath("/restaurant/menu");
    return {
      success: true, 
      menu : menuId, 
    };

  } catch (error) {
    console.error("Error deleting menu:", error);
    return {
      success: false,
      error: "Failed to delete menu"
    };
  }
}

export async function addMenuSection(menuId: string, sectionName: string) {
  await initAdmin();
  const firestore = getFirestore();
  const restaurantId = await getRestaurantIdForAdmin();

  try {
    const menuRef = firestore
      .collection("restaurants")
      .doc(restaurantId)
      .collection("menus")
      .doc(menuId);

    const menuDoc = await menuRef.get();
    if (!menuDoc.exists) {
      return { success: false, error: "Menu not found" };
    }

    const currentSections = menuDoc.data()?.sections || [];
    const newSection = {
      id: crypto.randomUUID(),
      name: sectionName,
      items: [],
      createdAt: new Date(),
    };

    await menuRef.update({
      sections: [...currentSections, newSection],
      updatedAt: new Date(),
    });

    revalidatePath(`/restaurant/menu/${menuId}`);
    return { success: true, section: newSection };

  } catch (error) {
    console.error("Error adding menu section:", error);
    return { success: false, error: "Failed to add section" };
  }
}


export const addMenuSectionItem = async(menuId: string, sectionId: string, item: MenuItem) => {
  await initAdmin(); 
  const firestore = getFirestore();
  const restaurantId = await getRestaurantIdForAdmin();
  try {
    const menuRef = firestore.collection("restaurants").doc(restaurantId).collection("menus").doc(menuId);
    const menuDoc = await menuRef.get();
    if(!menuDoc.exists){
      throw new Error("Menu not found");
    }
    const currentSections = menuDoc.data()?.sections || [];
    const sectionIndex = currentSections.findIndex((section: MenuSection) => section.id === sectionId);
    if(sectionIndex === -1){
      throw new Error("Section not found");
    }

    // Use Firestore Timestamp instead of Date
    // const timestamp = firestore.Timestamp.now();

    currentSections[sectionIndex].items.push({
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toString()// Changed from new Date()
    })

    // Update the menu document with the modified sections array
    await menuRef.update({
      sections: currentSections,
      updatedAt: new Date().toString() // Changed from new Date()
    });

  
    revalidatePath(`/restaurant/menu/${menuId}`);
    return { success: true, item: item };
  } catch (error) {
    return {success: false, error: (error as Error).message}
  }
}



export const deleteMenuSection = async(menuId: string, sectionId: string) => {
  await initAdmin();
  const firestore = getFirestore();
  const restaurantId = await getRestaurantIdForAdmin();

  try {
    const menuRef = firestore.collection("restaurants").doc(restaurantId).collection("menus").doc(menuId);
    const menuDoc = await menuRef.get();
    if(!menuDoc.exists){
      throw new Error("Menu not found");
    }

    const currentSections = menuDoc.data()?.sections || [];
    const sectionIndex = currentSections.findIndex((section: MenuSection) => section.id === sectionId);
    if(sectionIndex === -1){
      throw new Error("Section not found");
    }

    currentSections.splice(sectionIndex, 1);

    await menuRef.update({
      sections: currentSections,
      updatedAt: new Date().toString() // Changed from new Date()
    });


    const menuSnapshot = await menuRef.get();

    const menu = {
      id: menuSnapshot.id,
      ...menuSnapshot.data(),
      name: menuSnapshot.data()?.name,
      // Convert Firestore Timestamps to JavaScript Dates
      startDate: menuSnapshot.data()?.startDate.toDate(),
      endDate: menuSnapshot.data()?.endDate.toDate(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sections: menuSnapshot.data()?.sections.map((section: any) => ({
        ...section,
        createdAt: formatFirebaseTimestamp(section.createdAt),
      })),
      createdAt:formatFirebaseTimestamp( menuSnapshot.data()?.createdAt),
      updatedAt: formatFirebaseTimestamp(menuSnapshot.data()?.updatedAt),
    } as Menu;

    // again fetch the latest data from the database... 

    // const updatedMenuDoc = (await menuRef.get()).data(); ;

    revalidatePath(`/restaurant/menu/${menuId}`);
    return { success: true, menu: menu };
  } catch (error) {
    return {success: false, error: (error as Error).message}
  }
}
export const deleteMenuItem = async(menuId: string, sectionId: string, itemId: string) => {
  await initAdmin();
  const firestore = getFirestore();
  const restaurantId = await getRestaurantIdForAdmin();

  try {
    const menuRef = firestore.collection("restaurants").doc(restaurantId).collection("menus").doc(menuId);
    const menuDoc = await menuRef.get();
    if(!menuDoc.exists){
      throw new Error("Menu not found");
    }

    const currentSections = menuDoc.data()?.sections || [];
    const sectionIndex = currentSections.findIndex((section: MenuSection) => section.id === sectionId);
    if(sectionIndex === -1){
      throw new Error("Section not found");
    }

    const itemIndex = currentSections[sectionIndex].items.findIndex((item: MenuItem) => item.id === itemId);
    if(itemIndex === -1){
      throw new Error("Item not found");
    }

    currentSections[sectionIndex].items.splice(itemIndex, 1);

    await menuRef.update({
      sections: currentSections,
      updatedAt: new Date().toString() // Changed from new Date()
    });

    revalidatePath(`/restaurant/menu/${menuId}`);
    return { success: true };
  } catch (error) {
    return {success: false, error: (error as Error).message}
  }
}