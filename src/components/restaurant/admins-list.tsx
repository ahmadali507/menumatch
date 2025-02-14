import { Button, Card, Typography, Avatar } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from '@mui/icons-material/Groups'; // Add this import
import Link from "next/link";
import { resAdminType } from "@/types";

export default function AdminsList({ restaurantId, admins }: {
  restaurantId: string;
  admins: resAdminType[];
}) {
  return (
    <Card style={{ flexGrow: 1, height: "400px" }}>
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h6">
          <PersonIcon sx={{ marginRight: "10px" }} />
          Restaurant Admins
        </Typography>
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
        {admins?.length > 0 ? (
          admins.map((admin, index) => (
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
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <GroupsIcon
              sx={{
                fontSize: 64,
                color: 'action.disabled',
                mb: 2
              }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Admins Yet
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 300, mb: 2 }}
            >
              Add administrators to help manage your restaurant and menu items
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              component={Link}
              href={`/restaurants/${restaurantId}/admin/create`}
            >
              Add Your First Admin
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}