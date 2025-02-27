import AddMenuForm from "@/components/forms/add-menu"
import PageTitle from "@/components/restaurant/dashboard/page-title"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Add Menu",
  description: "Create a new menu from scratch!"
}

export default function AddMenuPage() {
  return <section>
    <PageTitle title="Add Menu" description="Fill the form details to create a menu of your choice!" />
    <AddMenuForm />
  </section>
}