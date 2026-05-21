import {EventsToolBar} from "../../components/EventsToolbar.tsx";
import {type ReactNode, useState} from "react";
import type {AllEventsQueryParams} from "../../types/QueryParams.ts";
import "./MyEventsPage.css";
import {selectAllEvents, selectEventsTotalCount, useGetEventsQuery} from "./eventsSlice.ts";
import {useAppSelector} from "../../hooks/storeHooks.ts";
import {CircularProgress, TablePagination} from "@mui/material";
import {EventsTable} from "../../components/EventsTable.tsx";
import {useModalGuard} from "../../hooks/eventHooks.ts";
import {EventsFilter} from "../../components/EventsFilter.tsx";
import {DEFAULT_END_DATE, DEFAULT_START_DATE} from "../../constants/appConstants.ts";

export const AllEventsPage = () => {

    useModalGuard();

        const [params, setParams] = useState<AllEventsQueryParams>({
            page: 1,
            isParticipating: false,
            isPublic: true,
            isOrganized: false,
            isRequested: false,
            start_date: DEFAULT_START_DATE,
            end_date: DEFAULT_END_DATE,
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

    // Handle updates coming from the Filters Bar component
    const handleFilterChanges = (updatedFilters: Partial<Pick<AllEventsQueryParams, 'start_date' | 'end_date' | 'sort_order' | 'isPublic'>>) => {
        setPage(0); // Reset page selection to index 0 on update
        setParams((prev) => ({
            ...prev,
            ...updatedFilters,
            page: 1
        }));
    };

    // Handle clearing date range constraints
    const handleResetFilters = () => {
        setPage(0);
        setParams((prev) => ({
            ...prev,
            start_date: DEFAULT_START_DATE,
            end_date: DEFAULT_END_DATE,
            sort_order: "desc",
            isPublic: true,
            page: 1
        }));
    };

        const eventTable: ReactNode = (
            <>
                <EventsFilter
                    start_date={params.start_date}
                    end_date={params.end_date}
                    sort_order={params.sort_order}
                    isPublic={params.isPublic}
                    isEventTypeFilterDisabled={true}
                    onFilterChange={handleFilterChanges}
                    onReset={handleResetFilters}
                />
                <EventsTable events={events} isEventTypeColumnVisible={false}/>
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
            <EventsToolBar listTitle="Events"/>
            <div className="page-container">
                {eventTable}
            </div>
        </div>
    );
};