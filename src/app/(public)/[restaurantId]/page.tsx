import { notFound } from "next/navigation";
import { getRestaurantData } from "@/actions/actions.admin";
import { getAllMenus } from "@/actions/actions.menu";
import { Box, Container, Typography, Grid } from "@mui/material";
import PublicRestaurantHeader from "@/components/public/menu/public-restaurant-header";
import LanguageSelector from "@/components/public/language-selector";
import PublicMenuCard from "@/components/public/menu/public-menu-card";
import ThemeSwitcher from "@/components/public/menu/theme-switcher";

export default async function RestaurantPublicPage({
  params,
  searchParams,
}: {
  params: Promise<{ restaurantId: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { restaurantId } = await params;
  const [restaurantData, menusData] = await Promise.all([
    getRestaurantData(restaurantId),
    getAllMenus(restaurantId),
  ]);

  if (!restaurantData || !menusData.success) {
    notFound();
  }

  const selectedLanguage = (await searchParams).lang || "en";
  const availableMenus = menusData.menus.filter(
    menu => menu.status === "active" && menu.language === selectedLanguage
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ThemeSwitcher />
      <PublicRestaurantHeader restaurant={restaurantData} />

      <Box sx={{ my: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
          Menus
        </Typography>
        <LanguageSelector restaurantId={restaurantId} currentLanguage={selectedLanguage} />
      </Box>

      {availableMenus.length > 0 ? (
        <Grid container spacing={3}>
          {availableMenus.map((menu) => (
            <Grid item xs={12} sm={6} md={4} key={menu.id}>
              <PublicMenuCard
                menu={menu}
                menuId={menu.id}
                restaurantId={restaurantId}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary'
          }}
        >
          <Typography variant="h6">
            No menus available in {selectedLanguage.toUpperCase()}
          </Typography>
        </Box>
      )}
    </Container>
  );
}