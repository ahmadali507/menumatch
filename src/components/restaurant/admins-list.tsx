import { Button, Card, Typography, Avatar } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from "@mui/icons-material/Person";
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
        {admins?.map((admin, index) => (
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
  );
}
