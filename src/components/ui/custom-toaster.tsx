import { Alert, AlertColor, Snackbar, styled } from "@mui/material";

const StyledAlert = styled(Alert)(() => ({
    borderRadius: "8px",
    "&.MuiAlert-standardSuccess": {
      backgroundColor: "#E7F6E7",
      color: "#1E4620",
      "& .MuiAlert-icon": {
        color: "#2E7D32",
      },
    },
    "&.MuiAlert-standardError": {
      backgroundColor: "#FDEDED",
      color: "#5F2120",
      "& .MuiAlert-icon": {
        color: "#D32F2F",
      },
    },
  }));

  interface SnackbarProps {
    open: boolean;
    message: string;
    severity: AlertColor;
    onClose: () => void;
  }
  export const CustomSnackbar = ({ open, message, severity, onClose }: SnackbarProps) => {
    return (
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
       <StyledAlert
          onClose={onClose}
          severity={severity}
          sx={{ width: "100%", minWidth: "300px" }}
          elevation={6}
          variant="standard"
        >
          {message}
        </StyledAlert>
      </Snackbar>
    );
  };

  