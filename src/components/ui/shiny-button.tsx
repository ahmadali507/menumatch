import { PropsWithChildren } from "react";

export function ShinyButton({ children }: PropsWithChildren) {
  return <button className="p-[4px] relative">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
    <div className="px-8 py-1  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
      {children}
    </div>
  </button>
}