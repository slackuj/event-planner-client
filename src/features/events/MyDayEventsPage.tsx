import {EventsToolBar} from "../../components/EventsToolbar.tsx";
import {type ReactNode, useState} from "react";
import type {AllEventsQueryParams} from "../../types/QueryParams.ts";
import "./MyEventsPage.css";
import {selectAllEvents, selectEventsTotalCount, useGetEventsQuery} from "./eventsSlice.ts";
import {useAppSelector} from "../../hooks/storeHooks.ts";
import {CircularProgress, TablePagination} from "@mui/material";
import {EventsTable} from "../../components/EventsTable.tsx";
import {useModalGuard} from "../../hooks/eventHooks.ts";

export const MyDayEventsPage = () => {

    useModalGuard();
    const [params, setParams] = useState<AllEventsQueryParams>({
        page: 1,
        isParticipating: true,
        isPublic: undefined,
        isOrganized: false,
        isRequested: false,
        start_date: Date.now(),
        end_date: Date.now(),
        sort_order: "desc",
    });
    const [page, setPage] = useState<number>(0);

    const {
        isLoading,
        //isFetching,
        isError,
        error,
        //isSuccess
    } = useGetEventsQuery(params);

    const events = useAppSelector(selectAllEvents(params));
    const totalEvents = useAppSelector(selectEventsTotalCount(params));

    if (isLoading) return <CircularProgress />;
    if (isError) {
        console.error(error);
        return <div>Error Loading Events...</div>;
    }

    const eventTable: ReactNode = (
        <>
            <EventsTable events={events}/>
            <TablePagination
                component="div"
                count={totalEvents}
                onPageChange={(_, newPage) => {
                    setPage(newPage);
                    setParams((prev) => ({
                        ...prev,
                        page: newPage + 1,
                    }))
                }}
                page={page}
                rowsPerPage={4}
                rowsPerPageOptions={[4]}
            />
        </>
    );

    return (
        <div className="page-content">
            <EventsToolBar listTitle="My Events"/>
            <div className="page-container">
                {eventTable}
            </div>
        </div>
    );
};