import { useState } from 'react';
import { Typography, IconButton, TextField, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface EditableSectionNameProps {
  name: string;
  onSave: (newName: string) => void;
}

export default function EditableSectionName({ name, onSave }: EditableSectionNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const handleSave = () => {
    if (editedName.trim() !== '') {
      onSave(editedName);
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
            sx={{
              '& .MuiInputBase-root': {
                fontSize: 'h4.fontSize',
                fontFamily: 'h4.fontFamily'
              },
              maxWidth: "180px",
            }}
          />
          <IconButton size="small" onClick={handleSave} color="primary">
            <CheckIcon />
          </IconButton>
          <IconButton size="small" onClick={handleCancel} color="error">
            <CloseIcon />
          </IconButton>
        </Box>
      ) : (
        <Typography
          variant="h4"
          onClick={() => setIsEditing(true)}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {editedName}
          {/* {showEditIcon && ( */}
          <EditIcon
            sx={{ ml: 1, fontSize: '0.8em', color: 'action.active' }}
          />
          {/* )} */}
        </Typography>
      )}
    </Box>
  );
}