import { apiSlice } from "../../api/apiSlice.ts";
import { config } from "../../config.ts";
import type { ApiResponse } from "../../types/response.ts";
import type {
    AllEventsResponse,
    CreateEventRequest, CreateEventTagRequest, EventParticipationResponse,
    EventsMetadata, EventTagResponse,
    EventWithLocationAndOrganizer,
    ParticipationResponse, RSVP, UpdateEventLocationRequest, UpdateEventRequest
} from "../../types/event.ts";
import { createEntityAdapter, createSelector, type EntityState } from "@reduxjs/toolkit";
import type {AllEventsQueryParams, EventTagsQueryParams} from "../../types/QueryParams.ts";

const eventsAdapter = createEntityAdapter<AllEventsResponse>();
const eventsTagsAdapter = createEntityAdapter<EventTagResponse>();
const eventsParticipationAdapter = createEntityAdapter<EventParticipationResponse>();

type EventsState = EntityState<AllEventsResponse, number> & EventsMetadata;
//type ParticipationState = EntityState<EventParticipationResponse, number> & ParticipationMetadata;

const initialState = eventsAdapter.getInitialState<EventsMetadata>({
    totalEvents: 0,
    totalPages: 0,
    page: 1,
    limit: 4,
});
const eventsTagsAdaptersInitialState = eventsTagsAdapter.getInitialState();
const eventsParticipationAdaptersInitialState = eventsParticipationAdapter.getInitialState();
/*const eventsParticipationAdaptersInitialState = eventsParticipationAdapter.getInitialState<ParticipationMetadata>({
    totalParticipation: 0,
    totalPages: 0,
    page: 1,
    limit: 4,
});*/

export const eventsSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // fetch all events
        getEvents: builder.query<EventsState, AllEventsQueryParams>({
            query: (params) => ({
                url: config.endpoints.events,
                params: params,
            }),
            keepUnusedDataFor: 900, // 15 minutes
            transformResponse: (response: ApiResponse<AllEventsResponse[]>) => {
                return eventsAdapter.setAll(
                    {
                        ...initialState,
                        ...response.meta
                    },
                    response.data
                );
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.ids.map((id) => ({ type: "Events" as const, id })),
                        { type: "Events", id: "LIST" },
                    ]
                    : [{ type: "Events", id: "LIST" }],
        }),
        // fetch event by eventId
        getEvent: builder.query<EventWithLocationAndOrganizer, number>({
            query: (id) => `${config.endpoints.events}/${id}`,
            transformResponse: (response: ApiResponse<EventWithLocationAndOrganizer>) => response.data,
            providesTags: (_result, _error, id) => [{ type: 'EventWithLocationAndOrganizer', id }],
        }),
        // create new event
        addEvent: builder.mutation<EventWithLocationAndOrganizer, CreateEventRequest>({
            query: (createEventRequestData) => ({
                url: config.endpoints.events,
                method: "POST",
                body: createEventRequestData
            }),
            transformResponse: (response: ApiResponse<EventWithLocationAndOrganizer>) => response.data,
            invalidatesTags: [{ type: 'Events', id: 'LIST' }],
        }),
        // update event
        updateEvent: builder.mutation<EventWithLocationAndOrganizer, ({id: number, data: UpdateEventRequest})>({
            query: ({id, data }) => ({
                url: `${config.endpoints.events}/${id}`,
                method: "PATCH",
                body: data,
            }),
            transformResponse: (response: ApiResponse<EventWithLocationAndOrganizer>) => response.data,
            invalidatesTags: (_result, _error, arg) =>
            //[{ type: "Events", id: 'LIST'}, { type: "EventWithLocationAndOrganizer", id: arg.id }],
            // THIS SHOULD WORK FOR EVENTS CACHE, --- */*@# DO CHECK LATER...
                [{ type: "Events", id: arg.id}],
            /***********************************************************************************************************
                            P E S S I M I S T I C    U P D A T E    O F    C A C H E
            ***********************************************************************************************************/
            async onQueryStarted(request, { dispatch, queryFulfilled }) {
                try {
                    const { data: updatedEvent } = await queryFulfilled;
                    // UPDATING RTK QUERY CACHE FOR THE EVENT
                    dispatch(
                        eventsSlice.util.updateQueryData('getEvent', request.id, (draft) => {
                            Object.assign(draft, updatedEvent);
                        })
                    );
                } catch {
                    // No manual rollback needed for pessimistic updates
                }
            },
        }),
        // update event location ---->    "/:event_id/location",
        updateEventLocation: builder.mutation<EventWithLocationAndOrganizer, ({event_id: number, data: UpdateEventLocationRequest})>({
            query: ({event_id, data }) => ({
                url: `${config.endpoints.events}/${event_id}/location`,
                method: "PATCH",
                body: data,
            }),
            transformResponse: (response: ApiResponse<EventWithLocationAndOrganizer>) => response.data,
            invalidatesTags: (_result, _error, arg) =>
                //[{ type: "Events", id: 'LIST'}, { type: "EventWithLocationAndOrganizer", id: arg.id }],
                // THIS SHOULD WORK FOR EVENTS CACHE, --- */*@# DO CHECK LATER...
                [{ type: "Events", id: arg.event_id}],
            /***********************************************************************************************************
             P E S S I M I S T I C    U P D A T E    O F    C A C H E
             ***********************************************************************************************************/
            async onQueryStarted(request, { dispatch, queryFulfilled }) {
                try {
                    const {data: updatedEvent} = await queryFulfilled;
                    // UPDATING RTK QUERY CACHE FOR THE EVENT
                    dispatch(
                        eventsSlice.util.updateQueryData('getEvent', request.event_id, (draft) => {
                            Object.assign(draft, updatedEvent);
                        })
                    );
                } catch {
                    // No manual rollback needed for pessimistic updates
                }
            },
        }),

        // delete event
        deleteEvent: builder.mutation<{success: boolean}, number>({
            query: (id) => ({
                url: `${config.endpoints.events}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Events", id: 'LIST'}],
        }),

        // delete event location
        deleteEventLocation: builder.mutation<{success: boolean}, number>({
            query: (id) => ({
                url: `${config.endpoints.events}/${id}/location`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, arg) =>
                [{ type: 'EventWithLocationAndOrganizer', id: arg}],
        }),

        /**************************************************************************************************
        ****************************** ENDPOINTS FOR EVENT TAGS *******************************************
        **************************************************************************************************/

        // fetch all event tags
        getEventTags: builder.query<EntityState<EventTagResponse, number>, {event_id: number, params: EventTagsQueryParams}>({
            query: ({event_id, params}) => ({
                url: `${config.endpoints.events}/${event_id}/tags`,
                params: params,
            }),
            transformResponse: (response: ApiResponse<EventTagResponse[]>) => {
                return eventsTagsAdapter.setAll(eventsTagsAdaptersInitialState, response.data);
            },
            providesTags: (result, _error, arg) =>
                result
                    ? [
                        ...result.ids.map((id) => ({ type: "EventTags" as const, id })),
                        { type: "EventTags", id: `${arg.event_id}-${arg.params.fetchEventOrganizersTags}` },
                    ]
                    : [{ type: "EventTags", id: `${arg.event_id}-${arg.params.fetchEventOrganizersTags}` }],
        }),
        // create new event tag
        addEventTag: builder.mutation<EventTagResponse, {event_id: number, data: CreateEventTagRequest}>({
            query: (request) => ({
                url: `${config.endpoints.events}/${request.event_id}/tags`,
                method: "POST",
                body: request.data,
            }),
            transformResponse: (response: ApiResponse<EventTagResponse>) => response.data,
            // TRY TO USE SIMILAR APPROACH FOR ---->>> ADD LOCATION ENDPOINT !!!!!!!!!
            async onQueryStarted({ event_id }, { dispatch, queryFulfilled }) {
                console.log("adding event tags...");
                try {
                    const { data: newTag } = await queryFulfilled;

                    const cacheParams = {
                        event_id,
                        params: { fetchEventOrganizersTags: false }
                    };

                    dispatch(
                        eventsSlice.util.updateQueryData('getEventTags', cacheParams, (draft) => {
                            eventsTagsAdapter.addOne(draft, newTag);
                        })
                    );
                } catch {
                    // No rollback required for pessimistic update
                }
            },
        }),

        // delete event tag
        deleteEventTag: builder.mutation<{success: boolean}, { event_id: number; tag_id: number; }>({
            query: (request) => ({
                url: `${config.endpoints.events}/${request.event_id}/tags/${request.tag_id}`,
                method: "DELETE",
            }),
            async onQueryStarted({ event_id, tag_id }, { dispatch, queryFulfilled }) {
                console.log("deleting event tags...");
                const cacheParams = {
                    event_id,
                    params: { fetchEventOrganizersTags: false }
                };

                const patchResult = dispatch(
                    eventsSlice.util.updateQueryData('getEventTags', cacheParams, (draft) => {
                        eventsTagsAdapter.removeOne(draft, tag_id);
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    // rollback
                    patchResult.undo();
                }
            },
        }),

        /************************************************************************************************************
         ****************************** ENDPOINTS FOR EVENT PARTICIPATION *******************************************
         ***********************************************************************************************************/

        // fetch all event participants
        getAllEventParticipation: builder.query<EntityState<EventParticipationResponse, number>, number>({
            query: (event_id) => ({
                url: `${config.endpoints.events}/${event_id}/participation`,
            }),
            transformResponse: (response: ApiResponse<EventParticipationResponse[]>) => {
                return eventsParticipationAdapter.setAll(eventsParticipationAdaptersInitialState, response.data);
            },
            providesTags: (result, _error, arg) =>
                result
                    ? [
                        ...result.ids.map((id) => ({ type: "EventsParticipation" as const, id })),
                        { type: "EventsParticipation", id: `LIST-${arg}` },
                    ]
                    : [{ type: "EventsParticipation", id: `LIST-${arg}` }],
        }),

        // get event participation by user_id
        getEventParticipation: builder.query<ParticipationResponse, { event_id: number; user_id: number }>({
            query: ({ event_id, user_id }) => ({
                url: `${config.endpoints.events}/${event_id}/participation/${user_id}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<EventParticipationResponse>) => response.data,
            providesTags: (_result, _error, arg) => [{ type: 'EventsParticipation', id: `EVENT-${arg.event_id}` }],
        }),

        // add event participation : used by user or organizer
        // add event participation : used by user or organizer
        addEventParticipation: builder.mutation<ParticipationResponse, { event_id: number; rsvp: RSVP, email?: string }>({
            query: ({ event_id, rsvp, email }) => ({
                url: `${config.endpoints.events}/${event_id}/participation`,
                method: "POST",
                body: { rsvp, email },
            }),
            transformResponse: (response: ApiResponse<ParticipationResponse>) => response.data,
            // Invalidates the list cache once the server responds successfully
            invalidatesTags: (_result, _error, arg) => [
                { type: 'EventsParticipation', id: `LIST-${arg.event_id}` },
                { type: 'EventsParticipation', id: `EVENT-${arg.event_id}` }
            ],
            /***********************************************************************************************************
             P E S S I M I S T I C    U P D A T E    O F    C A C H E
             ***********************************************************************************************************/
            /*async onQueryStarted({ event_id, email }, lifecycleApi) {
                console.log("i am here");
                if (!email) {
                    try {
                        const { data: newParticipation } = await lifecycleApi.queryFulfilled;
                        const state = lifecycleApi.getState() as RootState;
                        const user_id = getUserId(state);

                        const cacheParams = {
                            event_id,
                            user_id: user_id!,
                        };

                        lifecycleApi.dispatch(
                            eventsSlice.util.upsertQueryData(
                                'getEventParticipation',
                                cacheParams,
                                newParticipation
                            )
                        );
                    } catch {
                        // no rollback for pessimistic update
                    }
                }
            },*/
        }),

        // upsert event participation : used by user or organizer
        updateEventParticipation: builder.mutation<EventParticipationResponse, { event_id: number; user_id: number; rsvp: Omit<RSVP, 'AWAITING'> }>({
            query: ({ event_id, rsvp }) => ({
                url: `${config.endpoints.events}/${event_id}/participation`,
                method: "PATCH",
                body: { rsvp },
            }),
            transformResponse: (response: ApiResponse<EventParticipationResponse>) => response.data,
            // This invalidates every 'getAllEventParticipation' query associated with this event_id
            invalidatesTags: (_result, _error, arg) => [
                { type: 'EventsParticipation', id: `LIST-${arg.event_id}` },
                { type: 'EventsParticipation', id: `EVENT-${arg.event_id}` }
            ],
        }),

        // remove event participation
        // inside eventsSlice.ts -> endpoints
        deleteEventParticipation: builder.mutation<{success: boolean}, { event_id: number, user_id: number }>({
            query: ({ event_id, user_id }) => ({
                url: `${config.endpoints.events}/${event_id}/participation/${user_id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: 'EventsParticipation', id: `LIST-${arg.event_id}` },
                { type: 'EventsParticipation', id: `EVENT-${arg.event_id}` }
            ],
        }),
    }),
});

export const {
    useGetEventsQuery,
    useGetEventQuery,
    useAddEventMutation,
    useDeleteEventMutation,
    useUpdateEventMutation,
    useUpdateEventLocationMutation,
    useDeleteEventLocationMutation,
    useGetEventTagsQuery,
    useAddEventTagMutation,
    useDeleteEventTagMutation,
    useGetAllEventParticipationQuery,
    useAddEventParticipationMutation,
    useGetEventParticipationQuery,
    useUpdateEventParticipationMutation,
    useDeleteEventParticipationMutation,
} = eventsSlice;

/*************************************************************************************************************
 **************************************** --- SELECTORS --- ***************************************************
 *************************************************************************************************************/

// Base selectors
export const selectEventsResult = (params: AllEventsQueryParams) =>
    eventsSlice.endpoints.getEvents.select(params);

export const selectEventTagsResult = (event_id: number, params: EventTagsQueryParams) =>
    eventsSlice.endpoints.getEventTags.select({ event_id, params });

export const selectAllEventParticipationResult = (event_id: number) =>
    eventsSlice.endpoints.getAllEventParticipation.select(event_id);


// Base selectors for the data portion
const selectEventsData = (params: AllEventsQueryParams) => createSelector(
    [selectEventsResult(params)],
    (result) => result.data ?? initialState
);

const selectEventTagsData = (event_id: number, params: EventTagsQueryParams) => createSelector(
    [selectEventTagsResult(event_id, params)],
    (result) => result.data ?? eventsTagsAdaptersInitialState
);

const selectAllEventParticipationData = (event_id: number) => createSelector(
    [selectAllEventParticipationResult(event_id)],
    (result) => result.data ?? eventsParticipationAdaptersInitialState
);

// Selector for "All Events" (returns an array of AllEventsResponse)
export const selectAllEvents = (params: AllEventsQueryParams) =>
    eventsAdapter.getSelectors(selectEventsData(params)).selectAll;

// Selector for "All Event Tags"
export const selectAllEventTags = (event_id: number, params: EventTagsQueryParams) =>
    eventsTagsAdapter.getSelectors(selectEventTagsData(event_id, params)).selectAll;

export const selectAllEventParticipation = (event_id: number) =>
    eventsParticipationAdapter.getSelectors(selectAllEventParticipationData(event_id)).selectAll;

export const selectEventParticipationByUserId = (
    event_id: number,
    user_id: number
) => createSelector(
    [selectAllEventParticipation(event_id)],
    (participants) => participants.find((p) => p.user_id === user_id)
);

export const selectCurrentUserEventParticipation = (event_id: number, user_id: number) =>
    eventsSlice.endpoints.getEventParticipation.select({ event_id, user_id });

// Example usage in a component:
// const { data: myParticipation } = useGetEventParticipationQuery({ event_id, user_id: currentUser.id });


// Selector for Counts

export const selectEventsTotalCount = (params: AllEventsQueryParams) => createSelector(
    [selectEventsResult(params)],
    (result) => result.data?.totalEvents ?? 0
);

export const selectEventsTotalPagesCount = (params: AllEventsQueryParams) => createSelector(
    [selectEventsResult(params)],
    (result) => result.data?.totalPages ?? 0
);