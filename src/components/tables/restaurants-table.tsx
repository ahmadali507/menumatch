"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Chip,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import SectionLayout from "@/components/layouts/section-layout";
import AddRestaurant from "@/components/add-restaurant";
import { RestaurantType } from "@/types";
import EditRestaurant from "../forms/edit-restaurant-form";
import DeleteRestaurant from "../delete-restaurant";

// Types
type SortField = "name" | "orders" | "city" | "cuisine";
type SortOrder = "asc" | "desc";

export default function RestaurantsTable({
  restaurants,
}: {
  restaurants: RestaurantType[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [cityFilter, setCityFilter] = useState(""); // Add new state for city filter
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // console.log(allRestaurants);

  // Filter restaurants
  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const matchesSearch = (restaurant?.name?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      );

      const matchesLocation =
        !locationFilter ||
        (restaurant?.location?.country?.toLowerCase() || "").includes(
          locationFilter.toLowerCase()
        );

      const matchesCity =
        !cityFilter ||
        (restaurant?.location?.city?.toLowerCase() || "").includes(
          cityFilter.toLowerCase()
        );

      return matchesSearch && matchesLocation && matchesCity;
    })
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;

      if (sortField === "orders") {
        return ((a?.orders || 0) - (b?.orders || 0)) * multiplier;
      }

      return (
        (a[sortField as keyof typeof a]?.toString() || "").localeCompare(
          b[sortField as keyof typeof b]?.toString() || ""
        ) * multiplier
      );
    });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <SectionLayout
      title="Restaurant Management"
      description="Lists all restaurants to manage them"
      endButton={<AddRestaurant />}
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
          placeholder="Filter by country..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="min-w-[200px]"
        />

        <TextField
          size="small"
          placeholder="Filter by city..."
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="min-w-[200px]"
        />

        <FormControl>
          <InputLabel sx={{ transform: "translate(24px, -16px) scale(0.75)" }}>
            Sort by
          </InputLabel>
          <Select
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
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

          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: "transparent",
              minWidth: 1200,
              overflowX: "auto"
            }}
          >
            <Table stickyHeader>{/* Remove space between opening and closing tags */}
              <TableHead>
                <TableRow sx={{ fontWeight: "bold" }}>
                  <TableCell width={60}>S.No</TableCell>
                  <TableCell width={200}>Restaurant Name</TableCell>
                  <TableCell width={120}>Country</TableCell>
                  <TableCell width={120}>City</TableCell>
                  <TableCell width={250}>Address</TableCell>
                  <TableCell width={120}>Cuisine</TableCell>
                  <TableCell width={100}>Status</TableCell>
                  <TableCell width={120}>Total Orders</TableCell>
                  <TableCell align="center" width={100}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRestaurants
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((restaurant, index) => (
                    <TableRow
                      key={restaurant.id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{(page * rowsPerPage + index + 1) || "-"}</TableCell>
                      <TableCell className="font-medium">
                        <Link href={`/restaurants/${restaurant.id}`} className="hover:underline">
                          {restaurant.name || "-"}
                        </Link>
                      </TableCell>
                      <TableCell>{restaurant?.location?.country || "-"}</TableCell>{/* Remove trailing space */}
                      <TableCell>{restaurant?.location?.city || "-"}</TableCell>
                      <TableCell>
                        <div className="max-w-[250px] truncate" title={restaurant?.location?.address || "-"}>
                          {restaurant?.location?.address || "-"}
                        </div>
                      </TableCell>
                      <TableCell>{restaurant.cuisine || "-"}</TableCell>
                      <TableCell>
                        <Chip
                          size="medium"
                          label={restaurant.status}
                          color={restaurant.status === "active" ? "success" : "error"}
                        />
                      </TableCell>
                      <TableCell align="center">{restaurant.orders || "-"}</TableCell>
                      <TableCell align="right" sx={{ display: "flex", gap: "10px" }}>
                        <EditRestaurant
                          initialData={{
                            ...restaurant,
                            images: {
                              logo: restaurant.images?.logo || null,
                              background: restaurant.images?.background || null
                            }
                          }}
                          restaurantId={restaurant.id as string}
                          iconTrigger
                        />
                        <DeleteRestaurant
                          restaurantId={restaurant.id}
                          restaurantName={restaurant.name}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRestaurants.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </SectionLayout>
  );
}
