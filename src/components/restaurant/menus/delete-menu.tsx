'use client'

import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@/components/ui/loading-button";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import { Button } from "@mui/material";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/context/toastContext";
import { deleteMenu, deleteMenuSection } from "@/actions/actions.menu";
import { useRouter } from "next/navigation";
import { useMenu } from "@/context/menuContext";
// import { Menu } from "@/types";

interface DeleteMenuProps {
  menuId: string;
  sectionId?: string;
}

export default function DeleteMenu({ menuId, sectionId }: DeleteMenuProps) {
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const { menu, setMenu } = useMenu();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return sectionId ? deleteMenuSection(menuId, sectionId) : deleteMenu(menuId);
    },
    onSuccess: (response) => {
      if (!response.success) {
        showToast(response.error || "Failed to delete menu", 'error');
        return;
      }
      
      if (sectionId && menu && response?.menu && typeof response.menu !== 'string') {
        const newMenu = { ...menu, sections: response.menu.sections };
        setMenu(newMenu);
      }

      const message = sectionId ? 'Section deleted successfully' : 'Menu deleted successfully';
      showToast(message, 'success');
      router.refresh();
      setOpen(false);

      // Redirect if deleting entire menu
      if (!sectionId) {
        router.push('/restaurant/menus');
      }
    },
    onError: (error: Error) => {
      showToast('Failed to delete menu', 'error');
      console.error(error);
    }
  });

  return (
    <>
      <IconButton
        size="small"
        aria-label={sectionId ? "delete section" : "delete menu"}
        onClick={() => setOpen(true)}
      >
        <DeleteIcon color="error" />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{sectionId ? 'Delete Section' : 'Delete Menu'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this {sectionId ? 'section' : 'menu'}? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <LoadingButton
            isLoading={isPending}
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