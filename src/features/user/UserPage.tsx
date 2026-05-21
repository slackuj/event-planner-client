import {
    Avatar, Button,
    CircularProgress,
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../hooks/storeHooks.ts";
import {selectCurrentUserData, useGetMeQuery} from "./userSlice.ts";
import {useNavigate} from "react-router";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import "./UserPage.css";
import {EventsToolBar} from "../../components/EventsToolbar.tsx";
import {useModalGuard} from "../../hooks/eventHooks.ts";
import {UpdatePasswordModal} from "../../components/UpdatePasswordModal.tsx";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
    toggleEditUserModal,
    toggleUpdatePasswordModal
} from "../../store/slices/modalsSlice.ts";
import {EditUserModal} from "../../components/EditUserModal.tsx";
import type {ReactNode} from "react";

export const UserPage = () => {
    const dispatch = useAppDispatch();
    useModalGuard();
    const navigate = useNavigate();


    const {
        isLoading
    } = useGetMeQuery();


    const me = useAppSelector(selectCurrentUserData);

    if (isLoading) return <CircularProgress />;
    // HANDLE ERRORS LATER
    if (!me) {
        // user is not logged in
        // should we clear tokens ???
        navigate("/login");
    }

    let Settings: ReactNode;
        Settings = (
            <div className="settings-container">
                <Button onClick={() => dispatch(toggleUpdatePasswordModal())} variant="contained" endIcon={<ArrowForwardIosIcon />}>
                    Update Your Password
                </Button>
                <UpdatePasswordModal />
                <EditUserModal />
            </div>
        );

    return (

        <div className="page-content">
        <EventsToolBar listTitle="Profile"/>
        <div className="page-container">
            <div className="profile-container">
                <div className="profile-content">
                    <div className="user-info-section">
                        <Avatar
                            alt=""
                            src={me!.profile_picture}
                            sx={{
                                width: 150,
                                height: 150,
                                mb: 2,
                                border: '4px solid',
                                borderColor: 'divider'
                            }}
                        />
                        <div className="user-details">
                            <span className="user-name">{me!.name}</span>
                            <span className="user-email">{me!.email}</span>
                        </div>
                        {
                            <div
                                className="edit-user"
                                onClick={() => dispatch(toggleEditUserModal())}
                                title="Edit Info"
                            >
                                <EditSquareIcon
                                /> Edit
                            </div>}
                    </div>
                </div>
            </div>
            <span className="settings">Settings</span>
            {Settings}
        </div>
        </div>
    );
};