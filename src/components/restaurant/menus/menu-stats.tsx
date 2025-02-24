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
          {menu.availabilityType === "indefinite" ?
            <Typography variant="body2" sx={{ color: "lightgreen" }}>
              Always Available
            </Typography>
            : <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {/* {menu.startDate ? format(menu.startDate as Date, "EEEE, MMMM d, yyyy") : "Not Set"} */}
                {/* {menu.startDate?.toLocaleDateString()} */}
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
            <Typography variant="body2" sx={{ color: "lightgreen" }}>
              Always Available
            </Typography>
            : <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {/* {menu.endDate ? format(menu.endDate as Date, "EEEE, MMMM d, yyyy") : "Not Set"} */}
                {/* {menu.endDate?.toLocaleDateString()} */}
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
              {/* {format(menu.createdAt as Date, "EEEE, MMMM d, yyyy")} */}
              {/* {JSON.stringify(menu.createdAt)} */}
            </Typography>
          </Box>
        </Stack>
      </Grid>
    </div>
  );
}
