import {useAppSelector} from "../hooks/storeHooks.ts";
import {selectFocusedEventId, selectIsOrganizer} from "../store/slices/modalsSlice.ts";
import {useDeleteEventLocationMutation, useUpdateEventLocationMutation} from "../features/events/eventsSlice.ts";
import type {ApiErrorResponse} from "../types/response.ts";
import {toast} from "react-toastify";
import {type ChangeEvent, type ReactNode, useState} from "react";
import {CircularProgress, Tooltip} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import "./EventLocation.css";
import LocationPinIcon from '@mui/icons-material/LocationPin';

interface EventLocationProps {
    location_name: string | null;
    event_date: number;
}
export const EventLocation= (props: EventLocationProps) => {
    const {location_name, event_date} = props;
    const [location, setLocation] = useState("");
    const focusedEventId = useAppSelector(selectFocusedEventId);
    const [ updateEventLocation, {isLoading} ] = useUpdateEventLocationMutation();
    const [ deleteEventLocation, {isLoading: isDeleting} ] = useDeleteEventLocationMutation();
    const isOrganizer = useAppSelector(selectIsOrganizer);
    const isDisabled = !isOrganizer || new Date(event_date).getTime() < Date.now();

    const handleLocation = (e: ChangeEvent<HTMLInputElement>) => (setLocation(e.target.value));
    const handleLocationUpdate = async() => {
            try {
                const data = {location_name: location};
                await updateEventLocation({event_id: focusedEventId!, data}).unwrap();
                setLocation("");
                toast.success("Event location updated!");
            } catch(error){
                setLocation("");
                console.error(error);
                toast.error(((error as any).data as ApiErrorResponse).message);
            }
    };

    const handleDeletion = async() => {
        try {
            await deleteEventLocation(focusedEventId!);
        } catch(error){
            console.error(error);
            toast.error(((error as any).data as ApiErrorResponse).message);
        }
    };

let updateBtn: ReactNode;
    if (location.trim() !== "") {
        updateBtn = (
            <button
                className="updateLocationButton"
                style={{ color: '#2564cf' }}
                onClick={handleLocationUpdate}
            >
                {isLoading ? <CircularProgress size={16} /> : "Update"}
            </button>
        );
    }

    return (
        <div className="location-container">
            <div className="locationAdder-container">
                {
                    (location_name === null)
                        ?
                        <>
                            { !isDisabled && (
                                <>
                                    <AddIcon className="add-location-icon" />
                                    <input
                                        className="location-input"
                                        type="text"
                                        placeholder="Add location"
                                        value={location}
                                        onChange={handleLocation}
                                        onKeyDown={(e) => e.key === 'Enter' && handleLocationUpdate()}
                                    />
                                    {updateBtn}
                                </>
                            )}
                        </>
                        :
                        <>
                            <span className="location-name">
                        <LocationPinIcon />
                                {location_name}
                    </span>

                            {!isDisabled && (
                                <Tooltip title="Remove location">
                                    { isDeleting ? <CircularProgress size={16}/> :
                                        <CloseIcon
                                            className="delete-location-btn"
                                            onClick={handleDeletion}
                                        />
                                    }
                                </Tooltip>
                            )}
                        </>
                }
            </div>
        </div>
    );
};
