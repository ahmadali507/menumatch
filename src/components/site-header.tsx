'use client'
import { useState } from 'react';
import { useUser } from "@/context/userContext";
import NavbarBreadcrumbs from "./breadcrumbs";
import UserDropdown from "./user-dropdown";
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Drawer } from "@mui/material";
// import ThemeToggle from "@/components/theme/ThemeToggle";
import ColorModeSelect from "./theme/ColorModeSelect";
import { SidebarNav } from "./sidebar";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, setUser } = useUser();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const clearUser = () => {
    setUser(null);
  }

  const userData = {
    avatar: "https://randomuser.me/api/portraits"
  }

  return (
    <>
      <header className="pl-4 pr-6 py-3 h-14 flex justify-between z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
          <div className='mx-2 lg:hidden'>

            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { lg: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <NavbarBreadcrumbs />

        </div>
        <div className="flex items-center gap-2">
          <ColorModeSelect />
          {/* <ThemeToggle/> */}
          <IconButton color="inherit" size="medium">
            <NotificationsIcon />
          </IconButton>
          {user ? (
            <UserDropdown
              name={user?.name as string}
              email={user?.email as string}
              role={user?.role as string}
              avatar={userData.avatar}
              clearUser={clearUser}
            />
          ) : (
            <div className='bg-gray-600 rounded-full h-10 w-10 cursor-pointer flex justify-center items-center' />
          )}
        </div>
      </header>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            backgroundColor: 'rgb(9 9 11 / 0.9)',
            borderRight: '1px solid rgb(107 114 128 / 0.5)'
          },
        }}
      >
        <SidebarNav role={user?.role || "superAdmin"} />
      </Drawer>
    </>
  );
}

