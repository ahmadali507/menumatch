"use client";
import {
  Button, Card, Typography, Chip, Avatar,
  Divider
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Link from "next/link";
import { RestaurantDetailsType } from "@/types";
import PersonIcon from "@mui/icons-material/Person"
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { blue, green, purple, amber } from '@mui/material/colors';

export default function RestaurantDetails({ restaurantId, details }: { restaurantId: string; details: RestaurantDetailsType }) {
  return (

    <div className="flex gap-6 w-full">
      {/* Main Info Card */}
      <Card style={{ flexGrow: 2 }}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gray-900">
              <RestaurantIcon className="text-blue-500" sx={{ fontSize: 40 }} />
            </div>
            <div>
              <Typography variant="h4">{details.name}</Typography>
              <div className="flex items-center gap-2 mt-1">
                <LocationOnIcon className="text-gray-400" sx={{ fontSize: 18 }} />
                <Typography color="text.secondary">{details.location}</Typography>
              </div>
            </div>
          </div>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            component={Link}
            href={`/restaurants/${restaurantId}/edit`}
          >
            Edit Details
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-gray-900/50">
            <Typography color="text.secondary">Status</Typography>
            <div className="mt-2">
              <Chip
                label={details.status}
                color={details.status === 'active' ? 'success' : 'default'}
              />
            </div>
          </Card>
          <Card className="p-4 bg-gray-900/50">
            <Typography color="text.secondary">Cuisine</Typography>
            <Typography variant="h6" className="mt-2">{details.cuisine}</Typography>
          </Card>
          <Card className="p-4 bg-gray-900/50">
            <Typography color="text.secondary">Total Orders</Typography>
            <Typography variant="h6" className="mt-2">{details.orders}</Typography>
          </Card>
        </div>

        <Divider className="my-6" />

        <div className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6">Menu Management</Typography>
            <Button
              variant="contained"
              startIcon={<MenuBookIcon />}
              component={Link}
              href={`/restaurants/${restaurantId}/menu`}
            >
              Manage Menus
            </Button>
          </div>
          <Typography color="text.secondary">
            Create and manage restaurant menus, categories, and items
          </Typography>
        </div>


        <div className="mt-6 pt-4">
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>Current Menus</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {details.menus.map((menu) => (
              <Card
                key={menu.id}
                className="p-4 hover:shadow-xl transition-all duration-200"
                sx={{
                  // background: 'linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(40,40,40,0.8) 100%)',
                  borderLeft: '4px solid',
                  borderLeftColor: new Date() >= new Date(menu.startDate) && new Date() <= new Date(menu.endDate)
                    ? green[400]
                    : amber[700],
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <Typography variant="h6" sx={{ color: '#fff' }}>{menu.name}</Typography>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-gray-300">
                        <RestaurantMenuIcon sx={{ fontSize: 18, color: purple[300] }} />
                        <Typography variant="caption" sx={{ color: 'inherit' }}>
                          {menu.sections.length} Sections
                        </Typography>
                      </div>
                      <div className="flex items-center gap-1 text-gray-300">
                        <RestaurantIcon sx={{ fontSize: 18, color: blue[300] }} />
                        <Typography variant="caption" sx={{ color: 'inherit' }}>
                          {menu.sections.reduce((acc, section) => acc + section.items.length, 0)} Items
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <Chip
                    size="small"
                    label={new Date() >= new Date(menu.startDate) && new Date() <= new Date(menu.endDate) ? 'Active' : 'Inactive'}
                    color={new Date() >= new Date(menu.startDate) && new Date() <= new Date(menu.endDate) ? 'success' : 'error'}
                    sx={{
                      fontWeight: 'bold',
                      '& .MuiChip-label': {
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                      }
                    }}
                  />
                </div>

                {/* <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 p-2 rounded">
                    <CalendarTodayIcon sx={{ fontSize: 16, color: amber[300] }} />
                    <Typography variant="caption" sx={{ color: 'inherit' }}>
                      {new Date(menu.startDate).toLocaleDateString()} - {new Date(menu.endDate).toLocaleDateString()}
                   </Typography>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 p-2 rounded">
                    <AccessTimeIcon sx={{ fontSize: 16, color: amber[300] }} />
                    <Typography variant="caption" sx={{ color: 'inherit' }}>
                      {new Date(menu.startDate).toLocaleTimeString()} - {new Date(menu.endDate).toLocaleTimeString()}
                    </Typography>
                  </div>
                </div> */}

                <div className="flex justify-end gap-2">
                  <Button
                    size="small"
                    variant="outlined"
                    component={Link}
                    href={`/restaurants/${restaurantId}/menu/${menu.id}`}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.5)',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<EditIcon />}
                    component={Link}
                    href={`/restaurants/${restaurantId}/menu/${menu.id}/edit`}
                    sx={{
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      // boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                      border: "none",
                      ":hover": {
                        backgroundColor: "lightblue",
                        transition: "none"
                      }
                    }}
                  >
                    Edit Menu
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Admins Card */}
      <Card style={{ flexGrow: 1, height: "400px" }}>
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h6">
            <PersonIcon sx={{ marginRight: "10px" }} />
            Restaurant Admins</Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            component={Link}
            href={`/restaurants/${restaurantId}/admin/create`}
          >
            Add Admin
          </Button>
        </div>

        <div className="h-[300px] overflow-y-auto space-y-4">
          {details.admins.map((admin, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 hover:bg-gray-900/50 rounded-lg transition-colors"
            >
              <Avatar>{admin.name.charAt(0)}</Avatar>
              <div>
                <Typography variant="subtitle2">{admin.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {admin.role}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}