export const REMOVE_PARTICIPANT_DIALOG_MODAL = {
    title: "Remove Participant",
    content: "You won't be able to undo this action",
    actionBtn: "Remove",
    isDeletingParticipant: true,
    isDeletingEvent: undefined,
    isDeletingProfilePicture: undefined,
};

export const REMOVE_EVENT_DIALOG_MODAL = {
    title: "Delete Event",
    content: "You won't be able to undo this action",
    actionBtn: "Delete",
    isDeletingParticipant: undefined,
    isDeletingEvent: true,
    isDeletingProfilePicture: undefined,
};

export const REMOVE_PROFILE_PICTURE_DIALOG_MODAL = {
    title: "Remove Profile Picture",
    content: "You are about to remove your profile picture.",
    actionBtn: "Remove",
    isDeletingParticipant: undefined,
    isDeletingEvent: undefined,
    isDeletingProfilePicture: true,
};

export const REINITIALIZE_DIALOG_MODAL = {
    title: undefined,
    content: undefined,
    actionBtn: undefined,
    isDeletingParticipant: undefined,
    isDeletingEvent: undefined,
    isDeletingProfilePicture: undefined,
};

export const RSVP = {
    AWAITING: "AWAITING",
    MAYBE: "MAYBE",
    YES: "YES",
    NO: "NO",
} as const;

const currentYear = new Date().getFullYear();

// Jan 1 of current year at local 00:00:00
export const DEFAULT_START_DATE = new Date(Date.UTC(currentYear, 0, 1, 0, 0, 0, 0)).getTime();

// Dec 31 of current year at local 23:59:59
export const DEFAULT_END_DATE = new Date(currentYear, 11, 31, 23, 59, 59, 999).getTime();

// 1. Get the current calendar digits from the local machine
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth(); // 0-indexed
const day = now.getDate();

// 2. Lock them into strict UTC timestamps for your API payload
export const TODAY_START_UTC = Date.UTC(year, month, day, 0, 0, 0, 0);
export const TODAY_END_UTC = Date.UTC(year, month, day, 23, 59, 59, 999);


export const myDayEventsQueryParams = {
    page: 1,
    isParticipating: true,
    isPublic: undefined,
    isOrganized: false,
    isRequested: false,
    start_date: TODAY_START_UTC,
    end_date: TODAY_END_UTC,
    sort_order: "desc" as const,
};

export const myParticipatingEventsQueryParams = {
    page: 1,
    isParticipating: true,
    isPublic: undefined,
    isOrganized: false,
    isRequested: false,
    start_date: DEFAULT_START_DATE,
    end_date: DEFAULT_END_DATE,
    sort_order: "desc" as const,
};

export const myOrganizingEventsQueryParams = {
    page: 1,
    isParticipating: false,
    isPublic: undefined,
    isOrganized: true,
    isRequested: false,
    start_date: DEFAULT_START_DATE,
    end_date: DEFAULT_END_DATE,
    sort_order: "desc" as const,
};

export const myEventsRequestsQueryParams = {
    page: 1,
    isParticipating: true,
    isPublic: undefined,
    isOrganized: false,
    isRequested: true,
    start_date: DEFAULT_START_DATE,
    end_date: DEFAULT_END_DATE,
    sort_order: "desc" as const,
};

export const allEventsQueryParams = {
    page: 1,
    isParticipating: false,
    isPublic: true,
    isOrganized: false,
    isRequested: false,
    start_date: DEFAULT_START_DATE,
    end_date: DEFAULT_END_DATE,
    sort_order: "desc" as const,
};