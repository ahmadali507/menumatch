import { Button,  } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
// import { useState } from "react";
import { redirect } from "next/navigation";
// import { getRestaurantIdForAdmin } from "@/actions/actions.menu";

export default function AddItemToMenu({menuId, sectionId}:{menuId: string, sectionId: string}) {
  // const [open, setOpen] = useState(false);
  // const restaurantId = await getRestaurantIdForAdmin(); 
  const handleClick = () => {
    console.log("Button clicked")
    redirect(`/restaurant/menu/${menuId}/additem/${sectionId}`)
  }
  return <>
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      size="small"
      onClick={handleClick}
      sx={{ ml: 2 }}
    >
      Add Item
    </Button>
    {/* <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "rgba(17, 25, 40, 0.9)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "white",
          "& .MuiFormLabel-root": {
            color: "rgba(255, 255, 255, 0.7)",
          },
          "& .MuiInputBase-root": {
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.2)",
          },
          "& .MuiMenuItem-root": {
            color: "white",
          },
        },
      }}
    >
      <DialogTitle>
        Add Item to Menu
      </DialogTitle>
      <DialogContent>
        this is to add an item
      </DialogContent>
    </Dialog> */}  </>


}