/* eslint-disable @typescript-eslint/no-require-imports */
const admin = require('firebase-admin');
require('dotenv').config();

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
      const menusSnapshot = await restaurantDoc.ref.collection('menus')
        .where('availabilityType', 'in', ['ramadan', 'custom'])
        .get();

      for (const menuDoc of menusSnapshot.docs) {
        const menu = menuDoc.data();
        const startDate = menu.startDate ? new Date(menu.startDate) : null;
        const endDate = menu.endDate ? new Date(menu.endDate) : null;

        // Skip if dates are not set
        if (!startDate || !endDate) continue;

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
    // Only attempt to delete the app if it exists
    if (admin.apps.length > 0) {
      try {
        await admin.app().delete();
      } catch (deleteError) {
        console.error('Error terminating Firebase app:', deleteError);
      }
    }
  }
}

// Run the script
activateMenus().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});