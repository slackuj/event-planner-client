export interface EventTagsQueryParams {
    fetchEventOrganizersTags: boolean; // tags for event set by organizer
}

export interface AllEventsQueryParams {
    page: number;
    isParticipating: boolean;
    isPublic: boolean | undefined;
    isRequested: boolean; // for event requests ---> rsvp === 'AWAITING', requested and not responded yet
    isOrganized: boolean;
    start_date: number; // timestamp
    end_date: number; // timestamp
    sort_order: "asc" | "desc";
}

export interface ParticipationQueryParams {
    page: number;
}