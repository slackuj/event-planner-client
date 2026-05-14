import {NavLink} from "react-router";
import type {ReactNode} from "react";
import {LIST_ICON} from "./EventsToolbar.tsx";

export const SideBar = () => {

    /*const mydayTasks = useAppSelector(selectMyDayTasksCount);
    const importantTasks = useAppSelector(selectImportantTasksCount);
    const plannedTasks = useAppSelector(selectPlannedTasksCount);
    const allTasks = useAppSelector(selectAllTasksCount);*/

    /*let mydayTasksBadge: ReactNode;
    let importantTasksBadge: ReactNode;
    let plannedTasksBadge: ReactNode;
    let allTasksBadge: ReactNode;

    if (mydayTasks > 0) {
        mydayTasksBadge = (<span className="task-count">{mydayTasks}</span>);
    }
    if (importantTasks > 0) {
        importantTasksBadge = (<span className="task-count">{importantTasks}</span>);
    }
    if (plannedTasks > 0) {
        plannedTasksBadge = (<span className="task-count">{plannedTasks}</span>);
    }
    if (allTasks > 0) {
        allTasksBadge = (<span className="task-count">{allTasks}</span>);
    }*/

    const pageTitle = ["My Day", "Important", "My Events", "Event Requests", "Events", "Profile"];
    let content: ReactNode;
    content = (
        <ul>
            <NavLink to="/events/my-day">
                <li>
                    <span className="page-icon">{LIST_ICON[pageTitle[0]]}</span>
                    <span className="page-title">{pageTitle[0]}</span>
                    {/*{mydayTasksBadge}*/}
                </li>
            </NavLink>
            <NavLink to="/events/important">
                <li>
                    <span className="page-icon">{LIST_ICON[pageTitle[1]]}</span>
                    <span className="page-title">{pageTitle[1]}</span>
                    {/*{importantTasksBadge}*/}
                </li>
            </NavLink>
            <NavLink to="/events/my-events">
                <li>
                    <span className="page-icon">{LIST_ICON[pageTitle[2]]}</span>
                    <span className="page-title">{pageTitle[2]}</span>
                    {/*{plannedTasksBadge}*/}
                </li>
            </NavLink>
            <NavLink to="/events/requests">
                <li>
                    <span className="page-icon">{LIST_ICON[pageTitle[3]]}</span>
                    <span className="page-title">{pageTitle[3]}</span>
                    {/*{plannedTasksBadge}*/}
                </li>
            </NavLink>
            <NavLink to="/events/all">
                <li>
                    <span className="page-icon">{LIST_ICON[pageTitle[4]]}</span>
                    <span className="page-title">{pageTitle[4]}</span>
                    {/*{allTasksBadge}*/}
                </li>
            </NavLink>
            <NavLink to="/my-profile">
                <li>
                    <span className="page-icon">{LIST_ICON[pageTitle[5]]}</span>
                    <span className="page-title">{pageTitle[5]}</span>
                    {/*{allTasksBadge}*/}
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