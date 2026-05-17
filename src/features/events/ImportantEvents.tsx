import {EventsToolBar} from "../../components/EventsToolbar.tsx";
import {useModalGuard} from "../../hooks/eventHooks.ts";

export const ImportantEventsPage = () => {
    useModalGuard();
    return (
        <div className="page-content">
            <EventsToolBar listTitle="Important"/>
            <div className="page-container">
            </div>
        </div>
    );
};