"use client";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Paper,
  Typography,
  useTheme
} from "@mui/material";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import "./promotional.css";
import "./preview.css";
import AddIcon from "@mui/icons-material/Add";
import { useToast } from "@/context/toastContext";
import { useMutation } from "@tanstack/react-query";
import { addMenuPromo } from "@/actions/actions.menu";
import LoadingButton from "@/components/ui/loading-button";

// Dynamic import for React Quill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false
  }
};


export default function AddPromotionalContent({ menuId, initialContent }: {
  menuId: string,
  initialContent?: string
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(initialContent || '');
  const { showToast } = useToast();

  const { mutate: addPromo, isPending } = useMutation({
    mutationFn: async (content: string) => {
      const result = await addMenuPromo(menuId, content);
      if (!result.success) throw new Error(result.error);
      return content;
    },
    onSuccess: (content: string) => {
      showToast(
        "Promotional content added successfully",
        "success"
      );
      setContent(content)
      handleClose();

    },
    onError: (error) => {
      showToast(error.message || "Failed to add promotional content", "error");
    }
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (!content.trim()) return;
    addPromo(content);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        startIcon={<AddIcon />}
        size="small"
        sx={{
          whiteSpace: 'nowrap',
          minWidth: { xs: '100%', sm: 'auto' }
        }}
      >
        Add Promotional Content
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Add Promotional Content</DialogTitle>
        <DialogContent>
          <Box sx={{
            height: { xs: 'auto', sm: '60vh' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3
          }}>
            {/* Editor Section */}
            <Box sx={{ flex: 1, minHeight: { xs: '40vh', sm: 'auto' } }}>
              <Typography variant="subtitle2" gutterBottom>
                Editor
              </Typography>
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={quillModules}
                className="quill"
                theme="snow"
                placeholder="Start writing your promotional content..."
              />
            </Box>

            {/* Preview Section */}
            <Box sx={{ flex: 1, minHeight: { xs: '40vh', sm: 'auto' } }}>
              <Typography variant="subtitle2" gutterBottom>
                Live Preview
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  height: 'calc(100% - 30px)',
                  overflow: 'auto',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
                className="quill-preview"
              >
                {content ? (
                  <div
                    className="quill-preview"
                    dangerouslySetInnerHTML={{
                      __html: content
                    }}
                    style={{
                      color: theme.palette.mode === 'dark' ? 'white' : 'black',
                    }}
                  />
                ) : (
                  <Typography color="text.secondary" align="center">
                    Preview will appear here
                  </Typography>
                )}
              </Paper>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <LoadingButton
            onClick={handleSave}
            variant="contained"
            loading={isPending}
            loadingText="Saving..."
            disabled={!content.trim()}
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}