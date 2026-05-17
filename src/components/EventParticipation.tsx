// DISPLAYS PARTICIPANTS AND PARTICIPANT-ADDER --- USED BY ORGANIZER

import {type ChangeEvent, type ReactNode, useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import type {EventParticipationResponse as Participant} from "../types/event";
import './EventParticipation.css';
import {
    selectAllEventParticipation,
    useAddEventParticipationMutation,
    useDeleteEventParticipationMutation,
    useGetAllEventParticipationQuery
} from "../features/events/eventsSlice.ts";
import {selectFocusedEventId, selectIsOrganizer, toggleAlertDialogModal} from "../store/slices/modalsSlice.ts";
import {useAppDispatch, useAppSelector} from "../hooks/storeHooks.ts";
import {REMOVE_PARTICIPANT_DIALOG_MODAL, RSVP} from "../constants/appConstants.ts";
import { toast } from "react-toastify";
import type {ApiErrorResponse} from "../types/response.ts";
import {Avatar, CircularProgress, Tooltip} from "@mui/material";
import {AlertDialogModal} from "./AlertDialogModal.tsx";

const ParticipantsAdder = () => {
    const [participantEmail, setParticipantEmail] = useState("");
    const [addNewParticipant, { isLoading } ] = useAddEventParticipationMutation();
    const focusedEventId = useAppSelector(selectFocusedEventId);
    if (!focusedEventId) return null;

    const handleParticipantEmail = (e: ChangeEvent<HTMLInputElement>) => ( setParticipantEmail(e.target.value));
    const handleAddNewParticipant = async () => {
        try{
        await addNewParticipant({event_id: focusedEventId, rsvp: RSVP.AWAITING, email: participantEmail}).unwrap();
        setParticipantEmail("");
        } catch(err){
            setParticipantEmail("");
            console.error(err);
            //console.log(err);
            toast.error(((err as any).data as ApiErrorResponse).message);
        }
    };

    let addBtn: ReactNode;
    // addBtn should be displayed if participantEmail === valid_email, can i use zod schema here?
    if (participantEmail.trim() !== "") {
        addBtn = (
            <button
                className="addParticipantButton"
                style={{ color: '#2564cf'}}
                onClick={handleAddNewParticipant}
            >
                {isLoading ? <CircularProgress/> : "Add"}
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
                    placeholder= "Add participant"
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
    setFocusedParticipantId: (participantId: number | undefined) => void; // participantId === participant.user_id
}
const Participant = ({participant, setFocusedParticipantId}: ParticipantProps) => {

    const dispatch = useAppDispatch();
    const isOrganizer = useAppSelector(selectIsOrganizer);



    return (
        <div className="participantEmail-container">
            <span className="participant-avatar"><Avatar alt="" src={participant.user_profile_picture} /> {participant.user_email}</span>
            { isOrganizer && <Tooltip title="Remove participant">
                <CloseIcon
                    className="delete-participant-btn"
                    onClick={() => {
                        setFocusedParticipantId(participant.user_id);
                        dispatch(toggleAlertDialogModal(REMOVE_PARTICIPANT_DIALOG_MODAL));
                }}
                />
            </Tooltip>}
        </div>
    );
};

export const Participants = () => {

    const isOrganizer = useAppSelector(selectIsOrganizer);
    const focusedEventId = useAppSelector(selectFocusedEventId);
    const [focusedParticipantId, setFocusedParticipantId] = useState<number|undefined>(undefined); // participantId === participant.user_id
    const [ deleteParticipation ] = useDeleteEventParticipationMutation();

    const params = { page: 1};
    const {
        isLoading,
        isError,
        error
    } = useGetAllEventParticipationQuery({ event_id: focusedEventId!, params }, {skip: !focusedEventId});

    const participation = useAppSelector(selectAllEventParticipation(focusedEventId!, params));

    if (!focusedEventId) return null;
    if (isLoading) return <div><CircularProgress/></div>;
    if (isError) {
        console.error(error);
        toast.error(((error as any).data as ApiErrorResponse).message);
        return <div>Error Loading Participants...</div>;

    }

    const handleDeletion = async() => {
        try{
            await deleteParticipation({ event_id: focusedEventId, user_id: focusedParticipantId! }).unwrap();
        } catch(err){
            console.error(err);
            toast.error(((err as any).data as ApiErrorResponse).message);
        }
    };


    let participants: ReactNode;
    participants = participation?.map((participant) => <Participant key={participant.id} participant={participant} setFocusedParticipantId={setFocusedParticipantId} />);

    return (
        <div className="participants-container">
            { isOrganizer && <ParticipantsAdder />}
            {participants}
            <AlertDialogModal onConfirm={handleDeletion}/>
        </div>

    );
};