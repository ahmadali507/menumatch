"use client";
import { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, IconButton,
  Chip, TablePagination, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import SectionLayout from '@/components/layouts/section-layout';
import AddRestaurant from '@/components/add-restaurant';
import { RestaurantType } from '@/types';
// import { fetchAllRestaurants } from '@/actions/actions.admin';


// // Generate 20 restaurants
// const dummyRestaurants = Array.from({ length: 20 }, (_, i) => ({
//   id: i + 1,
//   name: `Restaurant ${i + 1}`,
//   location: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Houston'][Math.floor(Math.random() * 5)],
//   status: Math.random() > 0.2 ? 'active' : 'inactive',
//   cuisine: ['Italian', 'Japanese', 'Mexican', 'American', 'Indian'][Math.floor(Math.random() * 5)],
//   orders: Math.floor(Math.random() * 500) + 50
// }));

// Types
type SortField = 'name' | 'orders' | 'city' | 'cuisine';
type SortOrder = 'asc' | 'desc';



export default function RestaurantsTable({restaurants}:{restaurants:RestaurantType[]}) {




  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  


  // console.log(allRestaurants);

  // Filter restaurants
  const filteredRestaurants = restaurants
    .filter(restaurant => {
    //   const matchesSearch =
    //     restaurant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     restaurant?.cuisine?.toLowerCase().includes(searchQuery.toLowerCase());

    //   const matchesLocation = !locationFilter ||
    //     restaurant?.location?.city?.toLowerCase().includes(locationFilter.toLowerCase());

    //   return matchesSearch && matchesLocation;
    // })
    // .sort((a, b) => {
    //   const multiplier = sortOrder === 'asc' ? 1 : -1;
    //   if (sortField === 'orders') {
    //     return (a?.orders as number - b?.orders as number) * multiplier;
    //   }
    //   return a[sortField]?.localeCompare(b[sortField]) * multiplier;

    const matchesSearch =
    (restaurant?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (restaurant?.cuisine?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    const matchesLocation = !locationFilter ||
    (restaurant?.location?.city?.toLowerCase() || '').includes(locationFilter.toLowerCase());

// ...existing code...
        return matchesSearch && matchesLocation;})
    .sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
  
    if (sortField === 'orders') {
        return ((a?.orders || 0) - (b?.orders || 0)) * multiplier;
    }
  
    return ((a[sortField as keyof typeof a]?.toString() || '')
    .localeCompare(b[sortField as keyof typeof b]?.toString() || '')) * multiplier;
});


  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <SectionLayout title='Restaurant Management' description="Lists all restaurants to manage them" endButton={<AddRestaurant />}
    >


      <div className="flex w-full gap-4 items-center bg-opacity-50 backdrop-blur-sm mb-2">
        <TextField
          size="small"
          placeholder="Search restaurants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon className="mr-2 text-gray-400" />,
          }}
          className="min-w-[300px]"
        />

        <TextField
          size="small"
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="min-w-[200px]"
        />


        <FormControl>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortField(field as SortField);
              setSortOrder(order as SortOrder);
            }}
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

      </div>

      <div className="flex flex-col">
        <div className="h-[70vh] overflow-auto">
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
            <Table >
              <TableHead>
                <TableRow sx={{ fontWeight: "bold" }}>
                  <TableCell width={80}>S.No</TableCell>
                  <TableCell>Restaurant Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Cuisine</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Total Orders</TableCell>
                  <TableCell align="right" width={200}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ maxHeight: "100px", overflowY: "auto" }}>
                {filteredRestaurants
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((restaurant, index) => (
                    <TableRow
                      key={restaurant.id}
                      hover

                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell className="font-medium">
                        <Link href={`/restaurants/${restaurant.id}`} className='hover:underline'>
                          {restaurant.name}
                        </Link>
                      </TableCell>
                      <TableCell>{restaurant?.location?.city}</TableCell>
                      <TableCell>{restaurant.cuisine}</TableCell>
                      <TableCell>
                        <Chip
                          size="medium"
                          label={restaurant.status}
                          color={restaurant.status === 'active' ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell align="center">{restaurant.orders}</TableCell>
                      <TableCell align="right" sx={{ display: "flex", gap: "10px" }}>
                        <IconButton size="small" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table >
          </TableContainer >
        </div >
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRestaurants.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div >
    </SectionLayout >
  );
}