"use server";

import { getAuth } from "firebase-admin/auth";
// import { TEditRestaurant } from "@/lib/schema";
import { initAdmin } from "@/firebase/adminFirebase";
import { Menu, RestaurantType, resAdminType } from "@/types";
import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { getStorage } from 'firebase-admin/storage';
import { formatFirebaseTimestamp } from "@/lib/format";


type SuperAdminData = {
  name: string,
  email: string,
  password: string,
  role: string,
}

/////////////// FUNCTION TO CREATE A SUPER_ADMIN WITH A CUSTOM CLAIM //////////////////

export const createSuperAdmin = async (data: SuperAdminData) => {
  await initAdmin();
  const firestore = getFirestore();
  const auth = getAuth();
  // now we need to create a superAdmin and then assign it a custom claim of role: "super Admin"
  const userRecord = await auth.createUser({
    email: data.email,
    password: data.password,
    displayName: data.name,
  });

  if (!userRecord) {
    return { error: "Failed to create user" }
  }
  await auth.setCustomUserClaims(userRecord?.uid, {
    role: "super_admin",
  }).then(() => {
    console.log("Custom claim assigned successfully");
  }).catch((err) => {
    console.log("error while assigning custom claim setup ", err);
  })
  // now storing hte data of the superAdmin to the firestore  ... 
  const userAdded = await firestore.collection("users").doc(userRecord.uid).set({
    name: data.name,
    email: data.email,
    role: "super_admin",
    createdAt: new Date().toISOString(),
  })

  if (!userAdded) {
    return { error: "Failed to add user to the firestore" };
  }
  console.log("User added to the firestore", userAdded);

  return {
    success: true,
    message: "Super admin created successfully",
    data: {
      id: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName,
      role: "super_admin"
    }
  }
}

///////////////////  Restaurant creation and admin creation tasks //////////////////////


export const createRestaurant = async (formData: FormData, idToken: string) => {
  try {


    await initAdmin();
    const auth = getAuth();
    const firestore = getFirestore();
    const storage = getStorage();
    const bucket = storage.bucket();


    const claims = await auth.verifyIdToken(idToken);
    if (claims.role !== "super_admin") {
      throw new Error("You are not authorized to create Restaurants");
    }

    // Parse the JSON data
    const data = JSON.parse(formData.get('data') as string);
    let logoUrl = null;
    let backgroundUrl = null;

    // Handle logo upload
    const logoFile = formData.get('logo') as File;
    if (logoFile) {
      const logoBuffer = await logoFile.arrayBuffer();
      const logoFileName = `restaurants/${Date.now()}_logo_${logoFile.name}`;
      const logoFileUpload = bucket.file(logoFileName);

      await logoFileUpload.save(Buffer.from(logoBuffer), {
        metadata: { contentType: logoFile.type }
      });

      [logoUrl] = await logoFileUpload.getSignedUrl({
        action: 'read',
        expires: '01-01-2500'
      });
    }

    // Handle background upload
    const backgroundFile = formData.get('background') as File;
    if (backgroundFile) {
      const backgroundBuffer = await backgroundFile.arrayBuffer();
      const backgroundFileName = `restaurants/${Date.now()}_background_${backgroundFile.name}`;
      const backgroundFileUpload = bucket.file(backgroundFileName);

      await backgroundFileUpload.save(Buffer.from(backgroundBuffer), {
        metadata: { contentType: backgroundFile.type }
      });

      [backgroundUrl] = await backgroundFileUpload.getSignedUrl({
        action: 'read',
        expires: '01-01-2500'
      });
    }

    // Create restaurant document with image URLs
    const restaurantData = {
      ...data,
      images: {
        logo: logoUrl,
        background: backgroundUrl
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to Firestore
    const restaurantRef = await firestore.collection('restaurants').add(restaurantData);

    return {
      success: true,
      restaurantId: restaurantRef.id
    };
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create restaurant'
    };
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

export const editRestaurant = async (
  restaurantId: string,
  formData: FormData,
  idToken: string
) => {
  try {
    await initAdmin();
    const storage = getStorage();
    const bucket = storage.bucket();
    const firestore = getFirestore();


    ///////// validate hte user role ... only super admin can edit the restaurant information//////////// 

    const auth = getAuth();
    const claims = await auth.verifyIdToken(idToken);
    if (claims.role !== "super_admin") {
      throw new Error("You are not authorized to edit Restaurants");
    }

    // Get and validate the data payload
    const dataStr = formData.get('data');
    if (!dataStr || typeof dataStr !== 'string') {
      throw new Error('Invalid form data');
    }

    const data = JSON.parse(dataStr);
    const imageUrls = { ...data.images };

    // Process logo upload
    const logoFile = formData.get('logo');
    if (logoFile instanceof Blob) {
      const buffer = Buffer.from(await logoFile.arrayBuffer());
      const logoPath = `restaurants/${restaurantId}/logo_${Date.now()}.jpg`;
      const logoRef = bucket.file(logoPath);

      await logoRef.save(buffer, {
        metadata: { contentType: 'image/jpeg' }
      });

      const [url] = await logoRef.getSignedUrl({
        action: 'read',
        expires: '01-01-2500'
      });
      imageUrls.logo = url;
    }

    // Process background upload
    const bgFile = formData.get('background');
    if (bgFile instanceof Blob) {
      const buffer = Buffer.from(await bgFile.arrayBuffer());
      const bgPath = `restaurants/${restaurantId}/background_${Date.now()}.jpg`;
      const bgRef = bucket.file(bgPath);

      await bgRef.save(buffer, {
        metadata: { contentType: 'image/jpeg' }
      });

      const [url] = await bgRef.getSignedUrl({
        action: 'read',
        expires: '01-01-2500'
      });
      imageUrls.background = url;
    }

    // Update restaurant document
    const restaurantRef = firestore.collection('restaurants').doc(restaurantId);
    const updateData = {
      ...data,
      images: imageUrls,
      updatedAt: new Date().toISOString()
    };

    await restaurantRef.update(updateData);

    return {
      success: true,
      restaurant: {
        id: restaurantId,
        ...updateData
      }
    };
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update restaurant'
    };
  }
};

export const deleteRestaurant = async (restaurantId: string, idToken: string) => {
  await initAdmin();
  const firestore = getFirestore();
  const auth = getAuth();
  try {
    const claims = await auth.verifyIdToken(idToken);
    if (claims.role !== "super_admin") {
      throw new Error("You are not authorized to delete Restaurants");
    }
    console.log("Deleteing the restaurant with id", restaurantId);
    await firestore.collection("restaurants").doc(restaurantId).delete();

    revalidatePath("/restaurants");
    return { success: true, message: "Restaurant deleted successfully" };
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return { success: false, error: (error as Error).message || "Failed to delete restaurant" };
  }
}

///////////////////////////// RESTAURANT ADMIN CREATION AND FETCHING /////////////////////////

export const addRestaurantAdmin = async (data: resAdminType, idToken: string) => {
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

export const getRestaurantData = async (restaurantId: string) => {
  await initAdmin();
  const firestore = getFirestore();

  try {
    const [restaurantSnap, adminResponse, menusSnapshot] = await Promise.all([
      firestore.collection('restaurants').doc(restaurantId).get(),
      fetchRestaurantAdmins(restaurantId),
      firestore.collection('restaurants').doc(restaurantId).collection('menus').get()
    ]);

    if (!restaurantSnap.exists) {
      return notFound();
    }

    // Get the base restaurant data
    const restaurantData = {
      id: restaurantId,
      ...restaurantSnap.data(),
      name: restaurantSnap.data()?.name || '',
      location: restaurantSnap.data()?.location || '',
      contact: restaurantSnap.data()?.contact || '',
      status: restaurantSnap.data()?.status || '',
      description: restaurantSnap.data()?.description || '',
      cuisine: restaurantSnap.data()?.cuisine || [],
      menu: restaurantSnap.data()?.menu || [],
      images: {
        logo: restaurantSnap.data()?.images?.logo || null,
        background: restaurantSnap.data()?.images?.background || null
      },
      orders: restaurantSnap.data()?.orders || [],
      admins: [],
      menus: []
    } as RestaurantType;

    // Add admin information
    if (adminResponse.success && adminResponse.admins) {
      restaurantData.admins = adminResponse.admins;
    } else {
      console.error('Failed to fetch admins:', adminResponse.error);
      restaurantData.admins = [];
    }

    // Add menus from subcollection
    if (!menusSnapshot.empty) {
      restaurantData.menus = menusSnapshot.docs.map(doc => (
        {
          id: doc.id,
          ...doc.data(),
          name: doc.data()?.name,
          // Convert Firestore Timestamps to JavaScript Dates
          startDate: doc.data()?.startDate && formatFirebaseTimestamp(doc.data().startDate),
          endDate: doc.data()?.endDate && formatFirebaseTimestamp(doc.data().endDate),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          sections: doc.data()?.sections.map((section: any) => ({
            ...section,
            createdAt: formatFirebaseTimestamp(section.createdAt),
          })),
          createdAt: formatFirebaseTimestamp(doc.data()?.createdAt),
          updatedAt: formatFirebaseTimestamp(doc.data()?.updatedAt),
          // "qrCode": {
          //   ...doc.data()?.qrCode,
          //   "createdAt": formatFirebaseTimestamp(menuSnapshot.data()?.qrCode.createdAt)
          // }
        } as Menu
      ));

    }

    return restaurantData;
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
    throw new Error('Failed to fetch restaurant data');
  }
};
