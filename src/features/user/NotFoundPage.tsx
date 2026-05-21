import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import SearchOffIcon from '@mui/icons-material/SearchOff';
import {useModalGuard} from "../../hooks/eventHooks.ts";

export const ResourceNotFound = () => {
    useModalGuard();
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{
                    maxWidth: 450,
                    mx: 'auto',
                    mt: '15%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 3
                }}>
                    <SearchOffIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />

                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        404 - Page Not Found
                    </Typography>

                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                        The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            color="primary"
                            onClick={() => navigate("/events/my-day")}
                        >
                            Return to Home
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};