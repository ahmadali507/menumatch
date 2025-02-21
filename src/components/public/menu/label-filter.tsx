"use client";
import {
  Chip,
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

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
  const handleLabelSelect = (event: SelectChangeEvent<string>) => {
    const label = event.target.value;
    if (!selectedLabels.includes(label)) {
      onLabelChange([...selectedLabels, label]);
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    onLabelChange(selectedLabels.filter(label => label !== labelToRemove));
  };


  return (
    <Box className="flex flex-wrap items-center gap-4">
      <FormControl sx={{ minWidth: 200 }} size="small">
        <InputLabel>Filter by Labels</InputLabel>
        <Select
          value=""
          label="Filter by Labels"
          onChange={handleLabelSelect}
          displayEmpty
        >
          {allLabels.map((label) => (
            <MenuItem
              key={label}
              value={label}
              disabled={selectedLabels.includes(label)}
              sx={{
                textTransform: 'capitalize',
                color: selectedLabels.includes(label) ? 'text.disabled' : 'inherit'
              }}
            >
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedLabels.length > 0 && (
        <Box className="flex flex-wrap gap-2 items-center">
          {selectedLabels.map((label) => (
            <Chip
              key={label}
              label={label}
              onDelete={() => handleRemoveLabel(label)}
              sx={{
                color: 'white',
                textTransform: 'capitalize',
                '& .MuiChip-deleteIcon': {
                  color: 'white',
                  '&:hover': {
                    color: 'rgba(255,255,255,0.8)',
                  },
                },
              }}
            />
          ))}

          {selectedLabels.length > 1 && (
            <Chip
              label="Clear All"
              onClick={() => onLabelChange([])}
              onDelete={() => onLabelChange([])}
              deleteIcon={<ClearIcon />}
              variant="outlined"
              color="error"
              size="small"
              sx={{
                ml: 1,
                fontWeight: 500,
              }}
            />
          )}
        </Box>
      )}
    </Box>
  );
}