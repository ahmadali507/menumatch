'use client';
import { useState } from 'react';
import { Box, Container, Fade, useTheme, Typography } from '@mui/material';
import { Menu, RestaurantType } from '@/types';
import PublicMenuHeader from "./public-menu-header"
import PublicMenuSection from "./public-menu-section";
import LabelFilter from "./label-filter";
import ThemeSwitcher from "./theme-switcher";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

export default function PublicMenuView({ menu, restaurant }: {
  menu: Menu,
  restaurant: RestaurantType
}) {
  const theme = useTheme();
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  // Get all unique labels
  const allLabels = Array.from(new Set(
    menu.sections.flatMap(section =>
      section.items.flatMap(item => item.labels || [])
    )
  ));

  return (
    <Fade in timeout={800}>

      <Box className="min-h-screen">
        <PublicMenuHeader restaurant={restaurant} menu={menu} />
        {menu.promoContent &&
          <Container maxWidth="lg" sx={{ pb: 4 }}>
            <Box
              className="quill-preview"
              dangerouslySetInnerHTML={{
                __html: menu.promoContent
              }}
              sx={{
                color: theme.palette.mode === 'dark' ? 'white' : 'black',
                width: '100%'
              }}
            />
          </Container>
        }
        <ThemeSwitcher />

        <Container maxWidth="lg" className="pb-8">
          {/* Labels Filter */}
          <div className='mb-6'>
            <LabelFilter
              allLabels={allLabels}
              selectedLabels={selectedLabels}
              onLabelChange={setSelectedLabels}
            />
          </div>

          {/* Menu Sections */}
          {menu.sections.length > 0 ? (
            <div className="space-y-8">
              {menu.sections.map((section) => (
                <PublicMenuSection
                  key={section.id}
                  section={section}
                  selectedLabels={selectedLabels}
                />
              ))}
            </div>
          ) : (
            <EmptySection />
          )}
        </Container>
      </Box>
    </Fade>

  );

}

function EmptySection() {
  return <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 0.5,
      py: 8
    }}
  >
    <RestaurantMenuIcon
      sx={{
        fontSize: '4rem',
        color: 'text.secondary',
        opacity: 0.5
      }}
    />
    <Typography
      variant="h6"
      color="text.secondary"
      align="center"
    >
      No sections available in this menu yet
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
    >
      Check back later for updates
    </Typography>
  </Box>
}