import {NavLink} from "react-router";
import type {ReactNode} from "react";
import {LIST_ICON} from "./EventsToolbar.tsx";
import "./SideBar.css";

export const SideBar = () => {

    /*useGetEventsQuery(myDayEventsQueryParams);
    useGetEventsQuery(myParticipatingEventsQueryParams);
    useGetEventsQuery(myOrganizingEventsQueryParams);
    useGetEventsQuery(myEventsRequestsQueryParams);
    useGetEventsQuery(allEventsQueryParams);

    const myDayEvents = useAppSelector(selectEventsTotalCount(myDayEventsQueryParams));
    const myParticipatingEvents = useAppSelector(selectEventsTotalCount(myParticipatingEventsQueryParams));
    const myOrganizingEvents = useAppSelector(selectEventsTotalCount(myOrganizingEventsQueryParams));
    const myEvents = myParticipatingEvents + myOrganizingEvents;
    const myEventsRequests = useAppSelector(selectEventsTotalCount(myEventsRequestsQueryParams));
    const allEvents = useAppSelector(selectEventsTotalCount(allEventsQueryParams));


    let myDayEventsBadge: ReactNode;
    let myEventsBadge: ReactNode;
    let myEventsRequestsBadge: ReactNode;
    let allEventsBadge: ReactNode;

    if (myDayEvents > 0) {
        myDayEventsBadge = (<span className="event-count">{myDayEvents}</span>);
    }
    if (myEvents > 0) {
        myEventsBadge = (<span className="event-count">{myEvents}</span>);
    }
    if (myEventsRequests > 0) {
        myEventsRequestsBadge = (<span className="event-count">{myEventsRequests}</span>);
    }
    if (allEvents > 0) {
        allEventsBadge = (<span className="event-count">{allEvents}</span>);
    }*/

    const pageTitle = ["My Day", "My Events", "Event Requests", "Events", "Profile"];
    let content: ReactNode;
    content = (
        <ul>
            <NavLink to="/events/my-day">
                <li>
                    <span className="page-icon">{LIST_ICON[pageTitle[0]]}</span>
                    <span className="page-title">{pageTitle[0]}</span>
                    {/*{myDayEventsBadge}*/}
                </li>
            </NavLink>
            <NavLink to="/events/my-events">
                <li>
                    <span className="page-icon">{LIST_ICON[pageTitle[1]]}</span>
                    <span className="page-title">{pageTitle[1]}</span>
                    {/*{myEventsBadge}*/}
                </li>
            </NavLink>
            <NavLink to="/events/requests">
                <li>
                    <span className="page-icon">{LIST_ICON[pageTitle[2]]}</span>
                    <span className="page-title">{pageTitle[2]}</span>
                    {/*{myEventsRequestsBadge}*/}
                </li>
            </NavLink>
            <NavLink to="/events/all">
                <li>
                    <span className="page-icon">{LIST_ICON[pageTitle[3]]}</span>
                    <span className="page-title">{pageTitle[3]}</span>
                    {/*{allEventsBadge}*/}
                </li>
            </NavLink>
            <NavLink to="/my-profile">
                <li>
                    <span className="page-icon">{LIST_ICON[pageTitle[4]]}</span>
                    <span className="page-title">{pageTitle[4]}</span>
                </li>
            </NavLink>
        </ul>
    );

    return (
        <div className="sidebar">
            {content}
        </div>
    );
};