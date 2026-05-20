import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {RootState} from "../store.ts";

interface AlertDialogModalPayload {
    title: string | undefined;
    content: string | undefined;
    actionBtn: string | undefined;
    isDeletingParticipant: boolean| undefined;
    isDeletingEvent: boolean | undefined;
    isDeletingProfilePicture: boolean | undefined;
}

interface EventDialogModalPayload {
    focusedEventId: number | undefined;
    focusedEventsOrganizersEmail: string | undefined;
}

interface modalsState {
    isDialogModalOpen: boolean;
    isEventModalOpen: boolean; // event-details modal
    isAlertDialogModalOpen: boolean;
    isEditUserModalOpen: boolean;
    isUpdatePasswordModalOpen: boolean;
    dialogModalTitle: string | undefined;
    dialogModalContent: string | undefined;
    dialogModalActionBtn: string | undefined;
    focusedEventId: number | undefined;
    focusedEventsOrganizersEmail: string | undefined;
    isDeletingParticipant: boolean | undefined;
    isDeletingEvent: boolean | undefined;
    isDeletingProfilePicture: boolean | undefined;
}

const initialState: modalsState = {
    isDialogModalOpen: false,
    isEventModalOpen: false,
    isAlertDialogModalOpen: false,
    isEditUserModalOpen: false,
    isUpdatePasswordModalOpen: false,
    dialogModalContent: undefined,
    dialogModalTitle: undefined,
    dialogModalActionBtn: undefined,
    focusedEventId: undefined,
    focusedEventsOrganizersEmail: undefined,
    isDeletingParticipant: undefined,
    isDeletingEvent: undefined,
    isDeletingProfilePicture: undefined,
};

const modalsSlice = createSlice({
    name: 'modals',
    initialState,
    reducers: {
        toggleDialogModal: (state) => {
            state.isDialogModalOpen = !state.isDialogModalOpen;
        },
        toggleEditUserModal: (state) => {
            state.isEditUserModalOpen = !state.isEditUserModalOpen;
        },
        toggleUpdatePasswordModal: (state) => {
            state.isUpdatePasswordModalOpen = !state.isUpdatePasswordModalOpen;
        },
        toggleEventModal: (state, action: PayloadAction<EventDialogModalPayload>) => {
            //state.isEventModalOpen = !state.isEventModalOpen;
            state.isEventModalOpen = !!action.payload.focusedEventId; // should work for dynamically switching events !!!!!
            state.focusedEventId = action.payload.focusedEventId;
            state.focusedEventsOrganizersEmail = action.payload.focusedEventsOrganizersEmail;
        },
        toggleAlertDialogModal: (state, action: PayloadAction<AlertDialogModalPayload>) => {
            state.dialogModalTitle = action.payload.title;
            state.dialogModalContent = action.payload.content;
            state.dialogModalActionBtn = action.payload.actionBtn;
            state.isAlertDialogModalOpen = !state.isAlertDialogModalOpen;
            state.isDeletingParticipant = action.payload.isDeletingParticipant;
            state.isDeletingEvent = action.payload.isDeletingEvent;
            state.isDeletingProfilePicture = action.payload.isDeletingProfilePicture;
        },
    }
});

// exporting generated action creators
export const {
    toggleDialogModal,
    toggleEditUserModal,
    toggleUpdatePasswordModal,
    toggleEventModal,
    toggleAlertDialogModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;

// selectors
export const selectFocusedEventId = (state: RootState) => state.modals.focusedEventId;
export const selectIsEventModalOpen = (state: RootState) => state.modals.isEventModalOpen;
export const selectIsEditUserModalOpen = (state: RootState) => state.modals.isEditUserModalOpen;
export const selectIsUpdatePasswordModalOpen = (state: RootState) => state.modals.isUpdatePasswordModalOpen;
export const selectIsDialogModalOpen = (state: RootState) => state.modals.isDialogModalOpen;
export const selectIsAlertDialogModalOpen = (state: RootState) => state.modals.isAlertDialogModalOpen;
export const selectAlertDialogModalTitle = (state: RootState) => state.modals.dialogModalTitle;
export const selectAlertDialogModalContent = (state: RootState) => state.modals.dialogModalContent;
export const selectAlertDialogModalActionBtn = (state: RootState) => state.modals.dialogModalActionBtn;
export const selectFocusedEventsOrganizersEmail = (state: RootState) => state.modals.focusedEventsOrganizersEmail;
export const selectIsDeletingParticipant = (state: RootState) => state.modals.isDeletingParticipant;
export const selectIsDeletingEvent = (state: RootState) => state.modals.isDeletingEvent;
export const selectIsDeletingProfilePicture = (state: RootState) => state.modals.isDeletingProfilePicture;
// compares modals.focusedEventsOrganizersEmail with auth.email to return if the current user is organizer of the event or not !!!!
export const selectIsOrganizer = (state: RootState) => !!state.auth.email && !!state.modals.focusedEventsOrganizersEmail && state.auth.email === state.modals.focusedEventsOrganizersEmail;