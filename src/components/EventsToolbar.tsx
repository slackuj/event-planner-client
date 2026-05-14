import type {ReactNode} from "react";
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import './EventsToolbar.css';

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
        </div>
    )
};