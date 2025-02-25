import { Drawer, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import AddRestaurant from "./add-restaurant";
import SearchIcon from "@mui/icons-material/Search";

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  sortField: string;
  sortOrder: string;
  onSortChange: (value: string) => void;
}

export default function FilterSheet({
  open,
  onClose,
  searchQuery,
  setSearchQuery,
  locationFilter,
  setLocationFilter,
  cityFilter,
  setCityFilter,
  sortField,
  sortOrder,
  onSortChange
}: FilterSheetProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          width: 250,
          p: 2,
          backgroundColor: 'rgb(9 9 11 / 0.9)',
          borderLeft: '1px solid rgb(107 114 128 / 0.5)'
        },
      }}
    >
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>


        <TextField
          fullWidth
          size="small"
          placeholder="Search restaurants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon className="mr-2 text-gray-400" />,
          }}
        />

        <TextField
          fullWidth
          size="small"
          placeholder="Filter by country..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />

        <TextField
          fullWidth
          size="small"
          placeholder="Filter by city..."
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        />

        <FormControl fullWidth size="small">
          <InputLabel>Sort by</InputLabel>
          <Select
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => onSortChange(e.target.value)}
            label="Sort by"
          >
            <MenuItem value="name-asc">Name (A-Z)</MenuItem>
            <MenuItem value="name-desc">Name (Z-A)</MenuItem>
            <MenuItem value="orders-desc">Orders (High-Low)</MenuItem>
            <MenuItem value="orders-asc">Orders (Low-High)</MenuItem>
            <MenuItem value="location-asc">Location (A-Z)</MenuItem>
            <MenuItem value="location-desc">Location (Z-A)</MenuItem>
            <MenuItem value="cuisine-asc">Cuisine (A-Z)</MenuItem>
            <MenuItem value="cuisine-desc">Cuisine (Z-A)</MenuItem>
          </Select>
        </FormControl>

        <AddRestaurant />

      </div>


    </Drawer>
  );
}
