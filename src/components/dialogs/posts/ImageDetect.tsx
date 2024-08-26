'use client';
import { MiniLoading } from '@/components';
/* eslint-disable @next/next/no-img-element */
import { IMediadetected, IMediasPrev } from '@/configs/interface';
import { detectService } from '@/services/detectService';
import { contants } from '@/utils/contants';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useState } from 'react';

export interface IImageDetectProps {
    index: number;
    data: IMediasPrev;
    handleCloseImage: (data: IMediasPrev, index: number) => void;
    onDragStart?: () => void;
    onDragEnter?: () => void;
    onDragEnd?: () => void;
    onDedected?: (data: IMediadetected) => void;
    options?: {
        showClose?: boolean;
    };
}

function ImageDetect({ index, data, handleCloseImage, onDedected, options = { showClose: true }, ...props }: IImageDetectProps) {
    const [loading, setLoading] = useState(true);
    const [isAnimal, setIsAnimal] = useState(false);

    const handleLoad = useCallback(async () => {
        if (!data.data || data.isVideo) {
            setLoading(false);
            return;
        }

        const imgData = await detectService.readImage(data.data);

        const imageElement = document.createElement('img');

        imageElement.src = imgData as string;

        imageElement.onload = async () => {
            const predictions = await detectService.detectObjectsOnImage(imageElement);

            const isAnimal = predictions.some((item) => contants.acceptAnimals.includes(item.class));
            setIsAnimal(isAnimal);
            setLoading(false);
            if (onDedected) {
                onDedected({ ...data, result: isAnimal, index });
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        if (data.isVideo) {
            setLoading(false);
        }
        if (!loading || data.isVideo) return;
        handleLoad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col gap-1 items-center">
            <div
                {...props}
                onDragOver={(e) => e.preventDefault()}
                draggable
                className={classNames('w-20 relative select-none aspect-square rounded-lg border-2 flex items-center justify-center text-2xl text-black-main overflow-hidden ', {
                    ['border-post-primary']: index === 0,
                    ['border-gray-primary']: index !== 0,
                })}
            >
                {!data.isVideo && (
                    <img
                        className={classNames('w-full  h-full object-cover aspect-square', {
                            ['blur-sm']: !loading && !isAnimal && data.data,
                        })}
                        src={data.link}
                        alt={data.link}
                    />
                )}
                {data.isVideo && <video className="w-full h-full object-cover aspect-square" src={data.link} controls={false} />}
                {options.showClose && (
                    <span onClick={() => handleCloseImage(data, index)} className="absolute top-0 right-0 px-2 text-1xl cursor-pointer text-white">
                        <FontAwesomeIcon icon={faXmark} />
                    </span>
                )}

                {loading && (
                    <div className="absolute inset-0 bg-white-opacity-50">
                        <MiniLoading className="w-full h-full flex items-center justify-center" />
                    </div>
                )}
            </div>
            <span className="text-sm text-gray-primary">{index + 1}</span>
        </div>
    );
}

export default memo(ImageDetect);
