/* eslint-disable @next/next/no-img-element */
'use client';
import React, { FormEvent, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import WraperDialog from '../WraperDialog';
import { Avatar, Button } from '@mui/material';
import { EmojiPicker, LoadingLabel, LoadingSecondary, PrimaryPostButton, WrapperAnimation } from '@/components';
import { faImage, faPhotoFilm, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '@/hooks/reduxHooks';
import { ImageType, RootState } from '@/configs/types';
import { contants } from '@/utils/contants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDropzone } from 'react-dropzone';
import { fileToUrl } from '@/utils/format';
import { IMediadetected, IMediasPrev } from '@/configs/interface';
import { EmojiClickData } from 'emoji-picker-react';
import Validate from '@/utils/validate';
import ImageDetect from './ImageDetect';
import { createPost, deleteImagePost, getDetailPost, updatePost } from '@/apis/posts';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { links } from '@/datas/links';
import { useQuery } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import { delay } from '@/utils/funtionals';

export interface IUpdatePostDialogProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    onClose?: () => void;
}

function UpdatePostDialog({ open, setOpen, onClose }: IUpdatePostDialogProps) {
    // refs
    const refInput = useRef<HTMLTextAreaElement>(null);
    const dragImage = useRef(0);
    const draggedOverImage = useRef(0);

    const detectedArray = useRef<IMediadetected[]>([]);

    // redux
    const { user } = useAppSelector((state: RootState) => state.userReducer);

    const clearFileActive: string[] = [];

    //states
    const [images, setImages] = useState<IMediasPrev[]>([]);
    const [messageMedias, setMessageMedias] = useState<string[]>([]);
    const [messageText, setMessageText] = useState('');

    const [openModal, setOpenModal] = useState<{ state: boolean; data: null | IMediasPrev }>({ state: false, data: null });

    const [loadingFrom, setLoadingFrom] = useState(true);

    const [id, setId] = useQueryState('post-id');

    const rawData = useQuery({
        queryKey: ['postDetailDialog', id],
        queryFn: () => {
            if (!id) return null;
            return getDetailPost(id);
        },
    });

    const onDrop = useCallback(async (acceptedFiles: any) => {
        const files = acceptedFiles as File[];

        if (!files || !files.length || !data) return;

        setMessageMedias([]);

        const validVideoFile = files.find((item) => item.type === 'video/mp4');
        const validVideoFileOnImages = images.find((item) => item.isVideo);

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

        if (validVideoFileOnImages) {
            const prevImage = data.images.map((item) => {
                return {
                    data: null,
                    link: item.url,
                    isVideo: item.isVideo,
                    id: item.id,
                } as IMediasPrev;
            });
            setImages(prevImage);
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

    const handleCloseImage = async () => {
        if (!data || !openModal.data || openModal.data?.isVideo || !openModal.data.id) return;

        try {
            setLoadingFrom(true);
            const response = await deleteImagePost(openModal.data.id);

            if (!response) return toast.warn(contants.messages.errors.handle);

            if (response.errors) return toast.warn(response.message);

            rawData.refetch();
            setOpenModal({ state: false, data: null });
        } catch (error) {
            toast.error(contants.messages.errors.server);
        } finally {
            setLoadingFrom(false);
        }
    };

    const handleAddIcon = (emojiObject: EmojiClickData, event: MouseEvent) => {
        if (!refInput.current) return;

        refInput.current.value += emojiObject.emoji;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate()) return;

        try {
            if (!refInput.current || !data) return;
            setLoadingFrom(true);
            const response = await updatePost({ title: refInput.current.value, medias: images }, data.id as string);

            if (!response) return toast.warn(contants.messages.errors.handle);

            if (response.errors) return toast.warn(response.message);

            toast.success('Update succsessfuly');
            requestIdleCallback(() => {
                setOpen(false);
                setId(null);
            });
        } catch (error) {
            toast.warn(contants.messages.errors.server);
        } finally {
            setLoadingFrom(false);
        }
    };

    const data = useMemo(() => {
        if (rawData.isError || !rawData.data?.data) return null;

        return rawData.data?.data;
    }, [rawData]);

    const validateImages = useCallback(
        (checkLastImage = true, image?: IMediasPrev) => {
            if (!data) return true;

            if (data.images.some((item) => item.isVideo)) return true;

            if (checkLastImage) {
                if (images.length === 1 && images[0].id && !images[0].data) return true;

                if (images.length && images.filter((item) => item.id).length <= 1) return true;
            }

            return false;
        },
        [data, images],
    );

    const setUpdateData = useCallback(async () => {
        if (!id || rawData.isError || !data || !user) {
            setLoadingFrom(false);
            return;
        }

        if (!data.edit) {
            setLoadingFrom(false);
            return;
        }

        requestIdleCallback(async () => {
            await delay(1000);

            const images = data.images.map((item) => {
                return { data: null, link: item.url, isVideo: item.isVideo, id: item.id } as IMediasPrev;
            });

            setImages(images);

            if (!refInput.current) return;
            refInput.current.innerText = data.title;

            setLoadingFrom(false);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const handlePrevColoseImage = useCallback(
        (data: IMediasPrev, index: number) => {
            if (data.id) {
                setOpenModal({ state: true, data });
            } else {
                const newImages = images.filter((item) => item.link != data.link);
                setImages([...newImages]);

                if (detectedArray.current.length) {
                    detectedArray.current = detectedArray.current.filter((item) => item.index !== index);
                }
            }
        },
        [images],
    );

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

    useEffect(() => {
        setUpdateData();
    }, [setUpdateData]);

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
            onClose={onClose}
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
                        {!validateImages(false) && (
                            <div {...getRootProps()}>
                                <WrapperAnimation hover={{}}>
                                    <div className="flex items-center justify-center border gap-2 py-3 px-6 text-sm bg-[#F6F6F6] text-violet-post-primary border-violet-post-primary font-medium rounded-lg w-fit">
                                        <FontAwesomeIcon className="text-[20px]" icon={faPhotoFilm} />
                                        <span>Media</span>
                                    </div>
                                </WrapperAnimation>

                                <input {...getInputProps} hidden />
                            </div>
                        )}

                        <EmojiPicker classnNameIcon="text-violet-post-primary" onEmoji={handleAddIcon} stylePicker={{ height: 300 }} />
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
                                            options={{
                                                showClose: (() => {
                                                    if (item.id && images.filter((i) => i.id).length <= 1) return false;

                                                    return true;
                                                })(),
                                            }}
                                            key={item.link}
                                            onDragStart={() => (dragImage.current = index)}
                                            onDragEnter={() => (draggedOverImage.current = index)}
                                            onDragEnd={handleSort}
                                            data={item}
                                            index={index}
                                            handleCloseImage={handlePrevColoseImage}
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

            {openModal.state && (
                <WraperDialog open={openModal.state} setOpen={(v) => setOpenModal({ ...openModal, state: v })}>
                    <div className="p-6 flex flex-col gap-4 items-center text-black-main">
                        <b>Are you sure about this action?</b>
                        <div className="flex items-center justify-between text-sm">
                            <WrapperAnimation
                                onClick={() => setOpenModal({ ...openModal, state: false })}
                                hover={{}}
                                className="py-2 px-6 rounded-full hover:bg-[rgba(0,0,0,.2)] transition-all ease-linear cursor-pointer hover:text-white"
                            >
                                Cancel
                            </WrapperAnimation>
                            <WrapperAnimation
                                onClick={handleCloseImage ? () => handleCloseImage() : undefined}
                                hover={{}}
                                className="py-2 px-6 rounded-full hover:bg-[rgba(0,0,0,.2)] transition-all ease-linear cursor-pointer hover:text-white text-red-primary"
                            >
                                Ok
                            </WrapperAnimation>
                        </div>
                    </div>
                </WraperDialog>
            )}
        </WraperDialog>
    );
}

export default memo(UpdatePostDialog);
