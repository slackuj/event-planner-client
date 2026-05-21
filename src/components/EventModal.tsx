import React, {useEffect } from 'react';
import {createPortal} from 'react-dom';
import './EventModal.css';
import {useAppDispatch, useAppSelector} from "../hooks/storeHooks.ts";
import {
    selectFocusedEventId, selectIsDeletingEvent, selectIsEventModalOpen,
    selectIsOrganizer, toggleAlertDialogModal,
    toggleEventModal
} from "../store/slices/modalsSlice.ts";
import {useDeleteEventMutation, useGetEventQuery, useUpdateEventMutation} from "../features/events/eventsSlice.ts";
import {Participants} from "./EventParticipation.tsx";
import {CircularProgress} from "@mui/material";
import type {ApiErrorResponse} from "../types/response.ts";
import {toast} from "react-toastify";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from "@mui/material/Tooltip";
import {Tags} from "./EventTags.tsx";
import {EventDateTime} from "./EventDateTime.tsx";
import {EventLocation} from "./EventLocation.tsx";
import {EventRSVP} from "./rsvp.tsx";
import {AlertDialogModal} from "./AlertDialogModal.tsx";
import {REMOVE_EVENT_DIALOG_MODAL} from "../constants/appConstants.ts";

export const EventModal = () => {

    const dispatch = useAppDispatch();
    const isOrganizer = useAppSelector(selectIsOrganizer);

    // Close modal on 'Escape' key press
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                dispatch(toggleEventModal({focusedEventId: undefined, focusedEventsOrganizersEmail: undefined}));
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const isOpen = useAppSelector(selectIsEventModalOpen);
    const isDeletingEvent = useAppSelector(selectIsDeletingEvent);
    const focusedEventId = useAppSelector(selectFocusedEventId);
    const [ updateEvent ] = useUpdateEventMutation();
    const [ deleteEvent ] = useDeleteEventMutation();

    const {
        data: focusedEvent,
        isLoading: isLoadingEvent,
        isError: isErrorFetchingEvent,
        error
    } = useGetEventQuery(focusedEventId!, { skip: !focusedEventId });

    if (!focusedEvent) {
        return null;
    }

    if (isLoadingEvent) {
        return <div><CircularProgress/></div>;
    }

    if (isErrorFetchingEvent) {
        console.error(error);
        toast.error(((error as any).data as ApiErrorResponse).message);
    }

   // past events are not editable
    const isDisabled = !isOrganizer || (new Date(focusedEvent.event_date).getTime() < Date.now());

    const handleEventTitle = async(e: React.FocusEvent<HTMLHeadingElement>) => {
        const title = e.currentTarget.textContent?.trim();
        if (title && title !== focusedEvent.title) {
            try {
                const data = {title: title};
                await updateEvent({id: focusedEvent.id, data}).unwrap();
                toast.success("Event Title Updated");
            } catch(error){
                console.error(error);
                toast.error(((error as any).data as ApiErrorResponse).message);
            }
        }
    };

    const handleEventDescription = async(e: React.FocusEvent<HTMLTextAreaElement>) => {
        const description = e.currentTarget.value?.trim();
        if (description !== focusedEvent.description) {
            try{
                const data = {description: description};
                await updateEvent({id: focusedEvent.id, data});
                toast.success("Event Description Updated");
            } catch(error){
                console.error(error);
                toast.error(((error as any).data as ApiErrorResponse).message);
            }
        }
    };

    const handleDeletion = async() => {
        try{
            dispatch(toggleEventModal({focusedEventId: undefined, focusedEventsOrganizersEmail: undefined}));
            toast.info("Deleting event");
            await deleteEvent(focusedEvent.id).unwrap();
            toast.success("Event deleted");
        } catch(error){
        console.error(error);
        toast.error(((error as any).data as ApiErrorResponse).message);
    }
    };

    const handleModalClose = () => {
        dispatch(toggleEventModal({focusedEventId: undefined, focusedEventsOrganizersEmail: undefined}));
    }

    if (!isOpen) return null;

    // createPortal takes two argument: (JSX, DOM node)
    // takes JSX and renders it inside the DOM node
    return createPortal(
        <div className="modal-overlay">
            <div className="event-details">
                <div className="details-header">
                    <h2
                        className="details-header"
                        contentEditable={!isDisabled}
                        suppressContentEditableWarning={true}
                        onBlur={handleEventTitle}
                    >{focusedEvent.title}</h2>
                </div>
                <div className="event-rsvp">
                   <EventRSVP event_date={focusedEvent.event_date}/>
                </div>
                <div className="event-location">
                    <EventLocation location_name={focusedEvent.location_name} event_date={focusedEvent.event_date} />
                </div>
                <div className="event-dueDate">
                    <EventDateTime key={focusedEvent.id} event_date={focusedEvent.event_date} />
                </div>
                <div className="event-participants">
                    <Participants  event_date={focusedEvent.event_date}/>
                </div>
                <div className="event-description">
                    {
                        !isDisabled
                            ?
                            <textarea
                                key={focusedEvent.id}
                                rows={5} cols={33}
                                placeholder="Add description"
                                onBlur={handleEventDescription}
                                autoCorrect="on"
                                autoComplete="on"
                                defaultValue={focusedEvent.description}
                            />
                            :
                            <span>{focusedEvent.description}</span>
                    }
                </div>
                <div className="event-tags">
                    <Tags />
                </div>
                <div className="modal-footer">
                    <ExitToAppIcon
                        className="hide-modal-btn"
                        onClick={handleModalClose}
                    />
                    { isOrganizer && <Tooltip title="Delete Event">
                    <DeleteIcon
                        className="delete-btn"
                        onClick={() => dispatch(toggleAlertDialogModal(REMOVE_EVENT_DIALOG_MODAL))}
                    />
                    </Tooltip>}
                </div>
            </div>
            {!!isDeletingEvent && <AlertDialogModal onConfirm={handleDeletion} />}
        </div>,
        document.getElementById('event-modal') as HTMLElement
    );
};