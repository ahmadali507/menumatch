/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { TAddMenuFormSchema } from "@/lib/schema";
import { initAdmin } from "@/firebase/adminFirebase";
import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { Menu, MenuItem, MenuSection } from "@/types";
import { getUser } from "./actions.cookies";
import { formatFirebaseTimestamp } from "@/lib/format";
import QRCode from 'qrcode';
import { RAMADAN_DATES } from "@/lib/utils";
import { LanguageCode } from "@/lib/languages";

// Update the existing addMenu function
export const addMenu = async ({ restaurantId, data }: {
  restaurantId: string;
  data: TAddMenuFormSchema & { language: LanguageCode }
}) => {
  await initAdmin();
  const firestore = getFirestore();

  try {
    const restaurantRef = firestore.collection("restaurants").doc(restaurantId);
    if (!(await restaurantRef.get()).exists) {
      return {
        success: false,
        error: "Restaurant not found"
      };
    }

    const now = new Date();
    let status: "active" | "inactive" = 'active'; // Default status
    let menuData: Omit<Menu, "id"> = {
      name: data.name,
      sections: [],
      language: data.language,
      availabilityType: data.availabilityType,
      createdAt: now,
      updatedAt: now,
      status: 'active' // Will be updated based on dates
    };

    // Handle different availability types
    switch (data.availabilityType) {
      case 'custom':
        // Check if current date is within range
        status = (now >= data.startDate! && now <= data.endDate!) ? 'active' : 'inactive';
        menuData = {
          ...menuData,
          startDate: data.startDate,
          endDate: data.endDate,
          status
        };
        break;

      case 'ramadan':
        const currentYear = now.getFullYear();
        const ramadanDates = RAMADAN_DATES[currentYear as keyof typeof RAMADAN_DATES];

        if (!ramadanDates) {
          throw new Error('Ramadan dates not available for the current year');
        }

        // Check if current date is within Ramadan period
        status = (now >= ramadanDates.start && now <= ramadanDates.end) ? 'active' : 'inactive';

        menuData = {
          ...menuData,
          startDate: ramadanDates.start,
          endDate: ramadanDates.end,
          status
        };
        break;

      case 'indefinite':
        // For indefinite menus, status is always active
        menuData = {
          ...menuData,
          status: 'active'
        };
        break;
    }

    const menuRef = await restaurantRef.collection("menus").add(menuData);

    revalidatePath("/restaurant/menu");
    revalidatePath(`/restaurants/${restaurantId}/menu/${menuRef.id}`);

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
      status: doc.data().status || 'active',
      availabilityType: doc.data().availabilityType,
      startDate: doc.data().startDate && formatFirebaseTimestamp(doc.data().startDate),
      endDate: doc.data().endDate && formatFirebaseTimestamp(doc.data().endDate),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sections: doc.data().sections.map((section: any) => ({
        ...section,
        createdAt: formatFirebaseTimestamp(section.createdAt),
        items: section.items.map((item: MenuItem) => {
          return {
            ...item,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            createdAt: formatFirebaseTimestamp(item.createdAt as any),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updatedAt: formatFirebaseTimestamp(item.updatedAt as any)
          }
        })
      })
      ),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createdAt: formatFirebaseTimestamp(doc.data().createdAt as any),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updatedAt: formatFirebaseTimestamp(doc.data().updatedAt as any),
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


    const menu =
      {
        id: menuSnapshot.id,
        ...menuSnapshot.data(),
        name: menuSnapshot.data()?.name,
        // Convert Firestore Timestamps to JavaScript Dates
        startDate: menuSnapshot.data()?.startDate && formatFirebaseTimestamp(menuSnapshot.data()?.startDate),
        endDate: menuSnapshot.data()?.endDate && formatFirebaseTimestamp(menuSnapshot.data()?.endDate),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sections: menuSnapshot.data()?.sections.map((section: any) => ({
          ...section,
          createdAt: formatFirebaseTimestamp(section.createdAt),
          items: section.items.map((item: MenuItem) => ({
            ...item,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            createdAt: formatFirebaseTimestamp(item.createdAt as any),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updatedAt: formatFirebaseTimestamp(item.updatedAt as any)
          }))
        })),
        createdAt: formatFirebaseTimestamp(menuSnapshot.data()?.createdAt),
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


export async function deleteMenu({ menuId, restaurantId }: { menuId: string , restaurantId: string | null }) {
  await initAdmin();
  const firestore = getFirestore();


  if(restaurantId === null){
    restaurantId = await getRestaurantIdForAdmin();
  }

  try {
    // Get restaurant ID from the menu document
    const menuDoc = await firestore.collection("restaurants").doc(restaurantId).collection("menus").doc(menuId).get();
    // restaurantId = menuDoc.data()?.restaurantId;
    console.log("menuDoc", menuDoc);

    if (!restaurantId) throw new Error("Restaurant ID not found");

    const menuRef = firestore
      .collection("restaurants")
      .doc(restaurantId)
      .collection("menus")
      .doc(menuId);

    await menuRef.delete();
    revalidatePath("/restaurant/menu");
    return { success: true };

  } catch (error) {
    console.error("Error deleting menu:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to delete menu"
    };
  }
}

export async function addMenuSection(menuId: string, sectionName: string, restaurantId: string) {
  await initAdmin();
  const firestore = getFirestore();
  // const restaurantId = await getRestaurantIdForAdmin();

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


export const addMenuSectionItem = async (menuId: string, sectionId: string, item: MenuItem, restaurantId: string | null) => {
  await initAdmin();
  const firestore = getFirestore();
  if (restaurantId === null) {
    restaurantId = await getRestaurantIdForAdmin();
  }
  try {
    const menuRef = firestore.collection("restaurants").doc(restaurantId as string).collection("menus").doc(menuId);
    const menuDoc = await menuRef.get();
    if (!menuDoc.exists) {
      throw new Error("Menu not found");
    }
    const currentSections = menuDoc.data()?.sections || [];
    const sectionIndex = currentSections.findIndex((section: MenuSection) => section.id === sectionId);
    if (sectionIndex === -1) {
      throw new Error("Section not found");
    }

    // Use Firestore Timestamp instead of Date
    // const timestamp = firestore.Timestamp.now();

    currentSections[sectionIndex].items.push({
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date()// Changed from new Date()
    })

    // Update the menu document with the modified sections array
    await menuRef.update({
      sections: currentSections,
      updatedAt: new Date() // Changed from new Date()
    });


    revalidatePath(`/restaurant/menu/${menuId}`);
    revalidatePath(`/restaurants/${restaurantId}/menu/${menuId}`);
    return { success: true, item: item };
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}



export const deleteMenuSection = async (menuId: string, sectionId: string, restaurantId: string | null) => {
  await initAdmin();
  const firestore = getFirestore();
  if (restaurantId === null) {
    restaurantId = await getRestaurantIdForAdmin();
  }

  try {
    const menuRef = firestore.collection("restaurants").doc(restaurantId).collection("menus").doc(menuId);
    const menuDoc = await menuRef.get();
    if (!menuDoc.exists) {
      throw new Error("Menu not found");
    }

    const currentSections = menuDoc.data()?.sections || [];
    const sectionIndex = currentSections.findIndex((section: MenuSection) => section.id === sectionId);
    if (sectionIndex === -1) {
      throw new Error("Section not found");
    }

    currentSections.splice(sectionIndex, 1);

    await menuRef.update({
      sections: currentSections,
      updatedAt: new Date() // Changed from new Date()
    });


    const menuSnapshot = await menuRef.get();

    const menu = {
      id: menuSnapshot.id,
      ...menuSnapshot.data(),
      name: menuSnapshot.data()?.name,
      // Convert Firestore Timestamps to JavaScript Dates
      startDate: menuSnapshot.data()?.startDate && formatFirebaseTimestamp(menuSnapshot.data()?.startDate),
      endDate: menuSnapshot.data()?.endDate && formatFirebaseTimestamp(menuSnapshot.data()?.endDate),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sections: menuSnapshot.data()?.sections.map((section: any) => ({
        ...section,
        createdAt: formatFirebaseTimestamp(section.createdAt),
        items: section.items.map((item: MenuItem) => ({
          ...item,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          createdAt: formatFirebaseTimestamp(item.createdAt as any),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          updatedAt: formatFirebaseTimestamp(item.updatedAt as any)
        }))
      })),
      createdAt: formatFirebaseTimestamp(menuSnapshot.data()?.createdAt),
      updatedAt: formatFirebaseTimestamp(menuSnapshot.data()?.updatedAt),
    } as Menu;

    // again fetch the latest data from the database... 

    // const updatedMenuDoc = (await menuRef.get()).data(); ;

    revalidatePath(`/restaurant/menu/${menuId}`);
    return { success: true, menu: menu };
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
export const deleteMenuItem = async (menuId: string, sectionId: string, itemId: string, restaurantId: string | null) => {
  await initAdmin();
  const firestore = getFirestore();
  if (restaurantId === null) {
    restaurantId = await getRestaurantIdForAdmin();
  }

  try {
    const menuRef = firestore.collection("restaurants").doc(restaurantId).collection("menus").doc(menuId);
    const menuDoc = await menuRef.get();
    if (!menuDoc.exists) {
      throw new Error("Menu not found");
    }

    const currentSections = menuDoc.data()?.sections || [];
    const sectionIndex = currentSections.findIndex((section: MenuSection) => section.id === sectionId);
    if (sectionIndex === -1) {
      throw new Error("Section not found");
    }

    const itemIndex = currentSections[sectionIndex].items.findIndex((item: MenuItem) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Item not found");
    }

    currentSections[sectionIndex].items.splice(itemIndex, 1);

    await menuRef.update({
      sections: currentSections,
      updatedAt: new Date() // Changed from new Date()
    });


    const menuSnapshot = await menuRef.get();

    const menu = {
      id: menuSnapshot.id,
      ...menuSnapshot.data(),
      name: menuSnapshot.data()?.name,
      // Convert Firestore Timestamps to JavaScript Dates
      startDate: menuSnapshot.data()?.startDate && formatFirebaseTimestamp(menuSnapshot.data()?.startDate),
      endDate: menuSnapshot.data()?.endDate && formatFirebaseTimestamp(menuSnapshot.data()?.endDate),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sections: menuSnapshot.data()?.sections.map((section: any) => ({
        ...section,
        createdAt: formatFirebaseTimestamp(section.createdAt),
        items: section.items.map((item: MenuItem) => ({
          ...item,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          createdAt: formatFirebaseTimestamp(item.createdAt as any),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          updatedAt: formatFirebaseTimestamp(item.updatedAt as any)
        }))
      })),
      createdAt: formatFirebaseTimestamp(menuSnapshot.data()?.createdAt),
      updatedAt: formatFirebaseTimestamp(menuSnapshot.data()?.updatedAt),
    } as Menu;

    revalidatePath(`/restaurant/menu/${menuId}`);
    return { success: true, menu: menu };
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function generateMenuQRCode(menuId: string, restaurantId: string | null) {
  await initAdmin();
  const firestore = getFirestore();

  if (restaurantId === null) {
    restaurantId = await getRestaurantIdForAdmin();
  } try {
    const menuRef = firestore
      .collection("restaurants")
      .doc(restaurantId)
      .collection("menus")
      .doc(menuId);

    // Generate QR code URL for the menu
    const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${restaurantId}/menu/${menuId}`;
    console.log("here is the menu url for the new qr code", menuUrl);
    const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    // Save QR code to Firestore
    await menuRef.update({
      qrCode: {
        url: qrCodeDataUrl
        // createdAt: new Date()
      }
      // updatedAt: new Date()
    });

    revalidatePath(`/restaurant/menu/${menuId}`);

    return {
      success: true,
      qrCode: qrCodeDataUrl
    };
  } catch (error) {
    console.error("Error generating QR code:", error);
    return {
      success: false,
      error: "Failed to generate QR code"
    };
  }
}

///////////////  Update Menu Section Name //////////////////////

export const updateMenuSectionName = async (menuId: string, sectionId: string, newName: string, restaurantId : string | null) => {
  await initAdmin();
  const firestore = getFirestore();
  if(restaurantId === null){
    restaurantId = await getRestaurantIdForAdmin();
  }

  try {
    const menuRef = firestore.collection("restaurants").doc(restaurantId).collection("menus").doc(menuId);
    const menuDoc = await menuRef.get();
    if (!menuDoc.exists) {
      throw new Error("Menu not found");
    }

    const currentSections = menuDoc.data()?.sections || [];
    const sectionIndex = currentSections.findIndex((section: MenuSection) => section.id === sectionId);
    if (sectionIndex === -1) {
      throw new Error("Section not found");
    }

    // Update section name
    currentSections[sectionIndex].name = newName;

    await menuRef.update({
      sections: currentSections,
      updatedAt: new Date(),
    });

    // Format the updated section before returning
    const updatedSection = {
      ...currentSections[sectionIndex],
      createdAt: formatFirebaseTimestamp(currentSections[sectionIndex].createdAt),
      items: currentSections[sectionIndex].items.map((item: MenuItem) => ({
        ...item,
        createdAt: formatFirebaseTimestamp(item.createdAt as any),
        updatedAt: formatFirebaseTimestamp(item.updatedAt as any)
      }))
    };

    revalidatePath(`/restaurant/menu/${menuId}`);
    revalidatePath(`/restaurants/${restaurantId}/menu/${menuId}`);
    return {
      success: true,
      section: updatedSection
    };
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/////////// edit single item in a section /////////////////////

export const updateSectionItem = async (restaurantId: string | null, menuId: string, sectionId: string, itemId: string, data: MenuItem) => {
  await initAdmin();
  const firestore = getFirestore();
  if (restaurantId === null) {
    restaurantId = await getRestaurantIdForAdmin();
  }

  try {
    const menuRef = firestore.collection("restaurants").doc(restaurantId).collection("menus").doc(menuId);
    const menuDoc = await menuRef.get();
    if (!menuDoc.exists) {
      throw new Error("Menu not found");
    }

    const currentSections = menuDoc.data()?.sections || [];
    const sectionIndex = currentSections.findIndex((section: MenuSection) => section.id === sectionId);
    if (sectionIndex === -1) {
      throw new Error("Section not found");
    }

    const itemIndex = currentSections[sectionIndex].items.findIndex((item: MenuItem) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Item not found");
    }

    // Create updated item with proper timestamp
    const updatedItem = {
      ...data,
      id: itemId,
      createdAt: currentSections[sectionIndex].items[itemIndex].createdAt, // Preserve original creation date
      updatedAt: new Date(), // Add update timestamp
    };

    // Update the item in sections array
    currentSections[sectionIndex].items[itemIndex] = updatedItem;

    // Update the menu document
    await menuRef.update({
      sections: currentSections,
      updatedAt: new Date(),
    });

    // Format the updated item for response
    const formattedItem = {
      ...updatedItem,
      createdAt: formatFirebaseTimestamp(updatedItem.createdAt),
      updatedAt: (updatedItem.updatedAt),
    };

    revalidatePath(`/restaurant/menu/${menuId}`);
    return { success: true, item: formattedItem };
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}


//////////// reordering the items in a ceratin section based onthe drag and drop functionlaity /////////////////// 

export const reorderItems = async (restaurantId: string|null, menuId: string, sectionId: string, reorderedList: MenuItem[]) => {
  await initAdmin();
  const firestore = getFirestore();
  // const restaurantId = await getRestaurantIdForAdmin();
  if(restaurantId === null){
    restaurantId = await getRestaurantIdForAdmin(); 
  }

  try {
    const menuRef = firestore
      .collection('restaurants')
      .doc(restaurantId)
      .collection("menus")
      .doc(menuId);

    const menuDoc = await menuRef.get();
    if (!menuDoc.exists) {
      throw new Error("Menu not found");
    }

    const currentSections = menuDoc.data()?.sections || [];
    const sectionIndex = currentSections.findIndex((section: MenuSection) => section.id === sectionId);
    if (sectionIndex === -1) {
      throw new Error("Section not found");
    }

    // Update the items in the section with the reordered list
    currentSections[sectionIndex].items = reorderedList;

    // Update the menu document with the new sections array
    await menuRef.update({
      sections: currentSections,
      updatedAt: new Date()
    });

    revalidatePath(`/restaurant/menu/${menuId}`);
    return { success: true, items: reorderedList };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

////// now writing a function to reorder the sectiosn ////////// 

export const reorderSections = async (restaurantId: string | null, menuId: string, reorderedList: MenuSection[]) => {
  await initAdmin();
  const firestore = getFirestore();
  if(restaurantId === null){
    restaurantId = await getRestaurantIdForAdmin(); 
  }

  
  try {
    const menuRef = firestore.collection("restaurants").doc(restaurantId).collection("menus").doc(menuId);

    const menuDoc = await menuRef.get();
    if (!menuDoc.exists) {
      throw new Error("Menu not found");
    }

    // update hte menu document with the reordered Sections... 
    await menuRef.update({
      sections: reorderedList,
      updatedAt: new Date()
    });

    // Format the sections for response
    const formattedSections = reorderedList.map(section => ({
      ...section,
      createdAt: new Date()
    }));

    revalidatePath(`/restaurant/menu/${menuId}`);
    return {
      success: true,
      sections: formattedSections
    };


  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export const addMenuPromo = async (menuId: string, content: string,restaurantId: string | null) => {
  await initAdmin();
  const firestore = getFirestore();
  // const restaurantId = await getRestaurantIdForAdmin();
  if(restaurantId === null){
    restaurantId = await getRestaurantIdForAdmin(); 
  }

  try {
    const menuRef = firestore
      .collection("restaurants")
      .doc(restaurantId)
      .collection("menus")
      .doc(menuId);

    const menuDoc = await menuRef.get();
    if (!menuDoc.exists) {
      throw new Error("Menu not found");
    }

    await menuRef.update({
      promoContent: content,
      updatedAt: new Date(),
    } satisfies Pick<Menu, "promoContent" | "updatedAt">);

    revalidatePath(`/restaurant/menu/${menuId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    };
  }
};

export async function getAllMenus(restaurantId: string): Promise<{
  success: boolean;
  menus: (Omit<Menu, "sections"> & { sectionsCount: number })[];
  error?: string;
}> {
  try {
    await initAdmin();
    const firestore = getFirestore();
    const menusRef = firestore.collection("restaurants").doc(restaurantId).collection("menus");
    const snapshot = await menusRef.get();
    const menus = snapshot.docs.map(doc => ({
      id: doc.id,
      "name": doc.data().name,
      "status": doc.data().status,
      "availabilityType": doc.data().availabilityType,
      sectionsCount: doc.data().sections.length,
      "language": doc.data().language,
      createdAt: formatFirebaseTimestamp(doc.data().createdAt),
      updatedAt: formatFirebaseTimestamp(doc.data().updatedAt),
      startDate: doc.data().startDate && formatFirebaseTimestamp(doc.data().startDate),
      endDate: doc.data().endDate && formatFirebaseTimestamp(doc.data().endDate),
    }));

    return {
      success: true,
      menus
    };
  } catch (error) {
    return {
      success: false,
      menus: [],
      error: (error as Error).message || 'Failed to fetch menus'
    };
  }
}

export async function updateMenuData(menuId: string, menuData: Menu, restaurantId: string | null) {
  await initAdmin();
  const firestore = getFirestore();

  try {

    // const restaurantId = await getRestaurantIdForAdmin();
    if(restaurantId === null){
      restaurantId = await getRestaurantIdForAdmin(); 
    }

    const menuRef = firestore
      .collection("restaurants")
      .doc(restaurantId)
      .collection("menus")
      .doc(menuId);

    const menuDoc = await menuRef.get();
    if (!menuDoc.exists) {
      throw new Error("Menu not found");
    }


    // remove the 'id' property from the imported data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = menuData;

    // Update the menu document
    await menuRef.update({
      ...rest,
      updatedAt: new Date()
    });

    revalidatePath(`/restaurant/menu/${menuId}`);

    return {
      success: true as const,
      menu: {
        ...menuData,
        updatedAt: new Date()
      }
    };

  } catch (error) {
    console.error('Error updating menu:', error);
    return {
      success: false as const,
      error: (error as Error).message || 'Failed to update menu'
    };
  }
}