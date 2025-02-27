'use client'
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@/components/ui/loading-button";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import { Button } from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/context/toastContext";
import { deleteMenu } from "@/actions/actions.menu";
import { useParams } from "next/navigation";

export default function DeleteMenu({ menuId }: { menuId: string }) {
  const [open, setOpen] = useState(false);
  const {restaurantId} = useParams(); 
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return deleteMenu({ menuId, restaurantId: restaurantId as string || null });
    },
    onSuccess: (response) => {
      if (!response?.success) {
        showToast("Failed to delete menu", 'error');
        return;
      }
      showToast('Menu deleted successfully', 'success');
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
    onError: (error) => {
      showToast('Failed to delete menu', 'error');
      console.error(error);
    }
  });

  return (
    <>
      <IconButton
        size="small"
        aria-label="delete menu"
        onClick={() => setOpen(true)}
      >
        <DeleteIcon color="error" />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Delete Menu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this menu? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <LoadingButton
            loading={isPending}
            onClick={() => mutate()}
            color="error"
            variant="contained"
            loadingText="Deleting..."
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}