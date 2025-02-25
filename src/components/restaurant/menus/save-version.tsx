'use client';

import { useState } from 'react';
import { Button, Popover, Box, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveMenuVersion } from '@/actions/actions.version';
import { useToast } from '@/context/toastContext';
import LoadingButton from '@/components/ui/loading-button';

interface SaveVersionProps {
  menuId: string;
  restaurantId: string;
}

export default function SaveVersion({ menuId, restaurantId }: SaveVersionProps) {
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [tag, setTag] = useState('');
  const { showToast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await saveMenuVersion(restaurantId, menuId, tag);
    },
    onSuccess: (data) => {
      if (data.success) {
        showToast(`Current Menu saved as ${tag} successfully`, 'success');
        handleClose();

        // Invalidate the menu query to refetch the data
        queryClient.invalidateQueries({ queryKey: ['menu-versions', menuId] });
      } else {
        showToast(data.error || 'Failed to save version', 'error');
      }
    },
    onError: () => {
      showToast('Failed to save version', 'error');
    }
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setTag('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag.trim()) {
      showToast('Please enter a version tag', 'error');
      return;
    }
    mutate();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'save-version-popover' : undefined;

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<SaveIcon />}
        onClick={handleClick}
        size="small"
        sx={{
          width: { xs: '100%', sm: 'auto' },
          whiteSpace: 'nowrap'
        }}
      >
        Save Version
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 2,
            width: 300,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            autoFocus
            label="Version Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} size="small">
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              size="small"
              loading={isPending}
              loadingText="Saving..."
            >
              Save Version
            </LoadingButton>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
