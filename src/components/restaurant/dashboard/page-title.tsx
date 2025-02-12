import { Typography } from "@mui/material";
import { PropsWithChildren } from "react";

interface PageTitleProps extends PropsWithChildren {
  title: string;
  description?: string;
}

export default function PageTitle({ title, description, children }: PageTitleProps) {
  return <div className="flex justify-between items-center mb-6">
    <div>
      <Typography component="h1" variant="h4">
        {title}
      </Typography>
      {description && <Typography component="p" color="text.secondary">
        {description}
      </Typography>}
    </div>

    {children}
  </div>
}