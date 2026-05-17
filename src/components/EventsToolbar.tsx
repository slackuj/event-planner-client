import type {ReactNode} from "react";
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import './EventsToolbar.css';
import {toggleDialogModal} from "../store/slices/modalsSlice.ts";
import {useAppDispatch} from "../hooks/storeHooks.ts";
import {AddEventModal} from "./AddEventModal.tsx";

interface EventsToolBarProps {
    listTitle: string;
}

export const LIST_ICON: Readonly<Record<string, ReactNode>> ={
    "My Day": <WbSunnyOutlinedIcon/>,
    "Important": <StarBorderOutlinedIcon/>,
    "My Events": <FolderSharedOutlinedIcon/>,
    "Event Requests": <CollectionsBookmarkOutlinedIcon/>,
    "Events": <AnalyticsOutlinedIcon/>,
    "Profile": <PersonOutlineOutlinedIcon/>,
};

export const EventsToolBar = (props: EventsToolBarProps) => {

    let titleIcon: ReactNode;
    titleIcon = LIST_ICON[props.listTitle];

    const dispatch = useAppDispatch();

    return (
        <div className="eventsToolBar">
            <div className="eventsToolBarContainer">
                <div className="eventsToolBar-titleItem">
                    <h2 className="listTitle">
                        {titleIcon}
                        <span>{props.listTitle}</span>
                        <MoreHorizIcon/>
                    </h2>
                </div>
            </div>
            {props.listTitle !== "Profile" &&
                <button
                    className="add-event"
                    onClick={() => {
                        // Get the currently focused element
                        const buttonElement = document.activeElement as HTMLElement;
                        // Remove focus from the button
                        buttonElement.blur();
                        dispatch(toggleDialogModal());
                    }}
                >
                    <AddIcon/> New Event
                </button>
            }
            <AddEventModal/>
        </div>
    )
};