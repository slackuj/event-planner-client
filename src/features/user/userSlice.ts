import {apiSlice} from "../../api/apiSlice.ts";
import {createSelector} from "@reduxjs/toolkit";
import type {
    UpdateUserRequest,
    User,
} from "../../types/user.ts";
import {config} from "../../config.ts";
import type {ApiResponse} from "../../types/response.ts";


/***********************************************/
/*** INJECTING AUTH ENDPOINTS INTO APISLICE  ***/
/***********************************************/

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<User, void>({
            query: () => config.endpoints.me,
            keepUnusedDataFor: 900, // 15 minutes
            transformResponse: (response: ApiResponse<User>) => response.data,
            providesTags: (result, _error) => [{ type: 'Me', id: result!.id }],
        }),
        // updateMe
        updateMe: builder.mutation<User, UpdateUserRequest>({
            query: (request) => ({
                url: `${config.endpoints.me}`,
                method: "PATCH",
                body: request,
            }),
            transformResponse: (response: ApiResponse<User>) => response.data,
            async onQueryStarted(_request, { dispatch, queryFulfilled }) {
                try {
                    const { data: updatedUser } = await queryFulfilled;
                    // UPDATING RTK QUERY CACHE FOR ME
                    dispatch(
                        usersApiSlice.util.updateQueryData('getMe', undefined, (draft) => {
                            Object.assign(draft, updatedUser);
                        })
                    );
                } catch {
                    // No manual rollback needed for pessimistic updates
                }
            },
        }),
    }),
});

export const {
    useGetMeQuery,
    useUpdateMeMutation,
} = usersApiSlice;

// selector for currentUser
export const selectCurrentUser = usersApiSlice.endpoints.getMe.select();
export const selectCurrentUserData = createSelector(
    [selectCurrentUser],
    result => result.data ?? undefined
);