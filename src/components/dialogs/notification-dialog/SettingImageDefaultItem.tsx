/* eslint-disable @next/next/no-img-element */
'use client';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Comfirm, WraperTippy, WrapperAnimation } from '@/components';
import { IImageDefaultNotification } from '@/configs/interface';
import { TypeNotification } from '@/configs/types';
import { convertFirestoreTimestampToString } from '@/utils/format';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadImagesNotification } from '@/apis/admin/images';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';
import firebaseService from '@/services/firebaseService';

export interface ISettingImageDefaultItemProps {
    data: IImageDefaultNotification;
}

export default function SettingImageDefaultItem({ data }: ISettingImageDefaultItemProps) {
    const [openInfo, setOpenInfo] = useState(false);

    const [photo, setPhoto] = useState<{ url: string; file?: File }>({ url: data.photourl });

    const handleToggleInfo = () => {
        setOpenInfo((prev) => !prev);
    };

    const handleChangePhoto = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (!file) return;

        setPhoto({ url: URL.createObjectURL(file), file });
    };

    const handleUpdate = async () => {
        if (!photo?.file) return;

        try {
            const response = await uploadImagesNotification([{ link: photo.url, data: photo.file }]);

            if (!response || response.errors || response.data.length <= 0) {
                toast.warning(contants.messages.errors.handle);
                return;
            }

            await firebaseService.setImageDefaultNotification({ ...data, photourl: response.data[0] });

            toast.success('Update Successfuly !');
        } catch (error) {
            toast.error(contants.messages.errors.server);
        }
    };

    useEffect(() => {
        return () => {
            if (!photo.file) return;

            URL.revokeObjectURL(photo.url);
        };
    }, [photo]);

    useEffect(() => {
        setPhoto({
            url: data.photourl,
            file: data.file,
        });
    }, [data]);

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-4 w-1/3 border-b border-gray-primary pb-4">
                <div className="flex items-center justify-between w-full pr-7 cursor-pointer">
                    <WrapperAnimation
                        hover={{}}
                        className={classNames('rounded-2xl border  text-sm py-2 px-4 cursor-pointer font-semibold capitalize min-w-[80px] max-w-[100px] text-center', {
                            [`border-[#EF4444]`]: (data.type as TypeNotification) === 'error',
                            [`border-[#65A30D]`]: (data.type as TypeNotification) === 'success',
                            [`border-[#fdae61]`]: (data.type as TypeNotification) === 'warning',
                            [`border-[#505DE8]`]: (data.type as TypeNotification) === 'info',
                        })}
                    >
                        {data.type}
                    </WrapperAnimation>

                    <WrapperAnimation onClick={handleToggleInfo} className="flex items-center justify-center">
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </WrapperAnimation>
                </div>

                <div className="flex items-center gap-4">
                    <img
                        className={classNames('w-[80px] h-[80px] border-2 object-cover rounded-lg cursor-pointer hover:scale-105 transition-all ease-linear')}
                        alt={photo.url}
                        src={photo.url}
                    />
                    <label
                        htmlFor={`input-image-default-${data.id}`}
                        className={classNames(
                            'w-[80px] h-[80px] border-2 object-cover rounded-lg cursor-pointer hover:scale-105 transition-all ease-linear flex items-center justify-center',
                        )}
                    >
                        <FontAwesomeIcon className="text-gray-400" icon={faPenToSquare} />
                    </label>

                    <input onChange={handleChangePhoto} id={`input-image-default-${data.id}`} type="file" hidden />
                </div>

                {photo.url != data.photourl && (
                    <WrapperAnimation hover={{}} onClick={handleUpdate} className="px-4 py-1 rounded-lg bg-[#505DE8] text-white font-semibold text-sm cursor-pointer">
                        OK
                    </WrapperAnimation>
                )}
            </div>

            <AnimatePresence>
                {openInfo && (
                    <motion.ul
                        initial={{
                            x: -100,
                            opacity: 0,
                        }}
                        animate={{
                            x: 0,
                            opacity: 1,
                        }}
                        exit={{
                            x: -100,
                            opacity: 0,
                        }}
                        className="w-2/3 border-l border-gray-primary px-7 text-black-main font-medium flex flex-col gap-3 text-1xl"
                    >
                        <li className="flex items-center gap-2">
                            <span>Id: </span>
                            <p>{data.id}</p>
                        </li>
                        <li className="flex items-center gap-2 capitalize">
                            <span>Type: </span>
                            <p>{data.type}</p>
                        </li>
                        <li className="flex items-center gap-2">
                            <span>Created at: </span>
                            <p>{moment(data.createdAt instanceof Date ? data.createdAt : convertFirestoreTimestampToString(data.createdAt)).format('dd/MM/yyyy')}</p>
                        </li>
                        <li className="flex items-center gap-2">
                            <span>Updated at: </span>
                            <p>{moment(data.updatedAt instanceof Date ? data.updatedAt : convertFirestoreTimestampToString(data.updatedAt)).format('dd/MM/yyyy')}</p>
                        </li>
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}
