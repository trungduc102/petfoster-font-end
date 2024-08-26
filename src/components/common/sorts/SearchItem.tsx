import { WrapperAnimation } from '@/components';
import { ISearchItem } from '@/configs/interface';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MouseEvent, MouseEventHandler } from 'react';

export interface ISearchItemProps {
    data: ISearchItem;
    onClickItem?: (e: MouseEvent<HTMLDivElement>, data: ISearchItem) => void;
    handleDelete?: (data: ISearchItem) => void;
}

export default function SearchItem({ data, onClickItem, handleDelete }: ISearchItemProps) {
    const handleClickDelete = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if (!handleDelete) return;
        handleDelete(data);
    };

    return (
        <div
            onClick={onClickItem ? (e) => onClickItem(e, data) : undefined}
            className="w-full flex items-center justify-between text-[#838181] text-[15px] hover:bg-[#f9f9f9] px-[22px] py-[6px] cursor-pointer"
        >
            <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faClock} />
                <span>{data.title}</span>
            </div>
            <WrapperAnimation
                className="flex items-center"
                hover={{
                    rotate: 10,
                }}
                onClick={handleDelete ? handleClickDelete : undefined}
            >
                <FontAwesomeIcon className="text-lg cursor-pointer" icon={faXmark} />
            </WrapperAnimation>
        </div>
    );
}
