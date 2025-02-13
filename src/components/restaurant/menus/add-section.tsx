'use client';
import { Button, Popover, Box, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { addMenuSection } from '@/actions/actions.menu';
import { useToast } from '@/context/toastContext';
import LoadingButton from '@/components/ui/loading-button';
import { useRouter } from 'next/navigation';

export default function AddSection({ menuId }: { menuId: string }) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [sectionName, setSectionName] = useState('');
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return addMenuSection(menuId, sectionName);
    },
    onSuccess: (response) => {
      if (!response.success) {
        showToast(response.error || 'Failed to add section', 'error');
        return;
      }
      router.refresh();
      showToast('Section added successfully', 'success');
      setSectionName('');
      setAnchorEl(null);
    },
    onError: () => {
      showToast('Failed to add section', 'error');
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSectionName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionName.trim()) {
      showToast('Please enter a section name', 'error');
      return;
    }
    mutate();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'add-section-popover' : undefined;

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleClick}
        size="small"
      >
        Add Section
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
            label="Section Name"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
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
              loadingText="Adding..."
            >
              Add Section
            </LoadingButton>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
