import {EventsToolBar} from "../../components/EventsToolbar.tsx";
import {type ReactNode, useState} from "react";
import type {AllEventsQueryParams} from "../../types/QueryParams.ts";
import classNames from "classnames";
import "./MyEventsPage.css";
import {selectAllEvents, selectEventsTotalCount, useGetEventsQuery} from "./eventsSlice.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/storeHooks.ts";
import {CircularProgress, TablePagination} from "@mui/material";
import {EventsTable} from "../../components/EventsTable.tsx";
import {useLocation} from "react-router";
import {useModalGuard} from "../../hooks/eventHooks.ts";
import {
    DEFAULT_END_DATE,
    DEFAULT_START_DATE,
} from "../../constants/appConstants.ts";
import {EventsFilter} from "../../components/EventsFilter.tsx";
import {toggleEventModal} from "../../store/slices/modalsSlice.ts";

export const MyEventsPage = () => {

    useModalGuard();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const isNewEvent = location.state?.isNewEvent as Boolean | undefined;
    type Tabs = "Participating" | "Organizing";

    const [activeTab, setActiveTab] = useState<Tabs>(!!isNewEvent ? "Organizing": "Participating");
    const [params, setParams] = useState<AllEventsQueryParams>({
        page: 1,
        isParticipating: !isNewEvent,
        isPublic: undefined,
        isOrganized: !!isNewEvent,
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
    //const participatingEvents = useAppSelector(selectEventsTotalCount(myParticipatingEventsQueryParams));
    //const organizingEvents = useAppSelector(selectEventsTotalCount(myOrganizingEventsQueryParams));

    //let ParticipatingEventsBadge: ReactNode;
    //let OrganizingEventsBadge: ReactNode;

    /*if (participatingEvents > 0) {
        ParticipatingEventsBadge = (<span className="event-count">{participatingEvents}</span>);
    }
    if (organizingEvents > 0) {
        OrganizingEventsBadge = (<span className="event-count">{organizingEvents}</span>);
    }*/

    const TabsNode: ReactNode = (
        <nav className="events-nav">
                <span
                    className={classNames('nav-tab', { 'active': activeTab === 'Participating' })}
                    onClick={() => {
                        dispatch(toggleEventModal({focusedEventId: undefined, focusedEventsOrganizersEmail: undefined}));
                        setPage(0);
                        setParams({
                            page: 1,
                            isParticipating: true,
                            isPublic: undefined,
                            isOrganized: false,
                            isRequested: false,
                            start_date: DEFAULT_START_DATE,
                            end_date: DEFAULT_END_DATE,
                            sort_order: "desc",

                        });
                        setActiveTab('Participating');
                    }}
                >
                    Participating {/*{ParticipatingEventsBadge}*/}
            </span>
            <span
                className={classNames('nav-tab', { 'active': activeTab === 'Organizing' })}
                onClick={() => {
                    dispatch(toggleEventModal({focusedEventId: undefined, focusedEventsOrganizersEmail: undefined}));
                    setPage(0);
                    setParams({
                        page: 1,
                        isParticipating: false,
                        isPublic: undefined,
                        isOrganized: true,
                        isRequested: false,
                        start_date: DEFAULT_START_DATE,
                        end_date: DEFAULT_END_DATE,
                        sort_order: "desc",
                    });
                    setActiveTab('Organizing');
                }}
            >
                    Organizing {/*{OrganizingEventsBadge}*/}
            </span>
        </nav>
    );

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
            isPublic: undefined,
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
                isEventTypeFilterDisabled={false}
                onFilterChange={handleFilterChanges}
                onReset={handleResetFilters}
            />
            <EventsTable events={events} isEventTypeColumnVisible={true}/>
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
            {TabsNode}
            <div className="page-container">
                {eventTable}
            </div>
        </div>
    );
};