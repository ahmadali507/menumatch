import { FormControl, FormLabel, Box, Typography } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

interface MenuItemImageUploadProps {
  preview: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}

export default function MenuItemImageUpload({
  preview,
  onUpload,
  onDelete
}: MenuItemImageUploadProps) {
  return (
    <FormControl fullWidth>
      <FormLabel>Item Image</FormLabel>
      <div className="relative">
        <Box
          sx={{
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              borderColor: "primary.main",
              bgcolor: preview ? "transparent" : "action.hover",
            },
          }}
          component="label"
          onClick={(e) => {
            if (preview) {
              e.preventDefault();
            }
          }}
        >
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={onUpload}
            disabled={!!preview}
          />
          {preview ? (
            <Image
              src={preview}
              alt="Item preview"
              fill
              className="object-cover rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <CloudUpload sx={{ fontSize: 40, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                Upload Image
              </Typography>
            </div>
          )}
        </Box>
        {preview && (
          <IconButton
            size="small"
            onClick={onDelete}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'white',
              color: 'error.main',
              boxShadow: 2,
              border: '2px solid',
              borderColor: 'error.light',
              '&:hover': {
                bgcolor: 'error.light',
                color: 'white',
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </div>
    </FormControl>
  );
}
