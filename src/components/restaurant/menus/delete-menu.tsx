import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@/components/ui/loading-button";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import { Button } from "@mui/material";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/context/toastContext";
import { deleteMenu } from "@/actions/actions.menu";

export default function DeleteMenu({ menuId }: { menuId: string }) {
  const [open, setOpen] = useState(false);
  const { showToast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: deleteMenu,
    onSuccess: (response) => {
      if (!response) {
        showToast( "Failed to delete menu", 'error')
        return;
      }
      showToast('Menu deleted successfully', 'success')
      setOpen(false);
    },
    onError: (error) => {
      showToast('Failed to delete menu', 'error')
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
            onClick={() => mutate(menuId)}
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