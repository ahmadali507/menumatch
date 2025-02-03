import NavbarBreadcrumbs from "./breadcrumbs";
import UserDropdown from "./user-dropdown";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { IconButton } from "@mui/material";

export function SiteHeader() {

  const userData = {
    name: "John Doe",
    email: "john@gmail.com",
    role: "Super Admin",
    avatar: "https://randomuser.me/api/portraits"
  }

  return (
    <header className="pl-4 pr-6 py-3 sticky top-0 h-14 flex justify-between z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <NavbarBreadcrumbs />
      <div className="flex items-center gap-2">
        {/* <UserDropdown /> */}
        <IconButton color="inherit" size="medium">
          <NotificationsIcon />
        </IconButton>
        <UserDropdown {...userData} />
      </div>
    </header>
  )
}

