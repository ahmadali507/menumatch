import { Card, Typography, Divider, Grid, Box } from "@mui/material";
import Image from "next/image";
import { RestaurantType } from "@/types";
import RestaurantHeader from "../restaurant-header";
import RestaurantStats from "../restaurant-stats";
import AdminsList from "../admins-list";
import MenuCard from "../menus/menu-card";
import ManageMenusButtonLink from "./manage-menus-button-link";

export default async function RestaurantContent({
  restaurantId,
  details,
}: {
  restaurantId: string;
  details: RestaurantType;
}) {
  return (
    <div className="flex gap-6 w-full">
      <Card style={{ flexGrow: 2 }}>
        {/* Background Image Container */}
        {(details.images?.background || details.images?.logo) && <Box sx={{
          position: 'relative',
          height: '240px',
          width: '100%',
          mb: 3,
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {details?.images?.background && <Image
            src={details?.images?.background as string}
            alt={`${details.name} background`}
            fill
            style={{
              objectFit: 'cover',
            }}
            priority
            unoptimized
          />}
          {/* Gradient Overlay */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
            zIndex: 1
          }} />

          {/* Logo Container */}
          {details?.images?.logo && <Box sx={{
            position: 'absolute',
            bottom: '-40px',
            left: '32px',
            zIndex: 2,
            width: '120px',
            height: '120px',
            borderRadius: '16px',
            bgcolor: 'background.paper',
            boxShadow: 3,
            overflow: 'hidden'
          }}>
            <Image
              src={details?.images?.logo as string}
              alt={`${details.name} logo`}
              fill
              style={{
                objectFit: 'cover',
                padding: '8px'
              }}
              unoptimized
            />
          </Box>}
        </Box>}

        {/* Add spacing for logo overflow */}
        <Box sx={{ mt: 5, px: 3, pb: 3 }}>
          <RestaurantHeader restaurantId={restaurantId} details={details} />
          <RestaurantStats details={details} />

          <Divider className="my-6" />

          <div className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6">Menu Management</Typography>
              <ManageMenusButtonLink />
            </div>
            <Typography color="text.secondary">
              Create and manage restaurant menus, categories, and items
            </Typography>
          </div>

          <div className="mt-6 pt-4">
            <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
              Current Menus
            </Typography>
            {details?.menus.length === 0 ?
              <Typography variant="body1">There are currently no menus</Typography>
              : <Grid container spacing={3}>
                {details.menus?.map((menu) => (
                  <Grid item xs={12} sm={6} key={menu.id}>
                    <MenuCard menu={menu} />
                  </Grid>
                ))}
              </Grid>}
          </div>
        </Box>
      </Card>

      <AdminsList restaurantId={restaurantId} admins={details.admins} />
    </div>
  );
}
