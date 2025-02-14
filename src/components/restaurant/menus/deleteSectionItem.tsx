'use client'

import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@/components/ui/loading-button";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import { Button } from "@mui/material";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/context/toastContext";
import { deleteMenuSection, deleteMenuItem } from "@/actions/actions.menu";
import { useRouter } from "next/navigation";
import { useMenu } from "@/context/menuContext";

interface DeleteSectionItemProps {
  menuId: string;
  sectionId: string;
  itemId?: string;
}

export default function DeleteSectionItem({ menuId, sectionId, itemId }: DeleteSectionItemProps) {
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const { menu, setMenu } = useMenu();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return itemId 
        ? deleteMenuItem(menuId, sectionId, itemId)
        : deleteMenuSection(menuId, sectionId);
    },
    onSuccess: (response) => {
      if (!response.success) {
        showToast(response.error || "Failed to delete", 'error');
        return;
      }
      
      if (menu && response?.menu) {
        let newMenu;
        
        if (itemId) {
          // For item deletion
          newMenu = {
            ...menu,
            sections: menu.sections.map(section => 
              section.id === sectionId 
                ? {
                    ...section,
                    items: section.items.filter(item => item.id !== itemId)
                  }
                : section
            )
          };
          console.log("item deleted menu items", newMenu?.sections.map(section=> section.id !== sectionId 
            ? {
                ...section,
                items: section.items.filter(item => item.id !== itemId)
              }
            : section)); 
        } else {
          // For section deletion
          newMenu = {
            ...menu,
            sections: menu.sections.filter(section => section.id !== sectionId)
          };
        }
        
        setMenu(newMenu);
      }

      const message = itemId 
        ? 'Item deleted successfully' 
        : 'Section deleted successfully';
      showToast(message, 'success');
      router.refresh();
      setOpen(false);
    },
    onError: (error: Error) => {
      showToast('Failed to delete', 'error');
      console.error(error);
    }
  });

  const getDialogText = () => {
    return itemId 
      ? 'Are you sure you want to delete this item?' 
      : 'Are you sure you want to delete this section and all its items?';
  };

  return (
    <>
      <IconButton
        size="small"
        aria-label={itemId ? "delete item" : "delete section"}
        onClick={() => setOpen(true)}
      >
        <DeleteIcon color="error" />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {itemId ? 'Delete Item' : 'Delete Section'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {getDialogText()} This action cannot be undone.
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