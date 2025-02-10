import MenuSkeleton from "@/components/restaurant/menus/menu-skeleton";

export default function Loading() {
  return (
    <section className="pb-6 space-y-6">
      <MenuSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <MenuSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
