import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import Link from "next/link";
import { routes } from "@/lib/routes";

export default function AddRestaurant() {
  return <Link href={routes.addRestaurant}>
    <Button
      variant="contained"
      startIcon={<AddIcon />}
    >
      Add Restaurant
    </Button>
  </Link>
}