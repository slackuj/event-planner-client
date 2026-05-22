import { z } from "zod";

/**
 * Schema for creating a new event
 */

export const CreateEventRequestSchema = z.object({
    title: z.string()
        .min(5, "Title must be at least 5 characters long")
        .max(255, "Title is too long"),
    description: z.string()
        .min(10, "Description must be at least 10 characters long")
        .max(1000, "Description is too long"),
    event_date: z.string(),
    is_public: z.boolean(),
    location_name: z.string().nullable().optional(),
}).superRefine((data, ctx) => {
    const val = data.location_name;

    // Check if location_name exists and contains actual text (ignoring whitespace)
    if (val !== null && val !== undefined && val.trim() !== "") {
        if (val.length < 5) {
            ctx.addIssue({
                code: "custom",
                message: "Location must be at least 5 characters long",
                path: ["location_name"],
            });
        }
        if (val.length > 255) {
            ctx.addIssue({
                code: "custom",
                message: "Location is too long",
                path: ["location_name"],
            });
        }
    }
});


/**
 * Schema for updating an event's location specifically
 */
export const UpdateEventLocationRequestSchema = z.object({
    location_name: z.string()
        .min(5, "Location must be at least 5 characters long")
        .max(255, "Location is too long")
});

/**
 * Schema for adding a tag to an event
 */
export const AddEventTagRequestSchema = z.object({
    tag_name: z.string()
        .min(2, "Tag name must be at least 2 characters long")
        .max(30, "Tag name is too long"),
    organizer_id: z.coerce.number(),
});

export const DeleteEventTagRequestSchema = z.object({
    tag_name: z.string()
        .min(2, "Tag name must be at least 2 characters long")
        .max(30, "Tag name is too long"),
})

/**
 * Schema for event participation/RSVP
 */
export const EventParticipationRequestSchema = z.object({
    rsvp: z.enum(["AWAITING", "YES", "NO", "MAYBE"],"Please select a valid RSVP status" ),
});

export const EventIdAndUserIdParamsSchema = z.object({
    event_id: z.coerce.number( "event_id type mismatch"),
    user_id: z.coerce.number("user_id type mismatch"),
});

export const EventIdParamsSchema = z.object({
    event_id: z.coerce.number("event_id type mismatch"),
});

export const UserIdParamsSchema = z.object({
    user_id: z.coerce.number("user_id type mismatch"),
});

export const OrganizerIdParamsSchema = z.object({
    organizer_id: z.coerce.number("organizer_id type mismatch"),
});

/**
 * Schema for filtering events via query parameters
 */
export const AllEventsQueryParamsSchema = z.object({
    isParticipating: z.boolean(),
    isPublic: z.boolean(),
    isRequested: z.boolean(),
    isOrganized: z.boolean(),
});

export const EventTagsQueryParamsSchema = z.object({
    fetchEventOrganizersTags: z.boolean(),
})