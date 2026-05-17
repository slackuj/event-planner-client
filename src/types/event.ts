export type RSVP = "YES" | "NO" | "MAYBE" | "WAITING";

export interface Event {
    id: number;
    title: string;
    description: string;
    event_date: number; // timestamp
    location_id: number | null;
    organizer_id: number;
    is_public: boolean;
    updated_at?: Date;
}

export interface EventsMetadata {
    totalEvents: number;
    totalPages: number;
    page: number;
    limit: number;
}

export interface ParticipationMetadata {
    totalParticipation: number;
    totalPages: number;
    page: number;
    limit: number;
}

export interface EventWithLocationAndOrganizer {
    id: number;
    title: string;
    description: string;
    event_date: number; // timestamp
    location_name: string | null;
    organizer_email: string;
    organizer_profile_picture: string;
    is_public: boolean;
}

export interface AllEventsResponse {
    id: number;
    title: string;
    event_date: number; // timestamp
    is_public: boolean;
    organizer_email: string;
    organizer_profile_picture: string;
    rsvp?: RSVP;
}

// service data
export interface CreateEventData extends Omit<Event, 'id' | 'location_id'> {
    location_name: string | null;
}

// client request
export interface CreateEventRequestForm {
    location_name: string | null;
    title: string;
    description: string;
    event_date: string;
    is_public: boolean;
}

export interface CreateEventRequest {
    location_name: string | null;
    title: string;
    description: string;
    event_date: number;
    is_public: boolean;
}

export type UpdateEventRequest = Partial<Omit<CreateEventRequest, 'location_name'>>;
export interface UpdateEventLocationRequest {
    location_name: string;
}


export interface EventParticipant {
    id: number;
    event_id: number;
    user_id: number;
    rsvp: RSVP;
}

export interface EventParticipationResponse {
    id: number;
    event_id: number;
    user_id: number;
    user_email: string;
    user_profile_picture: string;
    rsvp: RSVP;
}

export interface LocationTag {
    id: number;
    name: string;
    slug: string;
    updated_at?: Date;
}

export interface UserLocationTag {
    id: number;
    user_id: number;
    tag_id: number;
    updated_at?: Date;
}

export type CreateLocationTagRequest = Omit<LocationTag, 'id' | 'slug'>;
export type CreateUserLocationTagRequest = Omit<UserLocationTag, 'id'>;

export interface EventTag {
    id: number;
    name: string;
    slug: string;
    updated_at?: Date;
}

export interface EventTagResponse {
    id: number; // user_event_tags.id
    name: string;
    event_id: number;
    user_id: number; // used to distinguish organizers/users tag !!!
}

export interface UserEventTag{
    id: number;
    user_id: number;// organizer or participator
    event_id: number;
    tag_id: number;
    updated_at?: Date;
}

export interface CreateEventTagRequest {
    tag_name: string;
}
export interface CreateUserEventTagRequest extends Omit<UserEventTag, 'id' | 'tag_id'>{
    tag_name: string;
    organizer_id: number;
}
export type CreateUserEventTagData = Omit<UserEventTag, 'id'>;