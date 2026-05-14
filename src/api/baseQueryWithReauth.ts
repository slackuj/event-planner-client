import {type BaseQueryFn, type FetchArgs, fetchBaseQuery, type FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {config} from "../config.ts";
import type {RootState} from "../store/store.ts";
import {Mutex} from "async-mutex";
import {loggedOut, tokenReceived} from "../features/auth/authSlice.ts";
import {clearTokens, setAccessToken} from "../utils/tokenUtil.ts";
import type {ApiResponse} from "../types/response.ts";
import type {RefreshResponseData} from "../types/auth.ts";
import {httpCodes} from "../constants/httpCodes.ts";

const baseQuery = fetchBaseQuery({
    baseUrl: config.apiBaseURI,
    prepareHeaders: (headers, { getState }) => {
        const accessToken = ( getState() as RootState ).auth.accessToken;
        if (accessToken){
            // set accessToken
            headers.set("authorization", `Bearer ${accessToken}`);
        }
        // content-type header set automatically by rtk query !!!
        //headers.set("Content-Type", "application/json");
        // research on "Cache-Control" header and implement later
        //headers.set("Cache-Control", "no-cache");
        return headers;
    },
    credentials: "include",
});

const mutex = new Mutex();
export const baseQueryWithReAuth: BaseQueryFn<
    string | FetchArgs, // type for 'args
    unknown, // type for expected result
    FetchBaseQueryError // type for the error
> = async( args, api, extraOptions) => {
    // wait until the mutex is available without locking it
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === httpCodes.UNAUTHORIZED.statusCode) {
        // checking whether the mutex is locked
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                /*const [useRefresh] = useRefreshMutation;
                await useRefresh();*/
                const refreshResult = await baseQuery(
                    {
                        url: config.endpoints.refresh,
                        method: "POST",
                    },
                    api,
                    extraOptions
                ) as { data : ApiResponse<RefreshResponseData>};
                //console.log(refreshResult);
                // refresh successful and server returns new access token
                if (refreshResult.data?.data) {
                    api.dispatch(tokenReceived(refreshResult.data.data.accessToken));
                    setAccessToken(refreshResult.data.data.accessToken);
                    // retry the initial query
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    api.dispatch(loggedOut());
                    clearTokens();
                }
            } finally {
                // release mutex
                release();
            }
        } else {
            // wait until the mutex is available without locking it
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }
    return result;
};