import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admins",
  description: "Manage system administrators and their permissions",
};

export default function AdminsPage() {
  return <h1>These are the list of admins</h1>
}