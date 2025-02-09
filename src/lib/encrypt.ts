
// Encryption key must be exactly 32 bytes for AES-256-GCM
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

if (!ENCRYPTION_KEY!) {
  throw new Error('ENCRYPTION_KEY! environment variable is required');
}

async function getKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);

  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(data: unknown): Promise<string> {
  try {
    const key = await getKey(ENCRYPTION_KEY!);
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encoder.encode(JSON.stringify(data))
    );

    // Combine IV and encrypted data into a single string
    const combinedData = new Uint8Array([
      ...iv,
      ...new Uint8Array(encryptedData)
    ]);

    return Buffer.from(combinedData).toString('base64');
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
}

export async function decryptData(encryptedString: string): Promise<unknown> {
  try {
    const key = await getKey(ENCRYPTION_KEY!);
    const decoder = new TextDecoder();

    // Convert base64 string back to bytes
    const combinedData = new Uint8Array(Buffer.from(encryptedString, 'base64'));

    // Extract IV and encrypted data
    const iv = combinedData.slice(0, 12);
    const encryptedData = combinedData.slice(12);

    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encryptedData
    );

    return JSON.parse(decoder.decode(decryptedData));
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}