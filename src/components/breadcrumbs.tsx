"use client";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    margin: 1,
    color: "gray"
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
    color: "white"
  },
}));

export default function NavbarBreadcrumbs() {
  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1" color='gray'>Dashboard</Typography>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        Home
      </Typography>
    </StyledBreadcrumbs>
  );
}
