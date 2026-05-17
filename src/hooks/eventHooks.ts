import {useAppDispatch} from "./storeHooks.ts";
import {useEffect} from "react";
import {toggleEventModal} from "../store/slices/modalsSlice.ts";

export const useModalGuard = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(toggleEventModal({focusedEventId: undefined, focusedEventsOrganizersEmail: undefined}));
    }, []);
};