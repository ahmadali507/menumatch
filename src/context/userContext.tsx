'use client'
import { getUser } from "@/actions/actions.cookies";
import { UserData } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";


interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserData = async () => {
      const userData = await getUser();

      if (userData) {
        setUser({
          uid: userData.uid,
          email: userData.email,
          name: userData.name as string,
          role: userData.role || 'user',
          restaurantId: userData.restaurantId || undefined,
        });
      }
      setIsLoading(false);
    };

    checkUserData();
  }, [user?.uid]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};