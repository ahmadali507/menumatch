import { QueryClient } from "@tanstack/react-query"
import { clsx, type ClassValue } from "clsx"
import { firestore } from "firebase-admin"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const queryClient = new QueryClient(); 

export function formatFirebaseTimestamp(timestamp: firestore.Timestamp) {
  return new Date(timestamp.seconds * 1000)
}