import React, {useEffect } from 'react';
import {createPortal} from 'react-dom';
import './EventModal.css';
import {useAppDispatch, useAppSelector} from "../hooks/storeHooks.ts";
import {
    selectFocusedEventId,
    selectIsEventModalOpen,
    selectIsOrganizer,
    toggleEventModal
} from "../store/slices/modalsSlice.ts";
import {useDeleteEventMutation, useGetEventQuery, useUpdateEventMutation} from "../features/events/eventsSlice.ts";
import {LIST_ICON} from "./EventsToolbar.tsx";
import {Participants} from "./EventParticipation.tsx";
import {CircularProgress} from "@mui/material";
import type {ApiErrorResponse} from "../types/response.ts";
import {toast} from "react-toastify";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from "@mui/material/Tooltip";
import {Tags} from "./EventTags.tsx";

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
    const focusedEventId = useAppSelector(selectFocusedEventId);
    const [ updateEvent ] = useUpdateEventMutation();
    const [ deleteEvent ] = useDeleteEventMutation();

    const {
        data: focusedEvent,
        isLoading: isLoadingEvent,
        isError: isErrorFetchingEvent,
        error
    } = useGetEventQuery(focusedEventId!, { skip: !focusedEventId });

    /*const {
        updateEventTitle,
        updateEventNote,
    } = useEventsUpdater();

    const {
        toggleDialogBox,
        closeEventModal: handleCloseModal
    } = useModal();*/

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
    const isEditable = new Date(focusedEvent.event_date).getTime() > Date.now();

    const handleEventTitle = async(e: React.FocusEvent<HTMLHeadingElement>) => {
        const title = e.currentTarget.textContent?.trim();
        if (title && title !== focusedEvent.title) {
            try {
                const data = {title: title};
                await updateEvent({id: focusedEvent.id, data});
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
            } catch(error){
                console.error(error);
                toast.error(((error as any).data as ApiErrorResponse).message);
            }
        }
    };

    const handleDeletion = async() => {
        try{
            dispatch(toggleEventModal({focusedEventId: undefined, focusedEventsOrganizersEmail: undefined}));
            await deleteEvent(focusedEvent.id).unwrap();
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
    //console.log(focusedEvent.participants);
    return createPortal(
        <div className="modal-overlay" /*onClick={handleModalClose}*/>
            <div className="event-details" /*onClick={(e) => e.stopPropagation()}*/>
                {/* event-title */}
                <div className="details-header">
                    <h2
                        className="details-header"
                        contentEditable={isEditable && isOrganizer}
                        suppressContentEditableWarning={true}
                        onBlur={handleEventTitle}
                    >{focusedEvent.title}</h2>
                    <div>{LIST_ICON["Important"]}</div>
                </div>
                <div className="event-participants">
                    <Participants />
                </div>
                <div className="event-dueDate">
                    {/*<ModalDatePicker />*/}
                    {new Date(focusedEvent.event_date).toISOString()}
                </div>
                <div className="event-description">
                    {
                        isOrganizer
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
                        onClick={handleDeletion}
                    />
                    </Tooltip>}
                </div>
            </div>
        </div>,
        document.getElementById('event-modal') as HTMLElement
    );
};