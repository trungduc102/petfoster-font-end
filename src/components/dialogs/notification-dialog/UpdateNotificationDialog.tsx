/* eslint-disable @next/next/no-img-element */
'use client';
import React, { ChangeEvent, FocusEvent, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import WraperDialog from '../WraperDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faL, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AddRecipient, Comfirm, TextArea, TextField, WrapperAnimation } from '../..';
import classNames from 'classnames';
import ImageViewer from 'react-simple-image-viewer';
import { RootState, TypeNotification } from '@/configs/types';
import { NotificationPageItem } from '../../pages';
import { useAppSelector } from '@/hooks/reduxHooks';
import { IImageDefaultNotification, INotification, IUserFirebase } from '@/configs/interface';
import Validate from '@/utils/validate';
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore';
import firebaseService from '@/services/firebaseService';
import { uploadImagesNotification } from '@/apis/admin/images';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';
import { useGetNotification } from '@/hooks';
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { paseDataNotification, paseDataNotificationPreview } from '@/utils/format';
import ColorItem from './ColorItem';

const typesArr = ['none', 'success', 'error', 'warning', 'info'];

const recipientArr = [
    {
        id: 0,
        title: 'All',
    },
    {
        id: 1,
        title: 'Add recipient',
    },
];

const initData: TypeForm = {
    title: '',
    link: '',
    message: '',
};

type TypeForm = {
    title: string;
    link: string;
    message: string;
    adminMessage?: string;
};

export interface IUpdateNotificationDialogProps {
    idOpen?: string;
    open: boolean;
    options?: {
        queryFn?: (notificationId: string) => Promise<DocumentSnapshot<DocumentData, DocumentData> | undefined>;
        conllectionName?: string;
    };
    disableRecipient?: boolean;
    disableImageDefault?: boolean;
    disableDeleteButton?: boolean;
    disableAdvanced?: boolean;
    disableLink?: boolean;
    setOpen: (open: boolean) => void;
}

export default function UpdateNotificationDialog({
    idOpen,
    open,
    options,
    disableImageDefault = false,
    disableRecipient = false,
    disableDeleteButton = false,
    disableAdvanced = true,
    disableLink = false,
    setOpen,
}: IUpdateNotificationDialogProps) {
    // redux
    const { user } = useAppSelector((state: RootState) => state.userReducer);

    // firebase
    const [imagesDefaultSnapshop, loading] = useCollection(firebaseService.querys.getImageDefaultNotification());

    const dataNotification = useGetNotification(idOpen, options);

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

    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [positionText, setPositionText] = useState<{ start: undefined | number; end: undefined | number }>({ start: undefined, end: undefined });

    const [recipients, setRecipients] = useState<string[]>([]);

    const [typeNotification, setTypeNotification] = useState<TypeNotification>(typesArr[0] as TypeNotification);

    // default
    const [form, setForm] = useState<TypeForm>(initData);
    const [photo, setPhoto] = useState<IImageDefaultNotification | undefined>(undefined);
    const [errors, setErrors] = useState({ ...initData });
    const [keys, setKeys] = useState(dataNotification?.meta?.keys);

    // confirm
    const [openComfirm, setOpenComfirm] = useState({ open: false, comfirm: 'cancel' });
    const [openComfirmDelete, setOpenComfirmDelete] = useState({ open: false, comfirm: 'cancel' });

    // when push
    const [typeRecipient, setTypeRecipient] = useState({
        id: 0,
        title: 'All',
    });

    // use effect

    useEffect(() => {
        const curPhoto = imagesDefault.find((item) => item.type === typeNotification);
        if (!curPhoto) {
            return;
        }
        setPhoto(curPhoto);
    }, [typeNotification, imagesDefault, dataNotification]);

    useEffect(() => {
        // clear memory
        return () => {
            if (!photo?.file) return;
            URL.revokeObjectURL(photo.photourl);
        };
    }, [photo]);

    useEffect(() => {
        if (!dataNotification) return;

        setForm({
            link: dataNotification.link ? dataNotification.link : '',
            message: dataNotification.content,
            title: dataNotification.title,
            adminMessage: dataNotification.adminCotent,
        });

        setTypeNotification(dataNotification.type);

        if (dataNotification.target && dataNotification.target.length > 0 && dataNotification.target[0] !== 'all') {
            setTypeRecipient(recipientArr[1]);

            setRecipients(dataNotification.target);
        }

        requestIdleCallback(() => {
            setPhoto({
                id: dataNotification.photourl,
                createdAt: new Date(),
                updatedAt: new Date(),
                photourl: dataNotification.photourl,
                type: dataNotification.type,
            });
            if (!dataNotification || !dataNotification.meta || !dataNotification.meta.keys) return;

            setKeys(dataNotification.meta.keys);
        });

        if (!dataNotification.options || !dataNotification.options.end || !dataNotification.options.start) return;

        setPositionText({
            start: dataNotification.options.end,
            end: dataNotification.options.start,
        });
    }, [dataNotification]);

    const openImageViewer = useCallback((index: number) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

    const handleChooseTypeRecipient = (item: { id: number; title: string }) => {
        setTypeRecipient(item);

        if (item.id === recipientArr[0].id) {
            setRecipients([recipientArr[0].title.toLowerCase()]);
        }
    };

    const handleComfirm = async (v: { open: boolean; comfirm: 'cancel' | 'ok' }) => {
        if (v.open || v.comfirm === 'cancel') return;

        await handleSubmit();
    };

    const handleComfirmDelete = async (v: { open: boolean; comfirm: 'cancel' | 'ok' }) => {
        if (v.open || v.comfirm === 'cancel') return;

        await handleDeleteNotification();
    };

    const handleDeleteNotification = async () => {
        if (!dataNotification) return;

        await firebaseService.deleteNotification(dataNotification.id);

        setOpen(false);
    };

    const handleCloseRecipient = (e: MouseEvent<HTMLDivElement>, data: string) => {
        e.stopPropagation();

        const newData = recipients.filter((item) => item !== data);

        setRecipients(newData);

        if (newData.length <= 0) {
            setTypeRecipient(recipientArr[0]);
        }
    };

    const handleChooseTypeNotificaiton = (data: TypeNotification) => {
        setTypeNotification(data);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleChangeImageFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (!file) return;

        setPhoto({
            id: file.name,
            createdAt: new Date(),
            photourl: URL.createObjectURL(file),
            updatedAt: new Date(),
            type: typeNotification,
            file: file,
        });
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const dynamicKey = e.target.name as keyof TypeForm;

        if (dynamicKey === 'adminMessage') {
            // do somehting
        } else {
            const { message } = Validate[dynamicKey](e.target.value);
            setErrors({
                ...errors,
                [dynamicKey]: message,
            });
        }
    };

    const handleSubmit = async () => {
        if (validate()) return;

        const meta: INotification['meta'] = {};

        if (keys && keys.length) {
            meta.keys = keys;
        }

        if (photo?.file) {
            try {
                const response = await uploadImagesNotification([{ link: photo.photourl, data: photo.file }]);

                if (!response || response.errors) {
                    toast.warning(contants.messages.errors.handle);
                    return;
                }

                await firebaseService.setNotification({
                    id: dataNotification?.id || '',
                    content: form.message,
                    createdAt: new Date(),
                    deleted: false,
                    link: form.link,
                    photourl: response.data[0] || '',
                    read: [],
                    target: recipients,
                    title: form.title,
                    type: typeNotification,
                    options: {
                        ...positionText,
                    },
                    ...meta,
                    adminCotent: form.adminMessage ? form.adminMessage : form.message,
                });
            } catch (error) {
                toast.error(contants.messages.errors.server);
            }

            // close dialog
            setOpen(false);

            return;
        }

        await firebaseService.setNotification(
            {
                id: dataNotification?.id || '',
                content: form.message,
                createdAt: new Date(),
                deleted: false,
                link: form.link,
                photourl: photo?.photourl || '',
                read: [],
                target: recipients,
                title: form.title,
                type: typeNotification,
                options: {
                    ...positionText,
                },
                meta: {
                    ...meta,
                },
                adminCotent: form.adminMessage ? form.adminMessage : form.message,
            },
            options?.conllectionName,
        );

        // close dialog
        setOpen(false);
    };

    const handleSetPhoto = (item: IImageDefaultNotification) => {
        setPhoto(item);
    };

    const handleSelected = (start: number | undefined, end: number | undefined) => {
        if (!start || !end) return;

        setPositionText({
            start,
            end,
        });
    };

    const handleClearSelectText = () => {
        setPositionText({
            start: undefined,
            end: undefined,
        });
    };

    const handleOpenConfirm = () => {
        setOpenComfirm({ ...openComfirm, open: true });
    };

    const handleOpenConfirmDelete = () => {
        setOpenComfirmDelete({ ...openComfirm, open: true });
    };

    const validate = () => {
        let flag = false;
        const errorArr: boolean[] = [];
        const validateErrors: TypeForm = { ...initData };

        const keys: string[] = Object.keys(validateErrors);

        keys.forEach((key) => {
            const dynamic = key as keyof TypeForm;

            if (dynamic !== 'adminMessage') {
                const { message, error } = Validate[dynamic](form[dynamic].toString());
                validateErrors[dynamic] = message;
                errorArr.push(error);
            }
        });

        setErrors(validateErrors);

        return errorArr.some((i) => i);
    };

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
            <div className="scroll">
                <div className="flex items-center justify-between py-6 mx-7 border-b border-gray-primary">
                    <span className="text-xl font-semibold">PUSH NOTIFICATION</span>
                    <div className="flex items-center gap-8">
                        {!disableDeleteButton && (
                            <WrapperAnimation
                                hover={{}}
                                onClick={handleOpenConfirmDelete}
                                className={classNames('rounded-2xl border  text-sm py-2 px-4 cursor-pointer font-semibold capitalize min-w-[80px] text-center', {
                                    [`border-[#EF4444]`]: true,

                                    [`bg-[#FADCD9]`]: true,
                                })}
                            >
                                delete
                            </WrapperAnimation>
                        )}

                        <WrapperAnimation onClick={() => setOpen(false)} className="cursor-pointer">
                            <FontAwesomeIcon icon={faXmark} />
                        </WrapperAnimation>
                    </div>
                </div>
                <div className="px-7 py-8 flex flex-col gap-7">
                    <div className="flex items-center gap-5">
                        <span className="text-1xl font-medium">Type: </span>
                        <div className="flex items-center gap-4">
                            {typesArr.map((item) => {
                                return (
                                    <WrapperAnimation
                                        onClick={() => handleChooseTypeNotificaiton(item as TypeNotification)}
                                        key={item}
                                        hover={{}}
                                        className={classNames('rounded-2xl border  text-sm py-2 px-4 cursor-pointer font-semibold capitalize min-w-[80px] text-center', {
                                            [`border-[#EF4444]`]: (item as TypeNotification) === 'error',
                                            [`border-[#65A30D]`]: (item as TypeNotification) === 'success',
                                            [`border-[#fdae61]`]: (item as TypeNotification) === 'warning',
                                            [`border-[#505DE8]`]: (item as TypeNotification) === 'info',
                                            [`bg-[#FADCD9]`]: (item as TypeNotification) === typeNotification,
                                        })}
                                    >
                                        {item}
                                    </WrapperAnimation>
                                );
                            })}
                        </div>
                    </div>
                    {!disableRecipient && (
                        <div className="flex items-center gap-5">
                            <span className="text-1xl font-medium">Recipient: </span>

                            <div className="flex items-center gap-4 flex-wrap">
                                {recipientArr.map((item, index) => {
                                    return (
                                        <WrapperAnimation
                                            onClick={(e) => handleChooseTypeRecipient(item)}
                                            key={item.id}
                                            hover={{}}
                                            className={classNames('rounded-2xl border  text-sm py-2 px-4 cursor-pointer font-semibold min-w-[80px] text-center', {
                                                'border-[#505DE8]': typeRecipient.id === index,
                                            })}
                                        >
                                            {item.title}
                                        </WrapperAnimation>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {typeRecipient.id !== 0 && !disableRecipient && (
                        <div className="flex items-center ">
                            <div className="flex flex-1 items-center gap-4 w-full flex-wrap">
                                {recipients.map((item, index) => {
                                    return (
                                        <WrapperAnimation
                                            key={item}
                                            hover={{}}
                                            className={classNames(
                                                'rounded-2xl border flex items-center justify-between gap-2 text-sm py-2 px-4 cursor-pointer font-semibold min-w-[80px] text-center max-w-[200px]',
                                            )}
                                        >
                                            <p className="flex-1 truncate">{item}</p>

                                            <WrapperAnimation
                                                onClick={(e) => handleCloseRecipient(e, item)}
                                                className="flex p-2 w-5 h-5 rounded-full hover:bg-gray-300 transition-all ease-linear items-center justify-center"
                                            >
                                                <FontAwesomeIcon icon={faXmark} />
                                            </WrapperAnimation>
                                        </WrapperAnimation>
                                    );
                                })}

                                <AddRecipient
                                    onUser={(user) => {
                                        const isExistUser = recipients.some((item) => item === user.username);

                                        if (isExistUser) return;

                                        setRecipients([...recipients, user.username]);
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col justify-between gap-2">
                        <span className='className="text-1xl font-medium"'>Title: </span>
                        <TextField
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={form.title}
                            message={errors.title}
                            id="title"
                            name="title"
                            fullWidth
                            size="small"
                            placeholder="Title..."
                        />
                    </div>
                    {!disableLink && (
                        <div className="flex flex-col justify-between gap-2">
                            <span className='className="text-1xl font-medium"'>Link: </span>
                            <TextField
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={form.link}
                                message={errors.link}
                                id="link"
                                name="link"
                                fullWidth
                                size="small"
                                placeholder="Link..."
                            />
                        </div>
                    )}
                    <div className="flex flex-col justify-between gap-2">
                        <div className="flex items-center gap-2">
                            {disableAdvanced && (
                                <>
                                    <span className='className="text-1xl font-medium"'>Message: </span>
                                    <small className="text-gray-400 italic text-sm">You can select the text to highlight according to the style you have chosen</small>
                                </>
                            )}

                            {!disableAdvanced && (
                                <div className="flex flex-col">
                                    <span className='className="text-1xl font-medium"'>Message: </span>
                                    <ul className="list-disc pl-5 flex flex-col gap-2">
                                        <li className="text-gray-400 italic text-sm flex items-center gap-2">
                                            <span>You can select the text to highlight according to the style you have chosen</span>
                                            <small onClick={handleClearSelectText} className="text-fill-heart hover:underline text-sm cursor-pointer">
                                                cancel
                                            </small>
                                        </li>

                                        {dataNotification?.meta &&
                                            dataNotification.meta.keys &&
                                            dataNotification.meta.keys.map((item) => {
                                                return (
                                                    <ColorItem
                                                        onColor={(data) => {
                                                            if (!keys) return;

                                                            let dataFound = keys.find((i) => data.name === i.name);

                                                            if (!dataFound) return;

                                                            dataFound.color = data.color;
                                                        }}
                                                        key={item.name}
                                                        item={item}
                                                    />
                                                );
                                            })}
                                    </ul>
                                </div>
                            )}
                            {positionText.end && positionText.start && typeNotification !== 'none' && disableAdvanced && (
                                <small onClick={handleClearSelectText} className="text-fill-heart hover:underline text-sm cursor-pointer">
                                    cancel
                                </small>
                            )}
                        </div>
                        <TextArea
                            onSelected={handleSelected}
                            spellCheck={false}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={form.message}
                            id="message"
                            name="message"
                            message={errors.message}
                            placeholder="Type your message here..."
                            rangeSelect={positionText}
                        />
                        {!disableAdvanced && (
                            <>
                                <span className='className="text-1xl font-medium"'>Message admin: </span>
                                <TextArea
                                    onSelected={handleSelected}
                                    spellCheck={false}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={form.adminMessage}
                                    id="admin-message"
                                    name="adminMessage"
                                    message={errors.adminMessage}
                                    placeholder="Type your admin message here..."
                                    rangeSelect={positionText}
                                />
                            </>
                        )}
                    </div>
                    {!disableImageDefault && (
                        <div className="flex items-center gap-5">
                            <span className='className="text-1xl font-medium"'>Images: </span>

                            <div className="flex items-center gap-4">
                                {imagesDefault.map((item, index) => {
                                    return (
                                        <img
                                            className={classNames('w-[80px] h-[80px] border-2 object-cover rounded-lg cursor-pointer hover:scale-105 transition-all ease-linear', {
                                                ['border-[#505DE8]']: photo?.id === item.id,
                                            })}
                                            onClick={(e) => handleSetPhoto(item)}
                                            onDoubleClick={() => openImageViewer(index)}
                                            key={item.type}
                                            alt={item.photourl}
                                            src={item.photourl}
                                        />
                                    );
                                })}

                                <WrapperAnimation hover={{}}>
                                    <label
                                        className="border-dashed border-2 rounded-lg flex items-center justify-center border-[#505DE8] text-[#505DE8] py-4 px-5 cursor-pointer font-semibold text-1xl"
                                        htmlFor="input-image-notification"
                                    >
                                        <span>SELECT AN IMAGE</span>
                                    </label>
                                </WrapperAnimation>
                                <input onChange={handleChangeImageFile} id="input-image-notification" type="file" hidden />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col items-start gap-5">
                        <span className="text-1xl font-medium">Preview: </span>
                        <NotificationPageItem
                            options={{
                                disable: true,
                                active: true,
                            }}
                            user={user}
                            data={{
                                id: 'previewid',
                                content:
                                    dataNotification?.meta && dataNotification.meta.keys ? paseDataNotificationPreview(form.message, dataNotification.meta.keys) : form.message,
                                createdAt: new Date(),
                                deleted: false,
                                link: form.link,
                                photourl: photo?.photourl || '',
                                read: [],
                                target: ['all'],
                                title: form.title,
                                type: typeNotification,
                                options: {
                                    ...positionText,
                                },
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-center w-full">
                        <WrapperAnimation
                            onClick={handleOpenConfirm}
                            hover={{}}
                            className="uppercase py-2 w-2/3 bg-[#505DE8] rounded-lg font-medium text-1xl text-white text-center cursor-pointer"
                        >
                            {'edit'}
                        </WrapperAnimation>
                    </div>
                </div>

                {isViewerOpen && dataNotification && (
                    <ImageViewer src={[dataNotification.photourl]} currentIndex={currentImage} disableScroll={false} closeOnClickOutside={true} onClose={closeImageViewer} />
                )}

                {dataNotification && (
                    <Comfirm
                        title={'Notification'}
                        subtitle={
                            <>
                                {`Are want to update #`}
                                {<b>{dataNotification?.title}</b>}
                            </>
                        }
                        open={openComfirm.open}
                        setOpen={setOpenComfirm}
                        onComfirm={handleComfirm}
                    />
                )}

                {dataNotification && (
                    <Comfirm
                        title={'Notification'}
                        subtitle={
                            <>
                                {`Are want to delete #`}
                                {<b>{dataNotification?.title}</b>}
                            </>
                        }
                        open={openComfirmDelete.open}
                        setOpen={setOpenComfirmDelete}
                        onComfirm={handleComfirmDelete}
                    />
                )}
            </div>
        </WraperDialog>
    );
}
