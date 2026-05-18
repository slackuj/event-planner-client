import {Controller, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    CircularProgress,
    FormControlLabel,
    Checkbox
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../hooks/storeHooks.ts";
import { selectIsDialogModalOpen, toggleDialogModal } from "../store/slices/modalsSlice.ts";
import { CreateEventRequestSchema } from "../schemas/eventSchema.ts";
import { useAddEventMutation } from "../features/events/eventsSlice.ts";
import type {CreateEventRequestForm} from "../types/event.ts";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Dayjs} from "dayjs";
import {useState} from "react";

export const AddEventModal = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isDialogBoxOpen = useAppSelector(selectIsDialogModalOpen);

    const [addEvent, { isLoading: isAdding }] = useAddEventMutation();
    const [datetime, setDatetime]  = useState<Dayjs | null>(null);

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        control,
    } = useForm<CreateEventRequestForm>({
        resolver: zodResolver(CreateEventRequestSchema),
        mode: "onBlur",
        defaultValues: {
            location_name: null,
        }
    });

    const handleCancel = () => {
        reset();
        setDatetime(null);
        dispatch(toggleDialogModal());
    };

    const onSubmit = async (values: CreateEventRequestForm) => {
        try {
            // Convert the HTML datetime string into a timestamp number
            //console.log(values);
            const timestamp = Number(values.event_date);
            //console.log(timestamp);

            if (isNaN(timestamp)) {
                toast.error("Please select a valid date and time.");
                return;
            }

            const locationName = values.location_name?.trim() === "" ? null : values.location_name;

            const request = {
                title: values.title,
                description: values.description,
                event_date: timestamp,
                is_public: values.is_public,
                location_name: locationName,
            };

            // 4. Fire the RTK Query Mutation
            await addEvent(request).unwrap();
            reset();
            toast.info("New Event Created!");
            dispatch(toggleDialogModal());
            navigate('/events/my-events', {
               state: { isNewEvent: true },
            });
        } catch (err) {
            reset();
            dispatch(toggleDialogModal());
            console.error("Failed to create the event: ", err);
            toast.error("Failed Creating New Event!");
        }
    };

    return (
        <Dialog
            open={isDialogBoxOpen}
            onClose={handleCancel}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                <Typography variant="h5" component="span" sx={{ fontWeight: "bold" }}>
                    Create New Event
                </Typography>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <TextField
                            label="Event Title"
                            {...register("title")}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            fullWidth
                            disabled={isAdding}
                        />

                        <TextField
                            label="Description"
                            {...register("description")}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            multiline
                            rows={4}
                            fullWidth
                            disabled={isAdding}
                        />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Controller
                                name="event_date"
                                control={control}
                                render={({ field: { onChange} }) => (
                                    <DateTimePicker
                                        label="Event DateTime"
                                        value={datetime}
                                        disablePast={true}
                                        // handel event_date typing later
                                        onChange={(newValue) => {
                                            setDatetime(newValue);
                                            onChange(String(newValue?.valueOf()));
                                        }}
                                        /*onAccept={(newValue) => {
                                            console.log("new datetime:", newValue);
                                        }}*/
                                        disabled={isAdding}
                                        slotProps={{
                                            textField: {
                                                error: !!errors.event_date,
                                                helperText: errors.event_date?.message as string,
                                                fullWidth: true
                                            }
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>

                        <TextField
                            label="Location Name (Optional)"
                            {...register("location_name")}
                            error={!!errors.location_name}
                            helperText={errors.location_name?.message}
                            fullWidth
                            disabled={isAdding}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    {...register("is_public")}
                                    disabled={isAdding}
                                />
                            }
                            label="Make this event public"
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleCancel} color="inherit" disabled={isAdding}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isAdding}
                        startIcon={isAdding ? <CircularProgress size={20} /> : null}
                    >
                        {isAdding ? "Creating..." : "Create Event"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};