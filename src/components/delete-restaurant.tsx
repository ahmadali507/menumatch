import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { deleteRestaurant } from '@/actions/actions.admin';
import { useToast } from "@/context/toastContext";
// import { auth } from "firebase-admin";
import { auth } from "@/firebase/firebaseconfig";

interface DeleteRestaurantProps {
  restaurantId: string;
  restaurantName: string;
}

export default function DeleteRestaurant({ restaurantId, restaurantName }: DeleteRestaurantProps) {
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (restaurantId: string) => {
      const user = auth.currentUser; 
      if(!user){
        throw new Error("User not found");
      }
      const idToken = await user.getIdToken(true);
      return await deleteRestaurant(restaurantId, idToken);
    },
    onSuccess: (response) => {
      console.log(Response)
      if (response.success) {
        showToast('Restaurant deleted successfully', "success")
      } else {
        showToast(response.error || 'Failed to delete restaurant', "error")
      }
    },
    onError: (error) => {
      showToast('Failed to delete restaurant', "error")
      console.error('Delete error:', error);
    }
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = () => {
    mutate(restaurantId);
  };

  return (
    <>
      <IconButton size="small" color="error" onClick={handleOpen}>
        <DeleteIcon fontSize="small" />
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Restaurant</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{restaurantName}</strong>? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}