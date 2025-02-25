'use client'
import { useState } from 'react';
import { useUser } from "@/context/userContext";
import NavbarBreadcrumbs from "./breadcrumbs";
import UserDropdown from "./user-dropdown";
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Drawer } from "@mui/material";
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
      <header className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 h-12 sm:h-14 flex justify-between z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className='mx-1 sm:mx-2 lg:hidden'>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              size="small"
              sx={{
                display: { lg: 'none' },
                padding: { xs: '4px', sm: '8px' }
              }}
            >
              <MenuIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
            </IconButton>
          </div>
          <div className="hidden sm:block">
            <NavbarBreadcrumbs />
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <ColorModeSelect />
          {/* <ThemeToggle/> */}
          {user ? (
            <UserDropdown
              name={user?.name as string}
              email={user?.email as string}
              role={user?.role as string}
              avatar={userData.avatar}
              clearUser={clearUser}
            />
          ) : (
            <div className='bg-gray-600 rounded-full h-8 w-8 sm:h-10 sm:w-10 cursor-pointer flex justify-center items-center' />
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
        <SidebarNav role={user?.role || "super_admin"} />
      </Drawer>
    </>
  );
}

