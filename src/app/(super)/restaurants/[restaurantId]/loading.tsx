import SectionLayout from "@/components/layouts/section-layout";
import RestaurantInfoLoader from "@/components/restaurant/infopage/infopage-loader";

export default function Loading() {
  return <SectionLayout
    title="Restaurant Details"
    description="Displays detailed information about a specific restaurant"
  >
    <RestaurantInfoLoader />
  </SectionLayout>
}