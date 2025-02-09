'use client'
import { useUser } from "@/context/userContext";
import NavbarBreadcrumbs from "./breadcrumbs";
import UserDropdown from "./user-dropdown";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { IconButton } from "@mui/material";
// import ThemeToggle from "@/components/theme/ThemeToggle";
import ColorModeSelect from "./theme/ColorModeSelect";

export function SiteHeader() {

  const {user} = useUser(); 


  const userData = {
  
    avatar: "https://randomuser.me/api/portraits"
  }

  return (
    <header className="pl-4 pr-6 py-3 h-14 flex justify-between z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <NavbarBreadcrumbs />
      <div className="flex items-center gap-2">
        {/* <UserDropdown /> */}
        <ColorModeSelect/>
        {/* <ThemeToggle/> */}
        <IconButton color="inherit" size="medium">
          <NotificationsIcon />
        </IconButton>
        {user  ? <UserDropdown name = {user?.name as string} email = {user?.email as string} role = {user?.role as string} avatar = {userData.avatar}
         /> : <div className='bg-gray-600 rounded-full h-10 w-10 cursor-pointer flex justify-center items-center'/> }
      </div>
    </header>
  )
}

