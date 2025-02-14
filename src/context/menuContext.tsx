
"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import type { Menu } from "@/types";

interface MenuContextType {
  menu: Menu | null;
  setMenu: (menu: Menu | null) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

interface MenuProviderProps {
  children: ReactNode;
  initialMenu?: Menu | null;
}

export function MenuProvider({ children, initialMenu = null }: MenuProviderProps) {
  const [menu, setMenu] = useState<Menu | null>(initialMenu);

  return (
    <MenuContext.Provider value={{ menu, setMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}