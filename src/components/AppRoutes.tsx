import { Route, Routes } from "react-router";
import {UserPage} from "../features/user/UserPage.tsx";
import {ConfirmPage} from "../features/auth/ConfirmPage.tsx";
import {LoginPage} from "../features/auth/LoginPage.tsx";
import {RegisterPage} from "../features/auth/RegisterPage.tsx";
import {AuthenticatedRoute} from "./AuthenticatedRoute.tsx";
import {ResourceNotFound} from "../features/user/NotFoundPage.tsx";
//import {ResourceNotFound} from "../features/users/NotFoundPage.tsx";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route index element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/users/confirm" element={<ConfirmPage />} />
            <Route
                path="/dashboard"
                element={
                    <AuthenticatedRoute >
                        <UserPage />
                    </AuthenticatedRoute>
                }
            />

            <Route path="/my-profile"
                   element={
                       <AuthenticatedRoute>
                           <UserPage />
                       </AuthenticatedRoute>}
            />

            <Route path="*" element={<ResourceNotFound/>} />
        </Routes>
    );
};