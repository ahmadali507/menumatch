import { Chip, Box, Tooltip, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface LabelFilterProps {
  allLabels: string[];
  selectedLabels: string[];
  onLabelChange: (labels: string[]) => void;
}

export default function LabelFilter({
  allLabels,
  selectedLabels,
  onLabelChange,
}: LabelFilterProps) {
  const handleLabelClick = (label: string) => {
    if (selectedLabels.includes(label)) {
      onLabelChange(selectedLabels.filter((l) => l !== label));
    } else {
      onLabelChange([...selectedLabels, label]);
    }
  };

  const getLabelColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'spicy':
        return '#ef4444';
      case 'vegetarian':
        return '#22c55e';
      case 'vegan':
        return '#16a34a';
      case 'halal':
        return '#06b6d4';
      case 'gluten-free':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  return (
    <Box className="flex items-center gap-4">
      <Typography variant="h6" className="whitespace-nowrap">
        Filter by Labels
      </Typography>

      <Box
        className="flex gap-2 overflow-x-auto"
        sx={{
          '::-webkit-scrollbar': {
            height: '6px',
          },
          '::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '10px',
          },
          '::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '10px',
            '&:hover': {
              background: '#666',
            },
          },
        }}
      >
        <AnimatePresence>
          {allLabels.map((label) => (
            <motion.div
              key={label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Tooltip title={`Filter by ${label}`}>
                <Chip
                  label={label}
                  onClick={() => handleLabelClick(label)}
                  sx={{
                    backgroundColor: selectedLabels.includes(label)
                      ? getLabelColor(label)
                      : 'transparent',
                    color: selectedLabels.includes(label) ? 'white' : 'inherit',
                    border: `1px solid ${getLabelColor(label)}`,
                    '&:hover': {
                      backgroundColor: selectedLabels.includes(label)
                        ? getLabelColor(label)
                        : `${getLabelColor(label)}20`,
                    },
                    transition: 'all 0.2s ease-in-out',
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    height: '36px',
                    fontSize: '0.95rem',
                    px: 1.5,
                  }}
                  clickable
                />
              </Tooltip>
            </motion.div>
          ))}

          {selectedLabels.length > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Chip
                label="Clear All"
                onClick={() => onLabelChange([])}
                variant="outlined"
                color="error"
                sx={{
                  height: '36px',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}