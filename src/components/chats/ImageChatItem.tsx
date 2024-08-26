/* eslint-disable @next/next/no-img-element */
import { ImageType } from '@/configs/types';
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export interface IImageChatItemProps {
    index: number;
    data: ImageType;
    handleCloseImage: (index: number) => void;
}

export default function ImageChatItem({ index, data, handleCloseImage }: IImageChatItemProps) {
    return (
        <div className="relative w-[60px] h-[60px] rounded-lg border-2 border-gray-primary overflow-hidden select-none">
            <img className="w-full h-full object-cover" src={data.link} alt={data.link} />

            <span onClick={() => handleCloseImage(index)} className="absolute text-gray-500 text-sm top-0 right-1 cursor-pointer">
                <FontAwesomeIcon icon={faXmarkCircle} />
            </span>
        </div>
    );
}
