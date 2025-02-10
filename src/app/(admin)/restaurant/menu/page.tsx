import { routes } from "@/lib/routes";
import { Button } from "@mui/material";
import RestaurantMenuIcon from '@mui/icons-material/Add';

export const metadata: Metadata = {
  title: "Menus",
  description: "View and Manage all menus from here",
}

import Link from "next/link";
import { Metadata } from "next";
import PageTitle from "@/components/restaurant/dashboard/page-title";

export default function RestaurantMenuPage() {
  return <section className="pb-6 space-y-6">
    <PageTitle title="Manage Menus" description="Manage and Edit all your menus here">
      <Link href={routes.addMenu}>
        <Button
          variant="outlined"
          color="success"
          startIcon={<RestaurantMenuIcon />}
        >
          Add Menu
        </Button>
      </Link>
    </PageTitle>

    <div>
      These are the list of all menus
    </div>
  </section>
}