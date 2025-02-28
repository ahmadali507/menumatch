import { Card, Typography, Divider, Grid, Box, Button } from "@mui/material";
import Image from "next/image";
import { RestaurantType } from "@/types";
import RestaurantHeader from "../restaurant-header";
import RestaurantStats from "../restaurant-stats";
import AdminsList from "../admins-list";
import MenuCard from "../menus/menu-card";
import ManageMenusButtonLink from "./manage-menus-button-link";
import AddIcon from '@mui/icons-material/Add';
import Link from "next/link";

export default async function RestaurantContent({
  restaurantId,
  details,
  isSuper = false // Add this prop to check for super admin
}: {
  restaurantId: string;
  details: RestaurantType;
  isSuper?: boolean;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
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
            bottom: '-10px',
            left: '32px',
            zIndex: 2,
            width: '120px',
            height: '120px',
            borderRadius: '1rem',
            bgcolor: 'background.paper',
            boxShadow: 3,
            overflow: 'hidden',
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
        <Box sx={{ mt: 5, px: { xs: 2, sm: 3 }, pb: 3 }}>
          <RestaurantHeader restaurantId={restaurantId} details={details} />
          <RestaurantStats details={details} />

          <Divider className="my-6" />

          <div className="pt-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <Typography variant="h6">Menu Management</Typography>
              <div className="flex items-center gap-2">
                {isSuper && (
                  <Link href={`/restaurants/${restaurantId}/menu/add`}>
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      startIcon={<AddIcon />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                      }}
                    >
                      Add Menu
                    </Button>
                  </Link>
                )}
                <ManageMenusButtonLink />
              </div>
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
                {details?.menus?.map((menu) => (
                  <Grid item xs={12} md={6} key={menu.id}>
                    <MenuCard menu={menu} />
                  </Grid>
                ))}
              </Grid>}
          </div>
        </Box>
      </Card>

      <div className="w-full lg:w-auto">
        <AdminsList restaurantId={restaurantId} admins={details.admins} />
      </div>
    </div>
  );
}
