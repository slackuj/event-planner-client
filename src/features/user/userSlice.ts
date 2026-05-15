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

export const userSlice = apiSlice.injectEndpoints({
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
                        userSlice.util.updateQueryData('getMe', undefined, (draft) => {
                            Object.assign(draft, updatedUser);
                        })
                    );
                } catch {
                    // No manual rollback needed for pessimistic updates
                }
            },
        }),

        /******************************************************************************/
        /************* E N D P O I N T S   F O R   C L O U D I N A R Y ****************/
        /******************************************************************************/
        // get new signature
        getSignature: builder.mutation<string, void>({
            query: () => ({
                url: config.endpoints.cloudinarySignature,
                method: "POST",
            }),
            transformResponse: (response: ApiResponse<string>) => response.data,
        }),
    }),
});

export const {
    useGetMeQuery,
    useUpdateMeMutation,
    useGetSignatureMutation,
} = userSlice;

// selector for currentUser
export const selectCurrentUser = userSlice.endpoints.getMe.select();
export const selectCurrentUserData = createSelector(
    [selectCurrentUser],
    result => result.data ?? undefined
);