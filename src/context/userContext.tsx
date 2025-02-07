'use client'
import { getUserRole } from "@/actions/actions.cookies";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
    uid: string;
    email: string | null;
    name: string | null;
    role: string;
  }
  
  interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
  }
  
  const UserContext = createContext<UserContextType | undefined>(undefined);
  
  export function UserContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const checkUserData = async () => {
        let retries = 3;
        while (retries > 0) {
          try {
            const userData = await getUserRole();
            console.log("User data from cookies:", userData);
  
            if (userData) {
              setUser({
                uid: userData.uid,
                email: userData.email,
                name: userData.name as string,
                role: userData.role || 'user'
              });
              break;
            }
            // Wait for 500ms before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
            retries--;
          } catch (error) {
            console.error('Error fetching user data:', error);
            retries--;
          }
        }
        setIsLoading(false);
      };
  
      checkUserData();
    }, []);
  
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