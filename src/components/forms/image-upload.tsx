"use client";
import { Paper, FormLabel, FormHelperText, Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";

interface ImageUploadProps {
  type: 'logo' | 'background';
  preview: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export default function ImageUpload({ type, preview, onUpload, onDelete }: ImageUploadProps) {
  const isLogo = type === 'logo';
  const inputId = `${type}-upload`;

  return (
    <div>
      <FormLabel>{isLogo ? 'Logo' : 'Background Image'}</FormLabel>
      <div className="relative">
        <Paper
          variant="outlined"
          className="mt-2 border-dashed border-2 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors relative"
          onClick={() => !preview && document.getElementById(inputId)?.click()}
        >
          <input
            id={inputId}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onUpload}
          />
          {preview ? (
            <div className={`relative ${isLogo
              ? "w-[200px] h-[200px] mx-auto"
              : "w-full pt-[56.25%]"
              }`}>
              {isLogo ? (
                <Image
                  src={preview}
                  alt={`${type} preview`}
                  fill
                  className="object-contain rounded-md"
                />
              ) : (
                <div className="absolute inset-0">
                  <Image
                    src={preview}
                    alt={`${type} preview`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <CloudUploadIcon className="text-4xl mb-2" />
              <Typography>Click to upload {type}</Typography>
            </>
          )}
          <FormHelperText sx={{ textAlign: "center", mt: 2 }}>
            {isLogo
              ? "Recommended: 512x512px, max 2MB"
              : "Recommended: 1920x1080px, max 5MB"
            }
          </FormHelperText>
        </Paper>
        {preview && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
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
    </div>
  );
}