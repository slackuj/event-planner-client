import { Route, Routes } from "react-router";
import {UserPage} from "../features/user/UserPage.tsx";
import {ConfirmPage} from "../features/auth/ConfirmPage.tsx";
import {LoginPage} from "../features/auth/LoginPage.tsx";
import {RegisterPage} from "../features/auth/RegisterPage.tsx";
import {AuthenticatedRoute} from "./AuthenticatedRoute.tsx";
import {ResourceNotFound} from "../features/user/NotFoundPage.tsx";
import {MyDayEventsPage} from "../features/events/MyDayEventsPage.tsx";
import {MyEventsPage} from "../features/events/MyEventsPage.tsx";
import {EventRequestsPage} from "../features/events/EventRequestsPage.tsx";
import {AllEventsPage} from "../features/events/AllEventsPage.tsx";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route index element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/users/confirm" element={<ConfirmPage />} />

            <Route path="/events/my-day" element={<AuthenticatedRoute><MyDayEventsPage /></AuthenticatedRoute>}/>
            <Route path="/events/my-events" element={<AuthenticatedRoute><MyEventsPage /></AuthenticatedRoute>}/>
            <Route path="/events/requests" element={<AuthenticatedRoute><EventRequestsPage /></AuthenticatedRoute>}/>
            <Route path="/events/all" element={<AuthenticatedRoute><AllEventsPage /></AuthenticatedRoute>}/>
            <Route path="/my-profile" element={<AuthenticatedRoute><UserPage /></AuthenticatedRoute>}/>
            <Route path="*" element={<ResourceNotFound/>} />
        </Routes>
    );
};