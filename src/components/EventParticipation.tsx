// DISPLAYS PARTICIPANTS AND PARTICIPANT-ADDER --- USED BY ORGANIZER

import { type ChangeEvent, type ReactNode, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import type { EventParticipationResponse as Participant } from "../types/event";
import './EventParticipation.css';
import {
    selectAllEventParticipation,
    useAddEventParticipationMutation,
    useDeleteEventParticipationMutation,
    useGetAllEventParticipationQuery
} from "../features/events/eventsSlice.ts";
import { selectFocusedEventId, selectIsOrganizer, toggleAlertDialogModal } from "../store/slices/modalsSlice.ts";
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks.ts";
import { REMOVE_PARTICIPANT_DIALOG_MODAL, RSVP } from "../constants/appConstants.ts";
import { toast } from "react-toastify";
import type { ApiErrorResponse } from "../types/response.ts";
import { Avatar, CircularProgress, Tooltip, Badge } from "@mui/material";
import { AlertDialogModal } from "./AlertDialogModal.tsx";

const ParticipantsAdder = () => {
    const [participantEmail, setParticipantEmail] = useState("");
    const [addNewParticipant, { isLoading }] = useAddEventParticipationMutation();
    const focusedEventId = useAppSelector(selectFocusedEventId);
    if (!focusedEventId) return null;

    const handleParticipantEmail = (e: ChangeEvent<HTMLInputElement>) => (setParticipantEmail(e.target.value));
    const handleAddNewParticipant = async () => {
        try {
            await addNewParticipant({ event_id: focusedEventId, rsvp: RSVP.AWAITING, email: participantEmail }).unwrap();
            setParticipantEmail("");
        } catch (err) {
            setParticipantEmail("");
            console.error(err);
            toast.error(((err as any).data as ApiErrorResponse).message);
        }
    };

    let addBtn: ReactNode;
    if (participantEmail.trim() !== "") {
        addBtn = (
            <button
                className="addParticipantButton"
                style={{ color: '#2564cf' }}
                onClick={handleAddNewParticipant}
            >
                {isLoading ? <CircularProgress size={16} /> : "Add"}
            </button>
        );
    }

    return (
        <div className="participantAdder-container">
            <div className="participantEmail-container">
                <AddIcon className="add-participant-icon" />
                <input
                    className="participant-email-input"
                    type="text"
                    placeholder="Add participant"
                    value={participantEmail}
                    onChange={handleParticipantEmail}
                />
                {addBtn}
            </div>
        </div>
    );
};

interface ParticipantProps {
    participant: Participant;
    setFocusedParticipantId: (participantId: number | undefined) => void;
}

const Participant = ({ participant, setFocusedParticipantId }: ParticipantProps) => {
    const dispatch = useAppDispatch();
    const isOrganizer = useAppSelector(selectIsOrganizer);

    // status badge icon to render at the base of the avatar
    const renderRSVPBadge = (rsvpStatus: typeof participant.rsvp) => {
        switch (rsvpStatus) {
            case "YES":
                return <CheckCircleIcon className="rsvp-badge-icon yes" />;
            case "NO":
                return <CancelIcon className="rsvp-badge-icon no" />;
            case "MAYBE":
                return <HelpIcon className="rsvp-badge-icon maybe" />;
            case "AWAITING":
            default:
                return <AccessTimeFilledIcon className="rsvp-badge-icon awaiting" />;
        }
    };

    return (
        <div className="participantEmail-container">
            <span className="participant-avatar">
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={renderRSVPBadge(participant.rsvp)}
                >
                    <Avatar alt="" src={participant.user_profile_picture} sx={{ width: 32, height: 32 }} />
                </Badge>
                <span className="participant-email-text">{participant.user_email}</span>
            </span>
            {isOrganizer && (
                <Tooltip title="Remove participant">
                    <CloseIcon
                        className="delete-participant-btn"
                        onClick={() => {
                            setFocusedParticipantId(participant.user_id);
                            dispatch(toggleAlertDialogModal(REMOVE_PARTICIPANT_DIALOG_MODAL));
                        }}
                    />
                </Tooltip>
            )}
        </div>
    );
};

export const Participants = () => {
    const isOrganizer = useAppSelector(selectIsOrganizer);
    const focusedEventId = useAppSelector(selectFocusedEventId);
    const [focusedParticipantId, setFocusedParticipantId] = useState<number | undefined>(undefined);
    const [deleteParticipation] = useDeleteEventParticipationMutation();

    const params = { page: 1 };
    const {
        isLoading,
        isError,
        error
    } = useGetAllEventParticipationQuery({ event_id: focusedEventId!, params }, { skip: !focusedEventId });

    const participation = useAppSelector(selectAllEventParticipation(focusedEventId!, params));

    if (!focusedEventId) return null;
    if (isLoading) return <div className="loading-container"><CircularProgress /></div>;
    if (isError) {
        console.error(error);
        toast.error(((error as any).data as ApiErrorResponse).message);
        return <div>Error Loading Participants...</div>;
    }

    const handleDeletion = async () => {
        try {
            await deleteParticipation({ event_id: focusedEventId, user_id: focusedParticipantId! }).unwrap();
        } catch (err) {
            console.error(err);
            toast.error(((err as any).data as ApiErrorResponse).message);
        }
    };

    // Generate Summary calculations for the entire collection
    // SHOULD BE FETCHED FROM BACKEND IN ParticipationResponse !!!!
    const totalGuests = participation?.length || 0;
    const rsvpSummary = (participation || []).reduce(
        (acc, item) => {
            if (item.rsvp === "YES") acc.yes++;
            else if (item.rsvp === "NO") acc.no++;
            else if (item.rsvp === "MAYBE") acc.maybe++;
            else acc.awaiting++;
            return acc;
        },
        { yes: 0, no: 0, maybe: 0, awaiting: 0 }
    );

    // Format sub-text summaries dynamically based on actual statuses present
    const summaryDetails = [];
    if (rsvpSummary.yes > 0) summaryDetails.push(`${rsvpSummary.yes} yes`);
    if (rsvpSummary.maybe > 0) summaryDetails.push(`${rsvpSummary.maybe} maybe`);
    if (rsvpSummary.no > 0) summaryDetails.push(`${rsvpSummary.no} no`);
    if (rsvpSummary.awaiting > 0) summaryDetails.push(`${rsvpSummary.awaiting} awaiting`);

    const participants = participation?.map((participant) => (
        <Participant key={participant.id} participant={participant} setFocusedParticipantId={setFocusedParticipantId} />
    ));

    return (
        <div className="participants-container">
            {/* Summary Block */}
            {totalGuests > 0 && (
                <div className="participants-summary">
                    <div className="summary-total">{totalGuests}{totalGuests > 1 ? " guests" : " guest"}</div>
                    <div className="summary-breakdown">{summaryDetails.join(', ')}</div>
                </div>
            )}

            {isOrganizer && <ParticipantsAdder />}
            <div className="participants-list">
                {participants}
            </div>
            <AlertDialogModal onConfirm={handleDeletion} />
        </div>
    );
};