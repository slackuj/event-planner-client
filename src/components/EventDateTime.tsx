import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {useState} from "react";
import {useAppSelector} from "../hooks/storeHooks.ts";
import {selectFocusedEventId, selectIsOrganizer} from "../store/slices/modalsSlice.ts";
import {useUpdateEventMutation} from "../features/events/eventsSlice.ts";
import type {ApiErrorResponse} from "../types/response.ts";
import {toast} from "react-toastify";

interface DateTimeProps {
    event_date: number; // timestamp
}
export const EventDateTime= (props: DateTimeProps) => {
    const {event_date} = props;
    const [value, setValue] = useState<Dayjs | null>(dayjs(event_date));
    const focusedEventId = useAppSelector(selectFocusedEventId);
    const [ updateEventDate ] = useUpdateEventMutation();
    const isOrganizer = useAppSelector(selectIsOrganizer);
    const isDisabled = !isOrganizer || new Date(event_date).getTime() < Date.now();

    const handleDateUpdate = async() => {
        if (value && value !== dayjs(event_date)) {
            try {
                const data = {event_date: value.valueOf()};
                await updateEventDate({id: focusedEventId!, data}).unwrap();
                toast.success("Event DateTime updated!");
            } catch(error){
                console.error(error);
                toast.error(((error as any).data as ApiErrorResponse).message);
            }
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    label="Event DateTime"
                    value={value}
                    disablePast={true}
                    disabled={isDisabled}
                    onChange={(newValue) => setValue(newValue)}
                    onAccept={handleDateUpdate}
                />
        </LocalizationProvider>
    );
}
