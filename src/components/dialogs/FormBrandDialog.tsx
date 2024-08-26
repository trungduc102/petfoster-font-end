'use client';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import WraperDialog from './WraperDialog';
import { NativeConfirm, TextField, WrapperAnimation } from '..';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { IBrand } from '@/configs/interface';
import Validate from '@/utils/validate';
import { createBrand, deleteBrand, updateBrand } from '@/apis/admin/brand';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';

export interface IFormBrandDialogProps {
    open: boolean;
    initData?: IBrand;
    setOpen: (open: boolean) => void;
    onAfterSubmit?: () => void;
}

export default function FormBrandDialog({ open, initData, setOpen, onAfterSubmit }: IFormBrandDialogProps) {
    const [name, setName] = useState(initData ? initData.brand : '');
    const [update, setUpdate] = useState(false);
    const [isDelete, setIsDelete] = useState(false);

    const [error, setError] = useState('');

    const handleClose = () => {
        setOpen(false);
        setName('');
        setError('');
    };

    const handleSubmit = async () => {
        if (validate()) return;

        try {
            if (!initData) {
                const response = await createBrand({ id: 0, brand: name });

                if (!response) {
                    toast.warn(contants.messages.errors.handle);
                    return;
                }

                if (response.errors) {
                    toast.error(response.message);
                    return;
                }

                toast.success('Create success a new brand.');
                handleClose();

                if (!onAfterSubmit) return;
                onAfterSubmit();
            } else {
                setUpdate(true);
            }
        } catch (error) {
            toast.error(contants.messages.errors.server);
        }
    };

    const handleUpdate = async () => {
        try {
            if (!initData) return;

            const response = await updateBrand({ ...initData, brand: name });

            if (!response) {
                toast.warn(contants.messages.errors.handle);
                return;
            }

            if (response.errors) {
                toast.error(response.message);
                return;
            }

            toast.success('Update success ' + initData.brand);
            handleClose();

            if (!onAfterSubmit) return;
            onAfterSubmit();
        } catch (error) {
            toast.error(contants.messages.errors.server);
        } finally {
            setUpdate(false);
        }
    };

    const handleDelete = async () => {
        try {
            if (!initData) return;

            const response = await deleteBrand({ ...initData });

            if (!response) {
                toast.warn(contants.messages.errors.handle);
                return;
            }

            if (response.errors) {
                toast.error(response.message);
                return;
            }

            toast.success('Delete success ' + initData.brand);
            handleClose();

            if (!onAfterSubmit) return;
            onAfterSubmit();
        } catch (error) {
            toast.error(contants.messages.errors.server);
        } finally {
            setIsDelete(false);
        }
    };

    const validate = () => {
        const { error, message } = Validate.brand(name);

        setError(message);

        return error;
    };

    useEffect(() => {
        if (!initData) return;

        setName(initData.brand);
    }, [initData]);

    return (
        <WraperDialog
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '18px',
                },
            }}
            fullWidth={true}
            maxWidth="sm"
            open={open}
            setOpen={setOpen}
        >
            <div className="py-6 px-8 relative">
                <h4 className="text-xl text-[#303B4E] font-semibold mb-5">Brand</h4>

                <div className="w-full flex flex-col items-center justify-center mt-5 gap-5">
                    <TextField message={error} value={name} onBlur={validate} onChange={(e) => setName(e.target.value)} label={'Name'} size="small" />

                    <div className="w-full flex items-center justify-end gap-4">
                        {initData && (
                            <span onClick={() => setIsDelete(true)} className="text-red-primary hover:underline text-sm cursor-pointer">
                                Delete brand
                            </span>
                        )}
                        <WrapperAnimation
                            onClick={handleSubmit}
                            hover={{}}
                            className="flex items-center justify-center text-white bg-[#666666] rounded-lg py-1 px-10 uppercase font-medium"
                        >
                            <span>{!initData ? 'Create' : 'Update'}</span>
                        </WrapperAnimation>
                    </div>
                </div>

                <WrapperAnimation onClick={handleClose} hover={{}} className="absolute top-0 right-0 flex items-center justify-center text-lg p-5 cursor-pointer">
                    <FontAwesomeIcon icon={faXmark} />
                </WrapperAnimation>
            </div>

            {update && (
                <NativeConfirm
                    onClose={() => setUpdate(false)}
                    title="Notifycation"
                    subtitle={
                        <>
                            <span>
                                Are you want to update <b>{initData?.brand}</b>
                            </span>
                        </>
                    }
                    handleSubmit={handleUpdate}
                />
            )}

            {isDelete && (
                <NativeConfirm
                    onClose={() => {
                        setUpdate(false);
                        setIsDelete(false);
                    }}
                    title="Notifycation"
                    subtitle={
                        <>
                            <span>
                                Are you want to delete <b className="text-red-primary">{initData?.brand}</b>
                            </span>
                        </>
                    }
                    handleSubmit={handleDelete}
                />
            )}
        </WraperDialog>
    );
}
