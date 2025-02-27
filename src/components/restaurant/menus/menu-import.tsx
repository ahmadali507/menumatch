"use client";
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { menuSchema } from '@/lib/validations/menu-schema';
import { useMutation } from '@tanstack/react-query';
import { useMenu } from '@/context/menuContext';
import { updateMenuData } from '@/actions/actions.menu';
import { useToast } from '@/context/toastContext';
import LoadingButton from '@/components/ui/loading-button';
import { useParams } from 'next/navigation';

// Helper function to check if a string is a valid ISO date
const isISODateString = (value: string): boolean => {
  // Check for ISO date format: YYYY-MM-DDThh:mm:ss.sssZ or similar variations
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;
  return typeof value === 'string' && isoDateRegex.test(value) && !isNaN(Date.parse(value));
};

// Recursively convert date strings to Date objects in an object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertDatesToObjects = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => convertDatesToObjects(item));
  }

  const result = { ...obj };

  Object.keys(result).forEach(key => {
    const value = result[key];

    if (typeof value === 'string' && isISODateString(value)) {
      // Convert ISO date string to Date object
      result[key] = new Date(value);
    } else if (typeof value === 'object' && value !== null) {
      // Recursively process nested objects
      result[key] = convertDatesToObjects(value);
    }
  });

  return result;
};

export default function MenuImport({ menuId }: { menuId: string }) {

  const { showToast } = useToast();

  const {restaurantId} = useParams();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pendingData: any | null;
  }>({
    open: false,
    pendingData: null
  });

  const { setMenu } = useMenu();

  const updateMenuMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (menu: any) => await updateMenuData(menuId, menu, restaurantId as string || null),
    onSuccess: (data) => {
      if (data.success && data.menu) {
        // Process the menu data - ensure all dates are Date objects and IDs are stable
        const processedMenu = convertDatesToObjects({
          ...data.menu,
          sections: data.menu.sections.map(section => ({
            ...section,
            id: section.id || `section-${Math.random().toString(36).substr(2, 9)}`,
            items: section.items.map(item => ({
              ...item,
              // Ensure stable IDs - keep existing or generate new ones
              id: item.id || `item-${Math.random().toString(36).substr(2, 9)}`,
              _importedAt: Date.now()
            }))
          }))
        });

        // Set the processed menu to the context
        setMenu(processedMenu);
        showToast('Menu imported successfully', 'success');
        setConfirmDialog({ open: false, pendingData: null });
      }
    },
    onError: (error) => {
      console.log(error.message);
      showToast('Failed to update menu', 'error');
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const data = JSON.parse(content);

      // Pre-process the data to convert any date strings to Date objects
      // before validation to ensure proper type checking
      const preprocessedData = convertDatesToObjects(data);

      const validationResult = menuSchema.safeParse(preprocessedData);

      if (!validationResult.success) {
        showToast('Invalid menu format', 'error');

        // Log validation errors
        console.error(validationResult.error.errors)
        return;
      }

      // Instead of immediately updating, show confirmation dialog
      setConfirmDialog({
        open: true,
        pendingData: validationResult.data
      });

    } catch (error) {
      showToast((error as Error).message || 'Error importing menu', 'error');
    }

    e.target.value = '';
  };

  const handleConfirmImport = () => {
    if (!confirmDialog.pendingData) return;
    // perform mutation
    updateMenuMutation.mutate(confirmDialog.pendingData);
  };

  const handleCloseDialog = () => {
    setConfirmDialog({ open: false, pendingData: null });
  };


  return (
    <>
      <input
        accept=".json"
        style={{ display: 'none' }}
        id="import-menu-button"
        type="file"
        onChange={handleFileUpload}
        disabled={updateMenuMutation.isPending}
      />
      <label htmlFor="import-menu-button">
        <Button
          variant="outlined"
          component="span"
          size="small"
          startIcon={<UploadIcon />}
          disabled={updateMenuMutation.isPending}
        >
          {updateMenuMutation.isPending ? 'Importing...' : 'Import'}
        </Button>
      </label>

      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirm Import</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action will overwrite the current menu data. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <LoadingButton
            onClick={handleConfirmImport}
            color="primary"
            variant="contained"
            autoFocus
            loading={updateMenuMutation.isPending}
            loadingText='Importing...'
          >
            Import
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}