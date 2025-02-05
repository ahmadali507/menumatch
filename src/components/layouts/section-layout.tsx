import { Typography } from "@mui/material";
import { PropsWithChildren } from "react";

interface SectionLayoutProps extends PropsWithChildren {
  title: string;
  description?: string
  endButton?: React.ReactNode
}

export default function SectionLayout({ title, description, endButton, children }: SectionLayoutProps) {
  return <section className="px-2 pb-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <Typography component="h2" variant="h4">
          {title}
        </Typography>
        {description && <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>}
      </div>
      {endButton}
    </div>
    {children}
  </section>
}