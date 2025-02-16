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

// Get command line arguments
const args = process.argv.slice(2);
if (args.length !== 3) {
  console.error('Usage: node script.js <displayName> <email> <password>');
  process.exit(1);
}

const [displayName, email, password] = args;

async function createSuperAdmin() {
  try {
    // Initialize Firebase Admin
    initAdmin();
    const auth = admin.auth();
    const firestore = admin.firestore();

    // Create user in Firebase Auth
    console.log('Creating user in Firebase Auth...');
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });

    if (!userRecord) {
      throw new Error('Failed to create user');
    }

    // Set custom claims
    console.log('Setting custom claims...');
    await auth.setCustomUserClaims(userRecord.uid, {
      role: 'super_admin',
    });

    // Store user data in Firestore
    console.log('Storing user data in Firestore...');
    await firestore.collection('users').doc(userRecord.uid).set({
      name: displayName,
      email,
      role: 'super_admin',
      createdAt: new Date().toISOString(),
    });

    console.log('\nSuper admin created successfully!');
    console.log('--------------------------------');
    console.log('User ID:', userRecord.uid);
    console.log('Name:', userRecord.displayName);
    console.log('Email:', userRecord.email);
    console.log('Role: super_admin');

    process.exit(0);
  } catch (error) {
    console.error('\nError creating super admin:', error);
    process.exit(1);
  }
}

// Run the script
createSuperAdmin();