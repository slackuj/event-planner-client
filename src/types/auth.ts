export interface UserConfirmationRequest  {
    email: string;
    code: string;
}

export interface SendConfirmationCodeRequest  {
    email: string;
}

export interface UserRegisterRequest  {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
}

export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface PasswordUpdateRequest {
    old_password: string;
    new_password: string;
    confirm_new_password: string;
}

export interface UserConfirmationRequest  {
    email: string;
    code: string;
}

export interface UnconfirmedUserResponse {
    email: string;
    expires_at: Date;
    next: "/users/confirm";
    accessToken?: string; // suppresses error/warning in authSlice.ts !!!
}

export interface ConfirmedUserResponse{
    accessToken: string;
    user: {
        id: number;
        name: string;
        email: string;
        profile_picture: string;
        updated_at?: Date;
    };
    next: "/dashboard";
}

export type LoginResponseData  = UnconfirmedUserResponse | ConfirmedUserResponse;

export interface PasswordUpdateResponse {
    accessToken: string;
}

export interface RefreshResponseData {
    accessToken: string;
}

export interface RegisterResponseData {
    email: string;
    expires_at: number;// expiry timestamp
}