import * as admin from 'firebase-admin';
interface FirebaseAdminParams {
    projectId: string,
    clientEmail: string,
    storageBucket: string,
    privateKey: string,
}

function formatPrivateKey(key: string) {
    return key.replace(/\\n/g, '\n');
}

export function createFirebaseAdminApp(params: FirebaseAdminParams) {

    const privateKey = formatPrivateKey(params.privateKey);
    if (admin.apps.length > 0) {
        return admin.app();
    }
    const cert = admin.credential.cert({
        projectId: params.projectId,
        clientEmail: params.clientEmail,
        privateKey: privateKey,

    })

    return admin.initializeApp({
        credential: cert,
        projectId: params.projectId,
        storageBucket: params.storageBucket,

    })
}
export async function initAdmin() {
    const params = {
        projectId: process.env.FIREBASE_PROJECT_ID as string,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
        privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
    }

    return createFirebaseAdminApp(params);
}



// export const adminDb = admin.firestore(); 