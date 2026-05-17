import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {RootState} from "../store.ts";

interface AlertDialogModalPayload {
    title: string | undefined;
    content: string | undefined;
    actionBtn: string | undefined;
}

interface EventDialogModalPayload {
    focusedEventId: number | undefined;
    focusedEventsOrganizersEmail: string | undefined;
}

interface modalsState {
    isDialogModalOpen: boolean;
    isEventModalOpen: boolean; // event-details modal
    isAlertDialogModalOpen: boolean;
    dialogModalTitle: string | undefined;
    dialogModalContent: string | undefined;
    dialogModalActionBtn: string | undefined;
    focusedEventId: number | undefined;
    focusedEventsOrganizersEmail: string | undefined;
}

const initialState: modalsState = {
    isDialogModalOpen: false,
    isEventModalOpen: false,
    isAlertDialogModalOpen: false,
    dialogModalContent: undefined,
    dialogModalTitle: undefined,
    dialogModalActionBtn: undefined,
    focusedEventId: undefined,
    focusedEventsOrganizersEmail: undefined,
};

const modalsSlice = createSlice({
    name: 'modals',
    initialState,
    reducers: {
        toggleDialogModal: (state) => {
            state.isDialogModalOpen = !state.isDialogModalOpen;
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
        },
    }
});

// exporting generated action creators
export const {
    toggleDialogModal,
    toggleEventModal,
    toggleAlertDialogModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;

// selectors
export const selectFocusedEventId = (state: RootState) => state.modals.focusedEventId;
export const selectIsEventModalOpen = (state: RootState) => state.modals.isEventModalOpen;
export const selectIsDialogModalOpen = (state: RootState) => state.modals.isDialogModalOpen;
export const selectIsAlertDialogModalOpen = (state: RootState) => state.modals.isAlertDialogModalOpen;
export const selectAlertDialogModalTitle = (state: RootState) => state.modals.dialogModalTitle;
export const selectAlertDialogModalContent = (state: RootState) => state.modals.dialogModalContent;
export const selectAlertDialogModalActionBtn = (state: RootState) => state.modals.dialogModalActionBtn;
// compares modals.focusedEventsOrganizersEmail with auth.email to return if the current user is organizer of the event or not !!!!
export const selectIsOrganizer = (state: RootState) => state.auth.email && state.modals.focusedEventsOrganizersEmail && state.auth.email === state.modals.focusedEventsOrganizersEmail;