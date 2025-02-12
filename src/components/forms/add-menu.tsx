"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useController } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  TextField,
  Typography,
  FormControl,
  FormLabel,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import LoadingButton from "../ui/loading-button";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/toastContext";
import { addMenuFormSchema, TAddMenuFormSchema } from "@/lib/schema";
import { addMenu } from "@/actions/actions.menu";
import { useUser } from "@/context/userContext";

export default function AddMenuForm() {

  const { user } = useUser();

  const { showToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm<TAddMenuFormSchema>({
    resolver: zodResolver(addMenuFormSchema),
    defaultValues: {
      name: "",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

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
    mutation.mutate({ restaurantId: user?.restaurantId as string, data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

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
      </div>

      {/* Schedule */}
      <div className="space-y-4">
        <Typography variant="h6">Schedule</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormControl fullWidth error={!!errors.startDate}>
            <FormLabel>Start Date & Time</FormLabel>
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
              format="EEEE, MMMM d, yyyy 'at' h:mm a"
            />
          </FormControl>

          <FormControl fullWidth error={!!errors.endDate}>
            <FormLabel>End Date & Time</FormLabel>
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
              format="EEEE, MMMM d, yyyy 'at' h:mm a"
            />
          </FormControl>
        </div>
      </div>

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