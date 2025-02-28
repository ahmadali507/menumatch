"use client";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Divider, { dividerClasses } from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { logoutUser } from '@/actions/actions.auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/toastContext';


const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  margin: '2px 0',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Material UI's default dark theme hover color
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
  },
}));

type UserDropdownProps = {
  avatar?: string;
  name: string;
  email: string;
  role: string;
  clearUser: () => void;
}

export default function UserDropdown({ name, email, role, clearUser }: UserDropdownProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const { showToast } = useToast()
  const open = Boolean(anchorEl);


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleUserLogout = async () => {
    console.log("logout user");
    // logoutUser();
    const response = await logoutUser();
    if (!response.success) {
      showToast(response.message || "Failed to logout", "error");
      return;
    }

    showToast("Logged out successfully", "success");
    setTimeout(() => {
      clearUser();
      router.push('/auth/login');
    }, 1000)
  }

  const displayRole = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'super_admin':
        return 'Super Admin';
      default:
        return 'User';
    }
  }

  return (
    <React.Fragment>
      <div className='bg-blue-600 rounded-full h-10 w-10 cursor-pointer flex justify-center items-center' onClick={handleClick} >
        <span>
          {name[0].toUpperCase()}
        </span>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px',
            width: '300px',
            backgroundColor: "black",
            color: "white",
            border: "1px solid #333",
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px',
          },
        }}
      >
        <div className='flex flex-col px-2 pb-2'>
          <span className='font-semibold'>{name}</span>
          <span className='text-gray-400 text-sm'>{email}</span>
          <div className='mt-1'>
            <span className='text-xs px-2 py-0.5 rounded-full border border-gray-700 bg-blue-900 text-blue-400'>
              {displayRole(role)}
            </span>
          </div>
        </div>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <Divider />
        <MenuItem
          onClick={handleUserLogout}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: 'auto',
              minWidth: 0,
            },
          }}
        >
          <ListItemText>Logout</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon sx={{ color: "white" }} fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
