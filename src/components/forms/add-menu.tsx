"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useController } from "react-hook-form";
import {
  TextField,
  Typography,
  FormControl,
  FormLabel,
  Card,
  CardContent,
  Grid,
  Box,
} from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import { DateTimePicker } from "@mui/x-date-pickers";
import LoadingButton from "../ui/loading-button";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/toastContext";
import { addMenuFormSchema, TAddMenuFormSchema } from "@/lib/schema";
import { addMenu } from "@/actions/actions.menu";
import { useUser } from "@/context/userContext";
import { useMutation } from "@tanstack/react-query";
import LanguageSelector from '@/components/ui/language-selector';
import { LanguageCode } from '@/lib/languages';

export default function AddMenuForm() {
  const { user } = useUser();
  const { showToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setValue
  } = useForm<TAddMenuFormSchema>({
    resolver: zodResolver(addMenuFormSchema),
    defaultValues: {
      name: "",
      availabilityType: "indefinite",
      startDate: new Date(),
      endDate: new Date(),
      language: "en" as LanguageCode, // Set default language
    },
  });

  const availabilityType = watch('availabilityType');

  const { field: startDateField } = useController({
    name: 'startDate',
    control,
  });

  const { field: endDateField } = useController({
    name: 'endDate',
    control,
  });

  const mutation = useMutation({
    mutationFn: addMenu,
    onSuccess: (response) => {
      if (!response.success) {
        showToast(response?.error || "Error while adding menu", "error");
        return;
      }
      reset();
      showToast("Menu created successfully", "success");
      router.push('/restaurant/menu');
    },
    onError: (error: Error) => {
      showToast(error.message || "Failed to create menu", "error");
    },
  });

  const onSubmit = (data: TAddMenuFormSchema) => {
    mutation.mutate({ 
      restaurantId: user?.restaurantId as string, 
      data: {
        ...data,
        language: data.language as LanguageCode
      }
    });
  };

  // Remove the redundant menuData state since we're using form state
  const handleLanguageChange = (language: LanguageCode) => {
    setValue('language', language);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Language Selector */}
      <div className="space-y-4">
        <Typography variant="h6">Menu Language</Typography>
        <FormControl fullWidth error={!!errors.language}>
          <FormLabel>Select Language</FormLabel>
          <LanguageSelector
            value={watch('language') as LanguageCode}
            onChange={handleLanguageChange}
          />
        </FormControl>
      </div>

      {/* Basic Details */}
      <div className="space-y-4">
        <Typography variant="h6">Menu Details</Typography>
        <FormControl fullWidth error={!!errors.name}>
          <FormLabel>Menu Name</FormLabel>
          <TextField
            {...register("name")}
            placeholder="e.g., Weekend Brunch"
            error={!!errors.name}
            helperText={errors.name?.message}
            // take full width on small screens and 50% on large
            sx={{ width: { xs: '100%', md: '50%' } }}
          />
        </FormControl>

        <div>
          <FormLabel>Menu Availability</FormLabel>
          <Grid container spacing={2} sx={{ mt: 0.25 }}>
            <Grid item xs={12} md={4}>
              <Card
                onClick={() => setValue('availabilityType', 'indefinite')}
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  bgcolor: availabilityType === 'indefinite' ? 'primary.main' : 'background.paper',

                  '& .MuiTypography-root': {
                    color: availabilityType === 'indefinite' ? 'primary.contrastText' : 'text.primary'
                  },
                  '& .MuiTypography-body2': {
                    color: availabilityType === 'indefinite' ? 'primary.contrastText' : 'text.secondary'
                  },
                  '& .MuiSvgIcon-root': {
                    color: availabilityType === 'indefinite' ? 'primary.contrastText' : 'primary.main'
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarTodayIcon />
                    <Typography variant="h6">Always Available</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Menu will be available at all times
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                onClick={() => setValue('availabilityType', 'custom')}
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  bgcolor: availabilityType === 'custom' ? 'primary.main' : 'background.paper',

                  '& .MuiTypography-root': {
                    color: availabilityType === 'custom' ? 'primary.contrastText' : 'text.primary'
                  },
                  '& .MuiTypography-body2': {
                    color: availabilityType === 'custom' ? 'primary.contrastText' : 'text.secondary'
                  },
                  '& .MuiSvgIcon-root': {
                    color: availabilityType === 'custom' ? 'primary.contrastText' : 'primary.main'
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTimeIcon />
                    <Typography variant="h6">Custom Schedule</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Set specific dates and times
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                onClick={() => setValue('availabilityType', 'ramadan')}
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  bgcolor: availabilityType === 'ramadan' ? 'primary.main' : 'background.paper',

                  '& .MuiTypography-root': {
                    color: availabilityType === 'ramadan' ? 'primary.contrastText' : 'text.primary'
                  },
                  '& .MuiTypography-body2': {
                    color: availabilityType === 'ramadan' ? 'primary.contrastText' : 'text.secondary'
                  },
                  '& .MuiSvgIcon-root': {
                    color: availabilityType === 'ramadan' ? 'primary.contrastText' : 'primary.main'
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EventIcon />
                    <Typography variant="h6">Ramadan Special</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Available during Ramadan
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>

      {/* Schedule - Only show if custom availability selected */}
      {availabilityType === 'custom' && (
        <div className="space-y-4">
          <Typography variant="h6">Schedule</Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Choose when this menu will be available to your customers
            </Typography>
          </Box>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormControl fullWidth error={!!errors.startDate}>
              <FormLabel>Starts</FormLabel>
              <DateTimePicker
                value={startDateField.value}
                onChange={startDateField.onChange}
                minDateTime={new Date()} // This will disable past dates and times
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.startDate,
                    helperText: errors.startDate?.message,
                  }
                }}
                format="MMM d, yyyy h:mm a"
              />
            </FormControl>

            <FormControl fullWidth error={!!errors.endDate}>
              <FormLabel>Ends</FormLabel>
              <DateTimePicker
                value={endDateField.value}
                onChange={endDateField.onChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.endDate,
                    helperText: errors.endDate?.message,
                  }
                }}
                format="MMM d, yyyy h:mm a"
              />
            </FormControl>
          </div>
        </div>
      )}

      <LoadingButton
        type="submit"
        variant="contained"
        fullWidth
        loading={mutation.isPending}
        loadingText="Creating Menu"
        sx={{ mt: 4 }}
      >
        Create Menu
      </LoadingButton>
    </form>
  );
}