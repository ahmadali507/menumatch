interface PageTitleProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function PageTitle({ title, description, children }: PageTitleProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm sm:text-base text-gray-500">{description}</p>
      </div>
      {children}
    </div>
  );
}