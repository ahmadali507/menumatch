import { Grid, Stack, Typography, Box } from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import { format } from "date-fns";
import { Menu } from "@/types";

export default function MenuStats({ menu }: { menu: Menu }) {
  return (
    <div className="flex gap-10 items-center">
      <Grid item xs={12} sm={6}>
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            Start Date
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {format(new Date(menu.startDate), "EEEE, MMMM d, yyyy")}
            </Typography>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            End Date
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {format(new Date(menu.endDate), "EEEE, MMMM d, yyyy")}
            </Typography>
          </Box>
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
              {format(new Date(menu.endDate), "EEEE, MMMM d, yyyy")}
            </Typography>
          </Box>
        </Stack>
      </Grid>
    </div>
  );
}
