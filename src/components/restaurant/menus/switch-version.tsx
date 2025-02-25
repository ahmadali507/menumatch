'use client';

import { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getMenuVersions, switchToVersion } from '@/actions/actions.version';
import { useToast } from '@/context/toastContext';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import LoadingButton from '@/components/ui/loading-button';
import { VersionDataType } from '@/types';

interface SwitchVersionProps {
  menuId: string;
  restaurantId: string;
}

export default function SwitchVersion({ menuId, restaurantId }: SwitchVersionProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVersion, setSelectedVersion] = useState<VersionDataType | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const { data: versionsData, isLoading } = useQuery({
    queryKey: ['menu-versions', menuId],
    queryFn: () => getMenuVersions(restaurantId, menuId),
  });

  const switchMutation = useMutation({
    mutationFn: () => switchToVersion(restaurantId, menuId, selectedVersion?.id || ""),
    onSuccess: (data) => {
      if (data.success) {
        showToast('Menu version switched successfully. Refresh the page to take effect! ', 'success');
        router.refresh();
        handleClose();
      } else {
        showToast(data.error || 'Failed to switch version', 'error');
      }
    },
    onError: () => {
      showToast('Failed to switch version', 'error');
    }
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedVersion(null);
    setConfirmOpen(false);
  };

  const handleVersionClick = (version: VersionDataType) => {
    setSelectedVersion(version);
    setConfirmOpen(true);
    setAnchorEl(null);
  };

  const handleConfirm = () => {
    switchMutation.mutate();
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<HistoryIcon />}
        onClick={handleClick}
        size="small"
        sx={{
          width: { xs: '100%', sm: 'auto' },
          whiteSpace: 'nowrap'
        }}
      >
        Switch Version
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {isLoading ? (
          <MenuItem disabled>Loading...</MenuItem>
        ) : versionsData?.versions?.length ? (
          versionsData.versions.map((version) => (
            <MenuItem
              key={version.id}
              onClick={() => handleVersionClick(version)}
            >
              {version.tag} - {format(new Date(version.createdAt), 'MMM dd, yyyy HH:mm')}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No versions available</MenuItem>
        )}
      </Menu>

      <Dialog open={confirmOpen} onClose={handleClose}>
        <DialogTitle>Confirm Version Switch</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to switch to version &quot;{selectedVersion?.tag}&quot;?
            This will replace the current menu content.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          <LoadingButton
            onClick={handleConfirm}
            variant="contained"
            loadingText='Switching...'
            loading={switchMutation.isPending}
          >
            Switch Version
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
