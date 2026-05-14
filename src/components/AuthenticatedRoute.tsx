import type { ReactNode } from "react";
import { useAppSelector } from "../hooks/storeHooks";
import {getUserAuth} from "../features/auth/authSlice.ts";
import {Navigate} from "react-router";

interface AuthenticatedRouteProps {
    children: ReactNode;
}

export const AuthenticatedRoute = ({ children} : AuthenticatedRouteProps) => {
    const isAuthenticated = useAppSelector(getUserAuth);
    if (!isAuthenticated) {
        // implement re-trying to access the requested page later
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>
}