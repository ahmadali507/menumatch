import { firestore } from "firebase-admin";



export function formatFirebaseTimestamp(timestamp: firestore.Timestamp) {
  return new Date(timestamp.seconds * 1000)
}


// will test this later at one moment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SerializableData = { [key: string]: any } | any[];

export function serializeData<T extends SerializableData>(data: T): T {
  if (!data) return data;

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => serializeData(item)) as T;
  }

  // Handle objects
  if (typeof data === 'object') {
    // Handle Firebase Timestamp
    if (data instanceof firestore.Timestamp) {
      return formatFirebaseTimestamp(data) as unknown as T;
    }

    // Handle regular objects
    const serialized: SerializableData = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeData(value);
    }
    return serialized as T;
  }

  // Return primitive values as is
  return data;
}