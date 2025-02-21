import { MenuItem } from '@/types';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InfoIcon from '@mui/icons-material/Warning';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import Image from 'next/image';
import parse from 'react-html-parser'

interface MenuItemCardProps {
  item: MenuItem;
}

export default function PublicMenuItemCard({ item }: MenuItemCardProps) {
  const descriptionStyles = {
    '& p': {
      lineHeight: 1.5,
    },
    '& strong': {
      fontWeight: 600,
      color: 'text.primary',
    },
    '& em': {
      fontStyle: 'italic',
    },
    '& u': {
      textDecoration: 'underline',
    },
    '& ul, & ol': {
      marginLeft: '1.5rem',
    },
    '& li': {
    },
    '& a': {
      color: 'primary.main',
      textDecoration: 'underline',
      '&:hover': {
        color: 'primary.dark',
      },
    },
    '& h1, & h2, & h3, & h4': {
      margin: '1rem 0 0.5rem 0',
      fontWeight: 600,
      color: 'text.primary',
    },
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 0,
          paddingBottom: '56.25%', // 16:9 aspect ratio
          backgroundColor: 'grey.100',
          overflow: 'hidden'
        }}
      >
        <Image
          src={item.photo || "/placeholder.svg"}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            objectFit: item.photo ? 'cover' : 'contain',
          }}
          priority={false}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {item.name}
          </Typography>
          <Typography variant="h6" color="primary" fontWeight="bold">
            ${item.price}
          </Typography>
        </Box>

        {item.description && (
          <Box
            className="description"
            sx={{
              ...descriptionStyles,
              mb: 2,
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            {parse(item.description)}
          </Box>
        )}

        {(item.labels && item.labels.length > 0) && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {item.labels.map((label) => (
              <Chip
                key={label}
                label={label}
                size="small"
                icon={<LocalOfferIcon />}
                sx={{
                  fontSize: '0.75rem',
                }}
              />
            ))}
          </Box>
        )}

        {(item.ingredients && item.ingredients.length > 0) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, color: "text.primary" }}>
            <LocalDiningIcon color="primary" fontSize="small" />
            <Typography variant="caption" color="text.secondary">
              <span className='font-bold'>Ingredients  :</span> {item.ingredients.join(', ')}
            </Typography>
          </Box>
        )}

        {(item.allergens && item.allergens.length > 0) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon color="warning" fontSize="small" />
            <Typography variant="caption" color="text.secondary">
              <span className='font-bold'>Contains:</span> {item.allergens.join(', ')}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}