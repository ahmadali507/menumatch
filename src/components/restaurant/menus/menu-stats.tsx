"use client";
import { Grid, Stack, Typography, Box } from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import { Menu } from "@/types";
import { format } from "date-fns";

export default function MenuStats({ menu }: { menu: Menu }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 items-start sm:items-center">
      <Grid item xs={12} sm={6}>
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            Start Date
          </Typography>
          {menu.availabilityType === "indefinite" ?
            <Typography variant="body2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#90EE90' : '#006400' }}>
              Always Available
            </Typography>
            : <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {menu.startDate ? format(new Date(menu.startDate), "EEEE, MMMM d, yyyy") : "Not Set"}
              </Typography>
            </Box>}
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            End Date
          </Typography>
          {menu.availabilityType === "indefinite" ?
            <Typography variant="body2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#90EE90' : '#006400' }}>
              Always Available
            </Typography>
            : <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {menu.endDate ? format(new Date(menu.endDate), "EEEE, MMMM d, yyyy") : "Not Set"}
              </Typography>
            </Box>}
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            Created At
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {format(new Date(menu.createdAt), "EEEE, MMMM d, yyyy")}
            </Typography>
          </Box>
        </Stack>
      </Grid>
    </div>
  );
}
