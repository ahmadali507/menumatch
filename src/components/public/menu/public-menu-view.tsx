'use client';
import { useState } from 'react';
import { Box, Container, Paper, Fade } from '@mui/material';
import { Menu, RestaurantType } from '@/types';
import PublicMenuHeader from "./public-menu-header"
import PublicMenuSection from "./public-menu-section";
import LabelFilter from "./label-filter";
import ThemeSwitcher from "./theme-switcher";

export default function PublicMenuView({ menu, restaurant }: {
  menu: Menu,
  restaurant: RestaurantType
}) {
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
        <ThemeSwitcher />

        <Container maxWidth="lg" className="pb-8">
          {/* Labels Filter */}
          <Paper
            elevation={0}
            sx={{
              my: 3,
              py: 2.5,
              px: 3,
              backgroundColor: 'rgba(0,0,0,0.02)',
              borderRadius: 2
            }}
          >
            <LabelFilter
              allLabels={allLabels}
              selectedLabels={selectedLabels}
              onLabelChange={setSelectedLabels}
            />
          </Paper>

          {/* Menu Sections */}
          <div className="space-y-8">
            {menu.sections.map((section) => (
              <PublicMenuSection
                key={section.id}
                section={section}
                selectedLabels={selectedLabels}
              />
            ))}
          </div>
        </Container>
      </Box>
    </Fade>
  );
}