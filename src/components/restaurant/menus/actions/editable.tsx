'use client'

import { useState } from 'react';
import { Typography, IconButton, TextField, Box, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from '@tanstack/react-query';
import { useMenu } from '@/context/menuContext';
// import { updateMenuSectionName } from '@/actions/actions.menu';
import { useToast } from '@/context/toastContext';

interface EditableSectionNameProps {
  sectionId: string;
  name: string;
  onSave: (newName: string) => Promise<{ success: boolean; error?: string }>;
}

export default function EditableSectionName({ sectionId, name, onSave }: EditableSectionNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const { menu, setMenu } = useMenu();
  const { showToast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (newName: string) => {
      return await onSave(newName);
    },
    onSuccess: (response) => {
      if (!response.success) {
        showToast(response.error || 'Failed to update section name', 'error');
        return;
      }

      // Update the menu state with the new section name
      if (menu) {
        const updatedMenu = {
          ...menu,
          sections: menu.sections.map(section => 
            section.id === sectionId
              ? { ...section, name: editedName }
              : section
          )
        };
        setMenu(updatedMenu);
      }
      
      showToast('Section name updated successfully', 'success');
      setIsEditing(false);
    },
    onError: (error: Error) => {
      showToast('Failed to update section name', 'error');
      console.error('Error updating section name:', error);
      setEditedName(name); // Reset to original name on error
    }
  });

  const handleSave = () => {
    if (editedName.trim() !== '' && editedName !== name) {
      mutate(editedName);
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(name);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
    >
      {isEditing ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onKeyDown={handleKeyPress}
            variant="standard"
            autoFocus
            disabled={isPending}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: 'h4.fontSize',
                fontFamily: 'h4.fontFamily'
              },
              maxWidth: "180px",
            }}
          />
          {isPending ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <IconButton 
                size="small" 
                onClick={handleSave} 
                color="primary"
                disabled={isPending}
              >
                <CheckIcon />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={handleCancel} 
                color="error"
                disabled={isPending}
              >
                <CloseIcon />
              </IconButton>
            </>
          )}
        </Box>
      ) : (
        <Typography
          variant="h4"
          onClick={() => !isPending && setIsEditing(true)}
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            cursor: isPending ? 'not-allowed' : 'pointer' 
          }}
        >
          {editedName}
          <EditIcon
            sx={{ 
              ml: 1, 
              fontSize: '0.8em', 
              color: isPending ? 'action.disabled' : 'action.active' 
            }}
          />
        </Typography>
      )}
    </Box>
  );
}