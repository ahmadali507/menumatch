"use client";
import { useState } from 'react';
import {
  Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField, IconButton,
  Chip, TablePagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

// Generate 20 restaurants
const dummyRestaurants = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Restaurant ${i + 1}`,
  location: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Houston'][Math.floor(Math.random() * 5)],
  status: Math.random() > 0.2 ? 'active' : 'inactive',
  cuisine: ['Italian', 'Japanese', 'Mexican', 'American', 'Indian'][Math.floor(Math.random() * 5)],
  orders: Math.floor(Math.random() * 500) + 50
}));

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredRestaurants = dummyRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Typography variant="h4" component="h1">
            Restaurants
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage all registered restaurants
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Add new restaurant')}
        >
          Add Restaurant
        </Button>
      </div>


      <div className="flex gap-4 items-center bg-opacity-50 backdrop-blur-sm mb-2">
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
      </div>

      <div className="flex flex-col">
        <div className="h-[600px] overflow-auto">
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
              <TableBody sx={{ height: "500px", overflowY: "auto" }}>
                {filteredRestaurants
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((restaurant, index) => (
                    <TableRow
                      key={restaurant.id}
                      hover

                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell className="font-medium">{restaurant.name}</TableCell>
                      <TableCell>{restaurant.location}</TableCell>
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
    </section >
  );
}