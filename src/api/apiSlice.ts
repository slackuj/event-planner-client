import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReAuth} from "./baseQueryWithReauth.ts";
import type {
    LoginResponseData, PasswordUpdateRequest, PasswordUpdateResponse,
    RefreshResponseData,
    RegisterResponseData, SendConfirmationCodeRequest, UserConfirmationRequest,
    UserLoginRequest,
    UserRegisterRequest
} from "../types/auth.ts";
import {config} from "../config.ts";
import type {ApiResponse} from "../types/response.ts";
import {clearTokens, setAccessToken} from "../utils/tokenUtil.ts";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReAuth,
    tagTypes: [
        'Me',
    ],
    endpoints: (builder) => ({
        login: builder.mutation< LoginResponseData, UserLoginRequest>({
            query: (userLoginRequestData) => ({
                url: config.endpoints.login,
                method: "POST",
                body: userLoginRequestData
            }),
            transformResponse: (response: ApiResponse<LoginResponseData>) => response.data,
        }),
        // endpoint for logout
        logout: builder.mutation< {success: boolean}, void>({
            query: () => ({
                url: config.endpoints.logout,
                method: "POST",
            }),
            async onQueryStarted(_, lifecycleApi){
                try{
                    await lifecycleApi.queryFulfilled;
                    // (clear)reset RTK Query Cache
                    lifecycleApi.dispatch(apiSlice.util.resetApiState());
                    // clear cookies
                    clearTokens();
                }catch (error){
                    console.error(error);
                }
            }
        }),
        // endpoint for registering new user
        register: builder.mutation<RegisterResponseData, UserRegisterRequest>({
            query: (userRegisterRequestData) => ({
                url: config.endpoints.register,
                method: "POST",
                body: userRegisterRequestData
            }),
            transformResponse: (response: ApiResponse<RegisterResponseData>) => response.data,
        }),
        // endpoint for refreshing user
        refresh: builder.mutation< RefreshResponseData, void>({
            query: () => ({
                url: config.endpoints.refresh,
                method: "POST",
            }),
            transformResponse: (response: ApiResponse<LoginResponseData>) => response.data,
        }),
        // endpoint for new user confirmation
        confirm: builder.mutation<{success: boolean}, UserConfirmationRequest>({
            query: (request) => ({
                url: config.endpoints.confirm,
                method: "POST",
                body: request,
            }),
        }),
        // endpoint for requesting resending confirmation code
        resendConfirmationCode: builder.mutation<RegisterResponseData, SendConfirmationCodeRequest>({
            query: (request) => ({
                url: config.endpoints.resendConfirmationCode,
                method: "POST",
                body: request,
            }),
            transformResponse: (response: ApiResponse<RegisterResponseData>) => response.data,
        }),
        // endpoint for password update
        updatePassword: builder.mutation<PasswordUpdateResponse, PasswordUpdateRequest>({
            query: (request) => ({
                url: config.endpoints.updatePassword,
                method: "PATCH",
                body: request,
            }),
            transformResponse: (response: ApiResponse<PasswordUpdateResponse>) => response.data,
            // update accessToken cookie on success
            async onQueryStarted(_, lifecycleApi){
                try {
                    const { data: response } = await lifecycleApi.queryFulfilled;
                    setAccessToken(response.accessToken);
                } catch (error){
                    console.error("Failed to update password", error);
                }
            }
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useRefreshMutation,
    useConfirmMutation,
    useResendConfirmationCodeMutation,
    useUpdatePasswordMutation,
} = apiSlice;