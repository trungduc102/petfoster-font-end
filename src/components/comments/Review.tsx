/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
'use client';
import React, { Fragment, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { IReviewHasReplay } from '@/configs/interface';
import { contants } from '@/utils/contants';
import { toGam } from '@/utils/format';
import { Rating } from '@mui/material';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons';
import { faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { deleteReview, replayReview } from '@/apis/admin/reviews';
import Validate from '@/utils/validate';
import { toast } from 'react-toastify';
import NativeComfirm from '../inputs/NativeConfirm';
import { EmojiPicker, WrapperAnimation } from '..';
import { EmojiClickData } from 'emoji-picker-react';

export interface IReviewProps {
    data: IReviewHasReplay;
    option?: {
        replay?: boolean;
        delete?: boolean;
        item?: boolean;
        adminAvatar?: string;
        adminName?: string;
    };
    handleAfterReplay?: (data: IReviewHasReplay) => void;
    handleAffterDelete?: () => void;
}

export default function Review({ data, option, handleAfterReplay, handleAffterDelete }: IReviewProps) {
    const [open, setOpen] = useState(false);
    const [openComfirm, setOpenComfirm] = useState(false);

    const [text, setText] = useState('');

    const refInput = useRef<HTMLTextAreaElement>(null);

    const handleFormatSizes = () => {
        if (!data.sizes) return '';

        const strSizes = data.sizes.map((item) => {
            return toGam(item);
        });
        return strSizes.join(', ');
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleClear = () => {
        if (!refInput.current) return;

        refInput.current.innerHTML = '';
        handleClose();
    };

    const handleSendMessage = async () => {
        if (!refInput.current || Validate.isBlank(refInput.current?.value)) return;

        try {
            const response = await replayReview({ ...data, comment: refInput.current?.value });

            if (!response || response.errors) {
                toast.warn(contants.messages.errors.handle);
                return;
            }

            handleClear();

            if (!handleAfterReplay) return;

            handleAfterReplay({ ...data, id: response.data.id, comment: response.data.comment, replayItems: null, rating: null, sizes: null });
        } catch (error) {
            toast.error(contants.messages.errors.server);
        }
    };

    const handleEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key !== 'Enter') return;
        handleSendMessage();
    };

    const handleOpenComfirm = () => {
        setOpenComfirm(true);
    };

    const handleDelete = async () => {
        try {
            const response = await deleteReview({ ...data });
            if (!response || response.errors) {
                toast.warn(contants.messages.errors.handle);
                return;
            }

            if (!handleAffterDelete) return;
            handleAffterDelete();
        } catch (error) {
            toast.error(contants.messages.errors.server);
        }
    };

    const handleAddIcon = (emojiObject: EmojiClickData, event: MouseEvent) => {
        if (!refInput.current) return;

        refInput.current.value += emojiObject.emoji;
    };

    return (
        <div className="text-black-main w-full max-w-full">
            <div
                className={classNames('flex justify-between text-black-main border rounded-md', {
                    'ml-5': option?.item,
                })}
            >
                <div className="p-3">
                    <div className="flex gap-3 items-start">
                        <img
                            src={data.avatar || contants.avartarDefault}
                            className={classNames(' w-10 h-10 rounded-full ', {
                                ['object-cover']: !option?.item,
                            })}
                        />
                        <div className="flex flex-col">
                            <h3 className="font-semibold">{data.displayName || data.name}</h3>
                            {data.rating && data.sizes ? (
                                <div className="flex items-center gap-4">
                                    <Rating
                                        sx={{
                                            '& .MuiSvgIcon-root': {
                                                fontSize: '16px',
                                            },
                                        }}
                                        name="read-only"
                                        value={data.rating}
                                        readOnly
                                    />

                                    <span className="text-sm italic text-grey-secondary">Size: {handleFormatSizes()}</span>
                                </div>
                            ) : (
                                ''
                            )}
                            <p className=" mt-2 text-sm">{data.comment}</p>
                            <div className="flex items-center gap-2">
                                {option?.delete && (
                                    <span onClick={handleOpenComfirm} className="text-left text-red-primary hover:underline text-sm cursor-pointer mt-2 select-none">
                                        Delete
                                    </span>
                                )}
                                {option?.replay && (
                                    <span onClick={handleOpen} className="text-left text-red-primary hover:underline text-sm cursor-pointer mt-2 select-none">
                                        Reply
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={classNames('flex flex-col  gap-3 pr-3 py-3 text-sm text-grey-secondary', {
                        'items-end': !option?.item,
                    })}
                >
                    <span>{data.createAt}</span>
                </div>
            </div>

            {data.replayItems &&
                data.replayItems.length > 0 &&
                data.replayItems.map((comment, index) => {
                    return (
                        <Fragment key={comment.id + 'replay' + index + comment.comment}>
                            <div className="text-gray-300 font-bold pl-14">|</div>

                            <Review
                                handleAffterDelete={handleAffterDelete}
                                data={{ ...comment, avatar: option?.adminAvatar || contants.avartarAdminDefault, name: option?.adminName || contants.shopName }}
                                option={{ item: true, delete: option?.delete }}
                            />
                        </Fragment>
                    );
                })}

            <AnimatePresence>
                {option?.replay && open && (
                    <>
                        <div className="text-gray-300 font-bold pl-14">|</div>
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            className="p-3 flex items-center border rounded-md w-fit"
                        >
                            <div className="flex gap-3 items-start">
                                <img src={contants.avartarAdminDefault} className="object-cover w-10 h-10 rounded-full " />
                                <div className="flex flex-col relative">
                                    <textarea
                                        spellCheck={false}
                                        onKeyDown={handleEnter}
                                        ref={refInput}
                                        placeholder="Your message..."
                                        className="text-sm resize-none border border-gray-primary rounded outline-none p-2 min-h-[100px]"
                                        cols={100}
                                    />
                                    <div className="flex items-center justify-end mt-0">
                                        <EmojiPicker onEmoji={handleAddIcon} />
                                        <WrapperAnimation
                                            onClick={handleSendMessage}
                                            hover={{}}
                                            className="bg-violet-primary rounded-lg px-4 py-1 text-white font-medium flex items-center gap-2 cursor-pointer text-1xl"
                                        >
                                            <p>Send</p>
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                        </WrapperAnimation>
                                    </div>

                                    <WrapperAnimation
                                        onClick={handleClose}
                                        hover={{}}
                                        className="p-2 flex items-center justify-center text-sm absolute top-0 right-0 cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faXmark} className="text-sm" />
                                    </WrapperAnimation>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {option?.delete && openComfirm && (
                <NativeComfirm
                    title="Notifycation"
                    onClose={() => setOpenComfirm(false)}
                    handleSubmit={handleDelete}
                    subtitle={
                        <>
                            Are you want to delete comment of <b>{data.name}</b>
                        </>
                    }
                />
            )}
        </div>
    );
}
