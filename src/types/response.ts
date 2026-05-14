export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string | null;
    meta: any | null;
}

export interface ApiErrorResponse {
    success: false;
    data: null;
    message: string| null;
    error: any | null;
}

// getUsers endpoint fetches incomplete user data
// MAY BE MODIFY IT TO HOLD EVENTS !!??
export interface Users {
    id: string; // ObjectId
    name: string; // user name
    email: string; // email address
    profilePicture: string; // profile picture url
    points: number;
}