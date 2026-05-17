import {EventsToolBar} from "../../components/EventsToolbar.tsx";
import {useModalGuard} from "../../hooks/eventHooks.ts";

export const MyDayEventsPage = () => {
    useModalGuard();
    return (
        <div className="page-content">
            <EventsToolBar listTitle="My Day"/>
            <div className="page-container">
            </div>
        </div>
    );
};