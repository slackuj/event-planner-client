export const DEFAULT_PROFILE_IMAGE = "https://res.cloudinary.com/dlfeusct3/image/upload/v1777224484/user_ke5fj7.jpg";

export const REMOVE_PARTICIPANT_DIALOG_MODAL = {
    title: "Remove Participant",
    content: "You won't be able to undo this action",
    actionBtn: "Remove",
};

export const RSVP = {
    AWAITING: "AWAITING",
    MAYBE: "MAYBE",
    YES: "YES",
    NO: "NO",
} as const;

const currentYear = new Date().getFullYear();

// Jan 1 of current year at local 00:00:00
export const DEFAULT_START_DATE = new Date(currentYear, 0, 1, 0, 0, 0, 0).getTime();

// Dec 31 of current year at local 23:59:59
export const DEFAULT_END_DATE = new Date(currentYear, 11, 31, 23, 59, 59, 999).getTime();