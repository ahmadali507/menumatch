'use server'

import { initAdmin } from "@/firebase/adminFirebase";
import { VersionDataType } from "@/types";
import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from 'next/cache';

export async function saveMenuVersion(
  restaurantId: string,
  menuId: string,
  tag: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    await initAdmin();
    const db = getFirestore();

    // Get menu from the correct subcollection path
    const menuRef = db.collection('restaurants')
      .doc(restaurantId)
      .collection('menus')
      .doc(menuId);

    const menu = await menuRef.get();
    if (!menu.exists) {
      return { success: false, error: 'Menu not found' };
    }

    // Create new version
    const versionData = {
      menuId,
      restaurantId,
      tag,
      menuData: menu.data(),
      createdAt: new Date()
    };

    await db.collection('versions').add(versionData);

    return {
      success: true,
      message: 'Menu version saved successfully',
    };
  } catch (error) {
    console.error('Error saving menu version:', error);
    return { success: false, error: 'Failed to save menu version' };
  }
}

export const getMenuVersions =
  async (restaurantId: string, menuId: string) => {
    try {
      await initAdmin();
      const db = getFirestore();

      const versionsSnapshot = await db
        .collection('versions')
        .where('menuId', '==', menuId)
        .where('restaurantId', '==', restaurantId)
        .orderBy('createdAt', 'desc')
        .get();

      // Convert Firestore timestamps to ISO strings for serialization
      const versions = versionsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          tag: data.tag,
          createdAt: data.createdAt.toDate().toISOString()
        } as VersionDataType;
      });

      return {
        success: true,
        versions
      };
    } catch (error) {
      // Safe error logging
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching versions:', errorMessage);
      return {
        success: false,
        error: 'Failed to fetch versions',
        versions: []
      };
    }
  }

export async function switchToVersion(
  restaurantId: string,
  menuId: string,
  versionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await initAdmin();
    const db = getFirestore();

    const versionDoc = await db.collection('versions').doc(versionId).get();
    if (!versionDoc.exists) {
      return { success: false, error: 'Version not found' };
    }

    const versionData = versionDoc.data();

    // Update the menu with version data
    await db.collection('restaurants')
      .doc(restaurantId)
      .collection('menus')
      .doc(menuId)
      .update({
        sections: versionData?.menuData.sections,
        updatedAt: new Date()
      });

    revalidatePath(`/restaurant/menu/${menuId}`);
    revalidatePath(`/restaurants/${restaurantId}/menu/${menuId}`); // Super admin path
    revalidatePath(`/restaurants/${restaurantId}`); // Super admin restaurant page


    return { success: true };
  } catch (error) {
    console.error('Error switching version:', error);
    return { success: false, error: 'Failed to switch version' };
  }
}
