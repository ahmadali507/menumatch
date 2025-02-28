'use client'
import { Button, Card, Typography, Avatar, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from '@mui/icons-material/Groups';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from "next/link";
import { resAdminType } from "@/types";
import AddAdminButtonLink from "./add-admin-button-link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdmin, deleteAdmin } from "@/actions/actions.admin";
import { useToast } from "@/context/toastContext";
import { useState } from "react";
import EditAdminDialog from "../dialogs/edit-admin-dialog";
import DeleteConfirmDialog from "../dialogs/delete-confirm-dialog";
// import { useAuth } from "@/context/authContext";
// import { useUser } from "@/context/userContext";
import { auth } from "@/firebase/firebaseconfig";
import { useUser } from "@/context/userContext";

export default function AdminsList({ restaurantId, admins }: {
  restaurantId: string;
  admins: resAdminType[];
}) {
  const { showToast } = useToast();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [editingAdmin, setEditingAdmin] = useState<resAdminType | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<resAdminType | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (adminId: string) => {

      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not found");
      }
      const idToken = await user.getIdToken(true);
      const result = await deleteAdmin(adminId, idToken as string);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      showToast("Admin deleted successfully", "success");
      queryClient.invalidateQueries({ queryKey: ['admins', restaurantId] });
    },
    onError: (error) => {
      showToast(error.message || "Failed to delete admin", "error");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ adminId, data }: { adminId: string, data: Partial<resAdminType> }) => {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not found");
      }
      const idToken = await user.getIdToken(true);
      const result = await updateAdmin(adminId, data, idToken as string);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      showToast("Admin updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: ['admins', restaurantId] });
      setEditingAdmin(null);
    },
    onError: (error) => {
      showToast(error.message || "Failed to update admin", "error");
    }
  });

  const handleDelete = async (admin: resAdminType) => {
    setAdminToDelete(admin);
  };

  const handleConfirmDelete = () => {
    if (adminToDelete) {
      deleteMutation.mutate(adminToDelete.id);
      setAdminToDelete(null);
    }
  };

  return (
    <Card className="w-full lg:w-[400px]" sx={{ minHeight: { xs: '300px', lg: '400px' } }}>
      <div className="flex flex-col sm:flex-row lg:flex-col justify-between items-start sm:items-center lg:items-start gap-4 mb-6">
        <Typography variant="h6" className="flex items-center">
          <PersonIcon sx={{ marginRight: "10px" }} />
          Restaurant Admins
        </Typography>
        <div className="w-full sm:w-auto">
          <AddAdminButtonLink restaurantId={restaurantId} />
        </div>
      </div>

      <div className="h-[300px] overflow-y-auto space-y-4">
        {admins?.length > 0 ? (
          admins.map((admin) => (
            <div
              key={admin.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 hover:bg-gray-900/50 rounded-lg transition-colors gap-3"
            >
              <div className="flex items-center gap-3">
                <Avatar>{admin.name.charAt(0)}</Avatar>
                <div>
                  <Typography variant="subtitle2">{admin.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {admin.email}
                  </Typography>
                </div>
              </div>
              {user?.role === "super_admin" && <div className="flex gap-1">
                <IconButton
                  size="small"
                  onClick={() => setEditingAdmin(admin)}
                  disabled={deleteMutation.isPending}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(admin)}
                  disabled={deleteMutation.isPending}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>}
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

      {adminToDelete && (
        <DeleteConfirmDialog
          open={!!adminToDelete}
          title="Delete Admin"
          message={`Are you sure you want to delete ${adminToDelete.name}? This action cannot be undone.`}
          onClose={() => setAdminToDelete(null)}
          onConfirm={handleConfirmDelete}
          isLoading={deleteMutation.isPending}
        />
      )}

      {editingAdmin && (
        <EditAdminDialog
          admin={editingAdmin}
          onClose={() => setEditingAdmin(null)}
          onSubmit={(data) => {
            updateMutation.mutate({
              adminId: editingAdmin.id,
              data
            });
          }}
          isLoading={updateMutation.isPending}
        />
      )}
    </Card>
  );
}