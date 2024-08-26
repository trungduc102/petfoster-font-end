/* eslint-disable @next/next/no-img-element */
'use client';
import { WrapperAnimation } from '@/components';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import React, { useMemo } from 'react';
import WraperDialog from '../WraperDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SettingImageDefaultItem from './SettingImageDefaultItem';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebaseService from '@/services/firebaseService';
import { IImageDefaultNotification, INotification } from '@/configs/interface';
import { useAppSelector } from '@/hooks/reduxHooks';
import { RootState } from '@/configs/types';
import SettingConstantNotificationDialogItem from './SettingConstantNotificationDialogItem';

export interface ISettingNotificationDialogProps {
    open: boolean;
    setOpen: (v: boolean) => void;
}

export default function SettingNotificationDialog({ open, setOpen }: ISettingNotificationDialogProps) {
    const [imagesDefaultSnapshop] = useCollection(firebaseService.querys.getImageDefaultNotification());
    const [constantNotificationSnapshot] = useCollection(firebaseService.querys.getAllConstantNotification());

    const { user } = useAppSelector((state: RootState) => state.userReducer);

    // use memo
    const imagesDefault = useMemo(() => {
        if (!imagesDefaultSnapshop) return [];

        return imagesDefaultSnapshop.docs.map((item) => {
            return {
                id: item.id,
                ...item.data(),
            } as IImageDefaultNotification;
        });
    }, [imagesDefaultSnapshop]);

    const dataConstantNotification = useMemo(() => {
        if (!constantNotificationSnapshot) return [];

        return constantNotificationSnapshot.docs.map((item) => {
            return {
                id: item.id,
                ...item.data(),
            } as INotification;
        });
    }, [constantNotificationSnapshot]);

    return (
        <WraperDialog
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '20px',
                },
            }}
            fullWidth={true}
            maxWidth={'md'}
            open={open}
            setOpen={setOpen}
        >
            <div className="scroll ">
                <div className="flex items-center justify-between py-6 mx-7 border-b border-gray-primary">
                    <span className="text-xl font-semibold">SETTINGS NOTIFICATION</span>
                    <WrapperAnimation onClick={() => setOpen(false)} className="cursor-pointer">
                        <FontAwesomeIcon icon={faXmark} />
                    </WrapperAnimation>
                </div>

                <div className="px-7 py-5 flex flex-col gap-4">
                    <h2 className="text-1xl font-medium">Images default</h2>

                    <div className="flex flex-col gap-8">
                        {imagesDefault.map((item) => {
                            return <SettingImageDefaultItem key={item.id} data={item} />;
                        })}
                    </div>
                </div>

                <div className="px-7 py-5 flex flex-col gap-4">
                    <h2 className="text-1xl font-medium">Automatic notification</h2>

                    {dataConstantNotification.map((item) => {
                        return <SettingConstantNotificationDialogItem data={item} user={user} key={item.id} />;
                    })}
                </div>
            </div>
        </WraperDialog>
    );
}
