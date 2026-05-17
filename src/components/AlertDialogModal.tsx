import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks.ts";
import {
    selectAlertDialogModalActionBtn,
    selectAlertDialogModalContent,
    selectAlertDialogModalTitle, selectIsAlertDialogModalOpen, toggleAlertDialogModal
} from "../store/slices/modalsSlice.ts";
import {useState} from "react";

interface AlertDialogModalProps {
    onConfirm: () => Promise<void>;
}

export const AlertDialogModal = (props: AlertDialogModalProps) => {
    const {onConfirm} = props;
    const dispatch = useAppDispatch();
    const title = useAppSelector(selectAlertDialogModalTitle);
    const content = useAppSelector(selectAlertDialogModalContent);
    const actionBtn = useAppSelector(selectAlertDialogModalActionBtn);
    const isOpen = useAppSelector(selectIsAlertDialogModalOpen);

    const handleClose = () => {
        dispatch(toggleAlertDialogModal({title: undefined, content: undefined, actionBtn: undefined}));
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        await onConfirm();
        setIsLoading(false);
        handleClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>
                <Typography variant="h5" component="span" sx={{ fontWeight: "bold" }}>
                    {title}
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                <Typography color="textSecondary">
                    {content}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleClose} color="inherit" disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="error"
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={24} /> : actionBtn}
                </Button>
            </DialogActions>
        </Dialog>
    );
};