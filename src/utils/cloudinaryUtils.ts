import {config} from "../config.ts";

export const openCloudinaryWidget = (
    getSignature: any, // The trigger function from RTK Query
    onSuccess: (url: string) => void
) => {
    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
        {
            cloudName: config.CLOUDINARY_CLOUD_NAME,
            apiKey: config.CLOUDINARY_API_KEY,
            source: 'uw',
            folder: 'assets',
            resourceType: 'auto', // Detects if it's image or video automatically
            clientAllowedFormats: ['mp4', 'mov', 'avi', 'jpg', 'png'], // Allowed extensions
            // Wrap the RTK Query trigger in the callback the widget expects
            uploadSignature: async (callback: any) => {
                try {
                    // unwrap() allows us to get the raw string result or catch the error
                    const signature = await getSignature().unwrap();
                    callback(signature);
                } catch (err) {
                    console.error("Signature generation failed:", err);
                }
            },
        },
        (error: any, result: any) => {
            if (!error && result && result.event === "success") {
                onSuccess(result.info.secure_url);
            }
        }
    );

    widget.open();
};