import { Box, Container, Typography, Avatar } from '@mui/material';
import { RestaurantType } from '@/types';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

export default function PublicRestaurantHeader({
  restaurant,
}: {
  restaurant: RestaurantType,
}) {

  return (
    <Box className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ py: { xs: 4, md: 6 } }}>
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Logo */}
            <Avatar
              src={restaurant.images?.logo}
              alt={restaurant.name}
              sx={{
                width: 140,
                height: 140,
                margin: '0 auto',
                border: '4px solid white',
                backgroundColor: 'white',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
              }}
            />

            {/* Main Content */}
            <div className="flex-grow md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <StorefrontIcon sx={{ fontSize: 40, color: 'primary.light' }} />
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{
                    letterSpacing: '-0.5px'
                  }}
                >
                  {restaurant.name}
                </Typography>
              </div>

              <div className="flex items-center md:justify-start gap-2 mt-4 mb-2">
                <LocationOnIcon sx={{ color: 'grey.400' }} />
                <Typography
                  variant="subtitle1"
                  lineHeight={1.25}
                >
                  {restaurant.location.address}, {restaurant.location.city}
                </Typography>
              </div>


            </div>

            {/* Contact Info */}
            <div className="md:text-right">
              <div className="flex items-center md:justify-end gap-2 mb-2">
                <PhoneIcon sx={{ color: 'primary.light', fontSize: 20 }} />
                <Typography
                  variant="body1"
                  component="a"
                  href={`tel:${restaurant.contact.phone}`}
                >
                  {restaurant.contact.phone}
                </Typography>
              </div>
              <div className="flex items-center md:justify-end gap-2">
                <EmailIcon sx={{ color: 'primary.light', fontSize: 20 }} />
                <Typography
                  variant="body1"
                  component="a"
                  href={`mailto:${restaurant.contact.email}`}
                >
                  {restaurant.contact.email}
                </Typography>
              </div>
            </div>
          </div>
        </Box>
      </Container>
    </Box>
  );
}