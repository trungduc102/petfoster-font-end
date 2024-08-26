/* eslint-disable @next/next/no-img-element */
'use client';
import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import WraperDialog from '../WraperDialog';
import { Avatar, Button } from '@mui/material';
import { EmojiPicker, LoadingLabel, LoadingSecondary, PrimaryPostButton, WrapperAnimation } from '@/components';
import { faImage, faPhotoFilm, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { ImageType, RootState } from '@/configs/types';
import { contants } from '@/utils/contants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDropzone } from 'react-dropzone';
import { fileToUrl } from '@/utils/format';
import { IMediadetected, IMediasPrev } from '@/configs/interface';
import { EmojiClickData } from 'emoji-picker-react';
import Validate from '@/utils/validate';
import classNames from 'classnames';
import { delay } from '@/utils/funtionals';
import ImageDetect from './ImageDetect';
import { createPost } from '@/apis/posts';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { links } from '@/datas/links';
import { setOpenPostModal } from '@/redux/slice/adorableSlide';

export interface IPostDialogProps {}

export default function PostDialog({}: IPostDialogProps) {
    // refs
    const refInput = useRef<HTMLTextAreaElement>(null);
    const dragImage = useRef(0);
    const draggedOverImage = useRef(0);

    const detectedArray = useRef<IMediadetected[]>([]);

    // redux
    const { user } = useAppSelector((state: RootState) => state.userReducer);
    const { openPostModal } = useAppSelector((state: RootState) => state.adorableReducer);

    const dispatch = useAppDispatch();

    const clearFileActive: string[] = [];

    //states
    const [images, setImages] = useState<IMediasPrev[]>([]);
    const [messageMedias, setMessageMedias] = useState<string[]>([]);
    const [messageText, setMessageText] = useState('');

    const [loadingFrom, setLoadingFrom] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: any) => {
        const files = acceptedFiles as File[];

        if (!files || !files.length) return;

        setMessageMedias([]);

        const validVideoFile = files.find((item) => item.type === 'video/mp4');

        if (validVideoFile) {
            if (validateMedia(validVideoFile)) {
                setMessageMedias(['Size no larger than 5MB']);
                return;
            }
            setImages([
                {
                    data: validVideoFile,
                    link: fileToUrl(validVideoFile, (url) => {
                        clearFileActive?.push(url);
                    }),
                    isVideo: true,
                },
            ]);
            setMessageMedias(['Only one video per post is accepted']);

            return;
        }
        const messages: string[] = [];

        const visibleFiles = files.filter((item) => {
            if (validateMedia(item)) {
                messages.push(`${item.name} photo larger than 5MB`);
            }
            return !validateMedia(item);
        });

        const activeFiles = visibleFiles.map((item) => {
            return {
                data: item,
                link: fileToUrl(item, (url) => {
                    clearFileActive?.push(url);
                }),
                isVideo: false,
            } as IMediasPrev;
        });

        if (messages.length) {
            setMessageMedias(messages);
        }

        setImages((prev) => [...prev, ...activeFiles]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //drozone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const validateMedia = (file: File) => {
        console.log(file.size / Math.pow(10, 6), file.name);
        return file.size / Math.pow(10, 6) > Number(process.env.NEXT_PUBLIC_MEDIAS_SIZE);
    };

    const validate = () => {
        let text = null;
        let media: string[] = [];
        if (!refInput.current) return true;

        if (Validate.isBlank(refInput.current.value || '')) {
            console.log('valdate text');
            text = 'Please write something for your article';
            setMessageText(text);
        } else {
            setMessageText('');
        }

        if (!images.length) {
            media = ['The post must have at least one photo or only one video'];
        }

        if (detectedArray.current.some((item) => !item.result)) {
            media.push('Inappropriate images. Only images that contain are accepted ' + contants.acceptAnimals.join(', '));
        }

        if (media) {
            setMessageMedias(media);
        } else {
            media = [];
            setMessageMedias([]);
        }

        if (text || !Validate.isBlank(text || '') || !Validate.isBlank(messageText) || media.length > 0) return true;

        return false;
    };

    const handleSort = () => {
        const imageClone = [...images];

        const temp = imageClone[dragImage.current];
        imageClone[dragImage.current] = imageClone[draggedOverImage.current];
        imageClone[draggedOverImage.current] = temp;
        setImages(imageClone);
    };

    const handleCloseImage = useCallback(
        (image: ImageType, index: number) => {
            images.splice(index, 1);
            setImages([...images]);

            if (detectedArray.current.length) {
                detectedArray.current = detectedArray.current.filter((item) => item.index !== index);
            }
        },
        [images],
    );

    const handleAddIcon = (emojiObject: EmojiClickData, event: MouseEvent) => {
        if (!refInput.current) return;

        refInput.current.value += emojiObject.emoji;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate()) return;

        try {
            if (!refInput.current) return;
            setLoadingFrom(true);
            const response = await createPost({ title: refInput.current.value, medias: images });

            if (!response) return toast.warn(contants.messages.errors.handle);

            if (response.errors) return toast.warn(response.message);

            toast.success(
                <span className="">
                    <span>Your article has been uploaded successfully.</span>
                    <Link className=" text-blue-primary hover:underline ml-1" href={links.adorables.index + `?uuid=${response.data.id}&open=auto`}>
                        Now everyone can see your posts
                    </Link>
                </span>,
            );

            requestIdleCallback(() => {
                dispatch(setOpenPostModal(false));
            });
        } catch (error) {
            toast.warn(contants.messages.errors.server);
        } finally {
            setLoadingFrom(false);
        }
    };

    useEffect(() => {
        if (images.length && !messageMedias.length) {
            setMessageMedias([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images]);

    useEffect(() => {
        return () => {
            if (clearFileActive.length) {
                clearFileActive.forEach((item) => {
                    URL.revokeObjectURL(item);
                });
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <WraperDialog
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '20px',
                },
            }}
            fullWidth={true}
            maxWidth={'md'}
            open={openPostModal}
            setOpen={(v) => {
                dispatch(setOpenPostModal(v));
            }}
        >
            <form onSubmit={handleSubmit} className="w-full h-full p-10 text-black-main flex flex-col justify-end relative">
                {loadingFrom && (
                    <div className="absolute inset-0 bg-black-040 flex items-center justify-center z-20">
                        <LoadingSecondary color="#3E3771" />
                    </div>
                )}
                <div className="flex items-center gap-4 text-1xl font-semibold tracking-wider">
                    <Avatar
                        sx={{
                            width: '4rem',
                            height: '4rem',
                        }}
                        src={(user && user.avatar) || contants.avartarDefault}
                    />
                    <span>{(user && user.displayName) || user?.username}</span>
                </div>

                <div className="w-full mt-8 rounded-[20px] border border-gray-primary p-5 flex flex-col justify-between">
                    <textarea
                        ref={refInput}
                        spellCheck={false}
                        className="w-full resize-none outline-none scroll placeholder:text-1xl text-1xl"
                        placeholder="What is happening?"
                        name="status"
                        id="status"
                        cols={10}
                        rows={4}
                    />
                    {!Validate.isBlank(messageText) && <span className="text-sm text-fill-heart mb-2 italic">{messageText}</span>}
                    <div className="flex items-center justify-start gap-5">
                        <div {...getRootProps()}>
                            <WrapperAnimation hover={{}}>
                                <div className="flex items-center justify-center border gap-2 py-3 px-6 text-sm bg-[#F6F6F6] text-violet-post-primary border-violet-post-primary font-medium rounded-lg w-fit">
                                    <FontAwesomeIcon className="text-[20px]" icon={faPhotoFilm} />
                                    <span>Media</span>
                                </div>
                            </WrapperAnimation>

                            <input {...getInputProps} hidden />
                        </div>

                        <EmojiPicker placement="right-end" classnNameIcon="text-violet-post-primary" onEmoji={handleAddIcon} stylePicker={{ height: 300 }} />
                    </div>

                    {/* messages */}
                    {messageMedias.length > 0 && (
                        <ul className="pl-5 list-disc text-sm italic text-fill-heart mt-4 ">
                            {messageMedias.map((item, index) => {
                                return (
                                    <li key={item}>
                                        {item}{' '}
                                        {index === 0 && (
                                            <span onClick={() => setMessageMedias([])} className="text-blue-primary hover:underline cursor-pointer">
                                                OK
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {/* preview medias */}
                    {images.length > 0 && (
                        <>
                            <div className="flex items-center gap-3 flex-wrap  mt-4">
                                {images.map((item, index) => {
                                    return (
                                        <ImageDetect
                                            key={item.link}
                                            onDragStart={() => (dragImage.current = index)}
                                            onDragEnter={() => (draggedOverImage.current = index)}
                                            onDragEnd={handleSort}
                                            data={item}
                                            index={index}
                                            handleCloseImage={handleCloseImage}
                                            onDedected={(result) => {
                                                detectedArray.current.push(result);
                                            }}
                                        />
                                    );
                                })}

                                {isDragActive && (
                                    <div className="w-20 mt-4 aspect-square rounded border-dashed border-2 border-gray-primary flex items-center justify-center text-2xl text-black-main">
                                        <FontAwesomeIcon icon={faPlus} />
                                    </div>
                                )}
                            </div>
                            {images.length > 1 && (
                                <ul className="text-gray-500 italic text-sm mt-3">
                                    <li>You can drag and drop to choose the display position for the article. By default the first image will be displayed</li>
                                </ul>
                            )}
                        </>
                    )}
                </div>

                <div className="flex items-center justify-center mt-5">
                    <PrimaryPostButton title="Post" variant="circle-fill" size="sm" className="uppercase" />
                </div>
            </form>
        </WraperDialog>
    );
}
