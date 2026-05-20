import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Box, Button, Dialog, DialogContent, DialogTitle,
    TextField, Typography, DialogActions, CircularProgress, Avatar, IconButton, Stack
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {selectIsEditUserModalOpen, toggleAlertDialogModal, toggleEditUserModal} from "../store/slices/modalsSlice.ts";
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks.ts";
import { UpdateUserRequestSchema } from "../schemas/userSchema.ts";
import { toast } from "react-toastify";
import type { UpdateUserRequest } from "../types/user.ts";
import { selectCurrentUserData, useUpdateMeMutation } from "../features/user/userSlice.ts";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { openCloudinaryWidget } from "../utils/cloudinaryUtils.ts";
import { useGetSignatureMutation } from "../features/user/userSlice.ts";
import { AlertDialogModal } from "./AlertDialogModal.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import {REMOVE_PROFILE_PICTURE_DIALOG_MODAL} from "../constants/appConstants.ts";
import {type ChangeEvent, useState} from "react";

export const EditUserModal = () => {
    const dispatch = useAppDispatch();
    const isDialogOpen = useAppSelector(selectIsEditUserModalOpen);
    const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();
    const user = useAppSelector(selectCurrentUserData);
    const [getSignature, { isLoading: isGettingSignature }] = useGetSignatureMutation();

    const [name, setName] = useState(user!.name);
    const { handleSubmit, register, formState: { errors }, reset } = useForm<UpdateUserRequest>({
        resolver: zodResolver(UpdateUserRequestSchema),
    });

    const handleCancel = () => {
        reset();
        dispatch(toggleEditUserModal());
    };

    const onSubmit = async (data: UpdateUserRequest) => {
        try {
            await updateMe(data).unwrap();
            dispatch(toggleEditUserModal());
            toast.success("Profile updated successfully.");
        } catch (err) {
            dispatch(toggleEditUserModal());
            toast.error("Failed Updating Profile!");
        }
    };

    const handleUpload = () => {
        openCloudinaryWidget(getSignature, async (url: string) => {
            try {
                await updateMe({ profile_picture: url }).unwrap();
                toast.success("Profile Picture Updated.");
            } catch (err) {
                toast.error("Failed Updating Profile Picture!");
            }
        });
    };

    const handleRemovingPhoto = async() => {
        try{
            await updateMe({profile_picture: null}).unwrap();
            toast.success("Profile Picture Updated.");
        } catch (err) {
            toast.error("Error Updating Profile Picture!");
        }
    }

    if (!user) return null;

    return (
        <Dialog open={isDialogOpen} onClose={handleCancel} fullWidth maxWidth="xs">
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                    Basic Info
                </Typography>
                <IconButton onClick={handleCancel} sx={{ color: (theme) => theme.palette.grey[500] }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ pt: 1 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                        <Avatar
                            src={user.profile_picture}
                            sx={{
                                width: 100,
                                height: 100,
                                mb: 2,
                                border: '4px solid',
                                borderColor: 'divider'
                            }}
                        />
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="small"
                                startIcon={isGettingSignature ? <CircularProgress size={16} /> : <DriveFolderUploadIcon />}
                                disabled={isUpdating || isGettingSignature}
                                onClick={handleUpload}
                                sx={{ textTransform: 'none', borderRadius: 1.5 }}
                            >
                                Upload new photo
                            </Button>
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="small"
                                startIcon={<DeleteIcon />}
                                disabled={isUpdating || isGettingSignature}
                                onClick={() => dispatch(toggleAlertDialogModal(REMOVE_PROFILE_PICTURE_DIALOG_MODAL))}
                                sx={{ textTransform: 'none', borderRadius: 1.5 }}
                            >
                                Remove photo
                            </Button>
                        </Stack>
                    </Box>

                    <Stack spacing={2.5}>
                        <TextField
                            label="Name"
                            {...register("name")}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            fullWidth
                            size="small"
                            disabled={isUpdating || isGettingSignature}
                            value={name}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                setName(event.target.value);
                            }}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 3, justifyContent: 'flex-end' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isUpdating || isGettingSignature || (name.trim() === user.name)}
                        color="primary"
                    >
                        {isUpdating ? <CircularProgress size={24} color="inherit" /> : "Save"}
                    </Button>
                </DialogActions>
            </form>
            <AlertDialogModal onConfirm={handleRemovingPhoto} />
        </Dialog>
    );
};