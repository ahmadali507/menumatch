/* eslint-disable @typescript-eslint/no-require-imports */
const admin = require('firebase-admin');
require('dotenv').config({ 'path': ".env.local" });

// Admin initialization code
function formatPrivateKey(key) {
  return key.replace(/\\n/g, '\n');
}

function initAdmin() {
  const params = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  };

  const privateKey = formatPrivateKey(params.privateKey);

  if (admin.apps.length > 0) {
    return admin.app();
  }

  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey: privateKey,
  });

  return admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
    storageBucket: params.storageBucket,
  });
}


async function activateMenus() {
  try {
    // Initialize Firebase Admin
    initAdmin();
    const firestore = admin.firestore();

    // Get all restaurants
    const restaurantsSnapshot = await firestore.collection('restaurants').get();

    const batch = firestore.batch();
    const now = new Date();

    for (const restaurantDoc of restaurantsSnapshot.docs) {
      // Get menus subcollection for each restaurant
      const menusSnapshot = await restaurantDoc.ref.collection('menus').get();

      for (const menuDoc of menusSnapshot.docs) {
        const menu = menuDoc.data();
        const startDate = new Date(menu.startDate);
        const endDate = new Date(menu.endDate);

        // Check if menu should be active
        const isActive = now >= startDate && now <= endDate;

        // Update menu document status
        batch.update(menuDoc.ref, { status: isActive ? 'active' : 'inactive' });
      }
    }

    // Commit all updates in a single batch
    await batch.commit();
    console.log('Menu activation status updated successfully');

  } catch (error) {
    console.error('Error updating menu activation status:', error);
    throw error;
  } finally {
    // Terminate the admin app
    await admin.app().delete();
  }
}

// Run the script
activateMenus();