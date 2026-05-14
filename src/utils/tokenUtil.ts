import * as storage from "./storageUtil";
import {jwtDecode, type JwtPayload} from "jwt-decode";
import {ACCESS_TOKEN, PERSIST_SESSION} from "../constants/storageConstants.ts";

export function getAccessToken(): string {
    return storage.get(ACCESS_TOKEN);
}

export function setAccessToken(token: string) {
    return storage.set(ACCESS_TOKEN, token);
}

export function getPersistSession(): boolean {
    return storage.get(PERSIST_SESSION);
}

export function setPersistSession(persistSession: boolean) {
    const maxAge = 30 * 24 * 60 * 60; // maxAge in seconds
    return storage.set(PERSIST_SESSION, persistSession, maxAge);
}

export function clearTokens () {
    storage.remove(ACCESS_TOKEN);
    storage.remove(PERSIST_SESSION);
}

export function decodeToken(token: string): JwtPayload | null {
    try {
        //console.log("AccessToken", decodedToken);
        return jwtDecode(token);
    } catch (error) {
        //console.error("Error decoding token:", error);
        return null;
    }
}