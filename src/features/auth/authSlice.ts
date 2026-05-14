import {
    decodeToken,
    getAccessToken,
    getPersistSession,
    setAccessToken,
    setPersistSession
} from "../../utils/tokenUtil.ts";
import {createSlice, isAnyOf, type PayloadAction} from "@reduxjs/toolkit";
import type {RootState} from "../../store/store.ts";
import type {AccessToken} from "../../types/token.ts";
import {apiSlice} from "../../api/apiSlice.ts";

export interface AuthState {
    id: number | undefined;
    accessToken: string | undefined;
    email: string | undefined;
    isAuthenticated: boolean;
    isSessionPersisted: boolean;
}

const accessToken = getAccessToken();
const persistSession = getPersistSession();
//console.log("hi");
//console.log(persistSession);
const decodedAccessToken = decodeToken(accessToken) as AccessToken;

const initialState: AuthState = {
    id: decodedAccessToken?.id,
    accessToken,
    email: decodedAccessToken?.email,
    isAuthenticated: !!decodedAccessToken,
    isSessionPersisted: persistSession,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // used during `/refresh`
        tokenReceived: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        loggedOut:(state) => {
            state.id = undefined;
            state.accessToken = undefined;
            state.email = undefined;
            state.isAuthenticated = false;
            state.isSessionPersisted = false;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            isAnyOf(
                apiSlice.endpoints.login.matchFulfilled,
                apiSlice.endpoints.refresh.matchFulfilled,
            ),
            (state, action) => {
                const { accessToken } = action.payload;
                if ( accessToken ) {
                    state.accessToken = accessToken;

                    setAccessToken(accessToken);
                    setPersistSession(true);
                    // consider performing non-state update tasks outside the reducer ??? such as in onQueryStarted/Updated method ... also can transform response to match the required payload !?

                    //  decode in transformResponse ?
                    const decodedAccessToken = decodeToken(accessToken) as AccessToken;
                    state.id = decodedAccessToken?.id;
                    state.email = decodedAccessToken?.email;
                    state.isAuthenticated = true;
                    state.isSessionPersisted = true;
                }
            }
        );
        builder.addMatcher(
            isAnyOf( apiSlice.endpoints.updatePassword.matchFulfilled),
            (state, action) => {
                const { accessToken } = action.payload;
                if ( accessToken ) {
                    state.accessToken = accessToken;
                }
            }
        );
        builder.addMatcher(
            apiSlice.endpoints.logout.matchFulfilled, (state) => {
                state.id = undefined;
                state.accessToken = undefined;
                state.email = undefined;
                state.isAuthenticated = false;
                state.isSessionPersisted = false;
            }
        );
    },
});

export default authSlice.reducer;

// action creators
export const {
    tokenReceived,
    loggedOut,
} = authSlice.actions;

// selectors
export const getUserId = (state: RootState) => state.auth.id;
export const getUserAuth = (state: RootState) => state.auth.isAuthenticated;
export const getUserEmail = (state: RootState) => state.auth.email;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const getSessionPersistence = (state: RootState) => state.auth.isSessionPersisted;