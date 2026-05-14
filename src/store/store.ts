import {configureStore} from "@reduxjs/toolkit";
import {apiSlice} from "../api/apiSlice.ts";
import authReducer from "../features/auth/authSlice.ts";
//import modalsReducer from "./slices/modalsSlice";

export const store = configureStore({
    reducer: {
        //modals: modalsReducer,
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiSlice.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;