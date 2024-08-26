/* eslint-disable @next/next/no-img-element */
'use client';
import React, { ChangeEvent, ClipboardEvent, KeyboardEvent, createContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { EmojiPicker, WrapperAnimation } from '..';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile, faLocationDot, faPaperPlane, faPhotoFilm, faStore, faXmark, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { EmojiClickData } from 'emoji-picker-react';
import classNames from 'classnames';
import { getIconWithStatus, toCurrency, wraperTextToLink } from '@/utils/format';
import { getValueOnClipboard } from '@/utils/clipboard';
import Validate from '@/utils/validate';
import { validImage } from '@/utils/image';
import { ImageType, RootState } from '@/configs/types';
import ImageChatItem from './ImageChatItem';
import OrderPopup from './components/OrderPopup';
import { Tooltip } from '@mui/material';
import { useAppSelector } from '@/hooks/reduxHooks';
import { contants } from '@/utils/contants';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import dynamic from 'next/dynamic';

const MapDialog = dynamic(() => import('../dialogs/maps/MapDialog'), { ssr: false });

export interface IChatFooterContext {
    params?: {
        id: string;
        username: string;
    };
    conversationId?: string;
}

export const ChatFooterContext = createContext<IChatFooterContext>({});

export interface IChatFooterProps {
    handleSubmit?: (value: string, images?: ImageType[]) => void;
    options?: {
        styleIcon?: string;
    };
    conversationId?: string;
    params?: {
        id: string;
        username: string;
    };
}

export default function ChatFooter({ options, conversationId, params, handleSubmit }: IChatFooterProps) {
    const { user } = useAppSelector((state: RootState) => state.userReducer);
    const { location, address } = useAppSelector((state: RootState) => state.chatReducer);

    const [openMap, setOpenMap] = useState(false);

    const refInput = useRef<HTMLInputElement>(null);

    const [images, setImages] = useState<ImageType[]>([]);
    const [isValue, setIsValue] = useState(false);

    const handleClickSendMessage = () => {
        if (!refInput.current) return;

        if (!handleSubmit) return;

        handleSubmit(wraperTextToLink(refInput.current.value), images);

        setImages([]);

        refInput.current.value = '';
        setIsValue(false);
    };

    const handleKeyOnEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleClickSendMessage();
        }
    };

    const handleAddEmoji = (emojiObject: EmojiClickData, event: MouseEvent) => {
        if (!refInput.current) return;
        refInput.current.value += emojiObject.emoji;
    };

    const handleCloseImage = (index: number) => {
        images.splice(index, 1);

        setImages([...images]);
    };

    const handlePaste = async (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!refInput.current) return;
        const pastedData = getValueOnClipboard(e);

        if (!Validate.isUrl(pastedData)) {
            refInput.current.value = refInput.current.value + pastedData;

            return;
        }

        try {
            // is images
            const isRealImage = await validImage(pastedData);

            if (isRealImage) {
                setImages([...images, { link: pastedData, data: null }]);
            }
        } catch (error) {
            // is not is a image
            refInput.current.value = refInput.current.value + pastedData;
        }
    };

    const handleToggleIsValue = (e: ChangeEvent<HTMLInputElement>) => {
        if (Validate.isBlank(e.target.value)) {
            setIsValue(false);
        } else {
            setIsValue(true);
        }
    };

    const handleClickMap = () => {
        setOpenMap((prev) => !prev);
    };

    useEffect(() => {
        if (!address || !location) return;

        setOpenMap(true);
    }, [address, location]);

    return (
        <ChatFooterContext.Provider
            value={{
                params,
                conversationId,
            }}
        >
            <div className="flex flex-col w-full">
                <div className="w-full flex items-center justify-between px-6 py-4 gap-3 ">
                    <div className="flex items-center justify-between bg-[#F3F4F6] flex-1 rounded-full px-5 py-1">
                        <div className="flex-1 text-sm text-black-main pr-3 ">
                            <input
                                onPaste={handlePaste}
                                onKeyDown={handleKeyOnEnter}
                                onChange={handleToggleIsValue}
                                ref={refInput}
                                type="text"
                                className="outline-none border-none bg-transparent w-full placeholder:text-sm "
                                placeholder="Type your message"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-[#ACABAB]">
                            <WrapperAnimation
                                className={classNames('py-2 cursor-pointer flex items-center justify-center', {
                                    [options?.styleIcon || '']: true,
                                })}
                                onClick={handleClickMap}
                                hover={{}}
                            >
                                <FontAwesomeIcon icon={faMap} />
                            </WrapperAnimation>
                            {user && contants.roles.userRoles.includes(user.role) && (
                                <OrderPopup
                                    conversationId={conversationId}
                                    username={user.username}
                                    className={classNames('py-2 cursor-pointer flex items-center justify-center', {
                                        [options?.styleIcon || '']: true,
                                    })}
                                >
                                    <Tooltip title="Orders" placement="top">
                                        <FontAwesomeIcon icon={faStore} />
                                    </Tooltip>
                                </OrderPopup>
                            )}
                            <WrapperAnimation
                                className={classNames('py-2 cursor-pointer flex items-center justify-center', {
                                    [options?.styleIcon || '']: true,
                                })}
                                hover={{}}
                            >
                                <input
                                    onChange={(e) => {
                                        const filesData = e.target.files;

                                        if (!filesData || filesData.length <= 0) return;

                                        const files = Array.from(filesData).map((item) => {
                                            return {
                                                link: URL.createObjectURL(item),
                                                data: item,
                                            } as ImageType;
                                        });

                                        if (files.length <= 0) return;

                                        setImages([...images, ...files]);
                                    }}
                                    id="image-preview-input"
                                    type="file"
                                    multiple
                                    hidden
                                />
                                <label htmlFor="image-preview-input" className="flex items-center justify-center cursor-pointer">
                                    <FontAwesomeIcon icon={faPhotoFilm} />
                                </label>
                            </WrapperAnimation>

                            <EmojiPicker
                                options={{
                                    placement: 'top',
                                }}
                                onEmoji={handleAddEmoji}
                                icon={
                                    <WrapperAnimation
                                        className={classNames('py-2 cursor-pointer flex items-center justify-center', {
                                            [options?.styleIcon || '']: true,
                                        })}
                                        hover={{}}
                                    >
                                        <FontAwesomeIcon icon={faFaceSmile} />
                                    </WrapperAnimation>
                                }
                            />

                            <WrapperAnimation
                                onClick={handleClickSendMessage}
                                hover={{}}
                                className={classNames('py-2 cursor-pointer flex items-center justify-center pl-2', {
                                    ['text-green-main-dark']: isValue,
                                    ['text-[#ACABAB]']: !isValue,
                                })}
                            >
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </WrapperAnimation>
                        </div>
                    </div>
                </div>
                {images.length > 0 && (
                    <div className="flex items-center flex-wrap gap-2 px-6 mb-2">
                        {images.map((img, index) => {
                            return <ImageChatItem key={index} index={index} data={img} handleCloseImage={handleCloseImage} />;
                        })}
                    </div>
                )}

                {openMap && <MapDialog open={openMap} setOpen={setOpenMap} />}
            </div>
        </ChatFooterContext.Provider>
    );
}
