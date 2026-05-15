export const config = {
    apiBaseURI: import.meta.env.VITE_API_BASE_URI,
    endpoints: {
        cloudinarySignature: "/cloudinary/signature",
        login: "/auth/login",
        logout: "/auth/logout",
        register: "/auth/register",
        refresh: "/auth/refresh",
        confirm: "/auth/confirm",
        resendConfirmationCode: "/auth/resend-code",
        updatePassword: "/auth/update-password",
        users: "/users",
        me: "/users/me",
        events: "/events",
    },
    CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY,
};