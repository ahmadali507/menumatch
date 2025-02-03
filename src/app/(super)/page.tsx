import { Typography, Card, Button, AvatarGroup, Avatar } from "@mui/material";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import Link from "next/link";

const StatCard = ({ icon, title, value, trend }: { icon: React.ReactNode, title: string, value: string, trend?: string }) => (
  <Card className="p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-center">
      <div className="p-2 rounded-lg bg-gray-900">{icon}</div>
      {trend && <span className={`font-bold ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</span>}
    </div>
    <div>
      <Typography color="text.secondary" gutterBottom>{title}</Typography>
      <Typography variant="h4">{value}</Typography>
    </div>
  </Card>
);

export default function MainPage() {
  return (
    <section className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Typography component="h2" variant="h4">
          Overview
        </Typography>
        <div className="flex gap-2">

          <Button variant="contained" startIcon={<AddIcon />}>
            Add Restaurant
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<RestaurantIcon className="text-blue-500" />}
          title="Total Restaurants"
          value="124"
          trend="+12.5%"
        />
        <StatCard
          icon={<MenuBookIcon className="text-purple-500" />}
          title="Active Menus"
          value="25"
          trend="+8.1%"
        />
        <StatCard
          icon={<GroupIcon className="text-green-500" />}
          title="Total Admins"
          value="22"
          trend="+22.4%"
        />
        {/* <StatCard
          icon={<TimelineIcon className="text-orange-500" />}
          title="Total Revenue"
          value="$45.2k"
          trend="+16.2%"
        /> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="col-span-2 p-6">
          <Typography variant="h6" className="mb-4">Recent Activity</Typography>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-900 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <RestaurantIcon />
                </div>
                <div>
                  <Link href="#" className="hover:underline">
                    <Typography variant="subtitle2">New Restaurant Added</Typography>
                  </Link>
                  <Typography variant="body2" color="text.secondary">Italian Cuisine • 2 hours ago</Typography>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <Typography variant="h6" className="mb-4">Restaurant Admins</Typography>
            <div className="flex items-center justify-between mb-4">
              <AvatarGroup max={3}>
                <Avatar style={{ fontSize: "20px" }}>MA</Avatar>
                <Avatar style={{ fontSize: "20px" }}>JD</Avatar>
                <Avatar style={{ fontSize: "20px" }}>RK</Avatar>
                <Avatar style={{ fontSize: "20px" }}>SK</Avatar>
              </AvatarGroup>
            </div>
            <div className="space-y-2">
              {['Mike Anderson', 'John Doe', 'Rachel Kim'].map(name => (
                <div key={name} className="flex items-center gap-3 p-2 hover:bg-gray-900 rounded-lg">
                  <Avatar sx={{ width: 40, height: 40, fontSize: "20px" }}>{name.split(' ').map(n => n[0]).join('')}</Avatar>
                  <div className="flex-1">
                    <Typography variant="body2">{name}</Typography>
                  </div>
                </div>
              ))}
            </div>
          </Card>


        </div>
      </div>
    </section>
  );
}