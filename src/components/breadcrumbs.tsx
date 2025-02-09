"use client";
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { usePathname } from 'next/navigation';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';

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

const formatSegment = (segment: string) => {
  return segment
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function NavbarBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const theme = useTheme();

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Link href="/" style={{ textDecoration: 'none' }}>
        <Typography variant="body1" color="gray">
          Dashboard
        </Typography>
      </Link>

      {pathname === "/" ? (
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.main
          }}
        >
          Home
        </Typography>
      ) : (
        segments.map((segment, index) => {
          const path = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;

          return isLast ? (
            <Typography
              key={path}
              variant="body1"
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main
              }}
            >
              {formatSegment(segment)}
            </Typography>
          ) : (
            <Link key={path} href={path} style={{ textDecoration: 'none' }}>
              <Typography variant="body1" color="gray">
                {formatSegment(segment)}
              </Typography>
            </Link>
          );
        })
      )}
    </StyledBreadcrumbs>
  );
}