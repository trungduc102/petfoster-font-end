import { IconDefinition, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export interface IMissionVisonItemProps {
    data: { icon: IconDefinition; title: string; content: string };
    positionHightlight?: number;
}

export default function MissionVisonItem({ data, positionHightlight = 12 }: IMissionVisonItemProps) {
    return (
        <div className="w-full shadow-primary rounded-3xl px-[25px] py-[26px] text-black-main flex flex-col justify-between items-center gap-3">
            <span className="rounded-full p-4 bg-green-65a30d text-white h-20 w-20 flex items-center justify-center text-7xl">
                <FontAwesomeIcon icon={data.icon} />
            </span>
            <h3 className=" text-3xl">{data.title}</h3>
            <p className="text-1xl">
                <b className="text-green-main-dark font-medium">{data.content.slice(0, positionHightlight)}</b> {data.content.slice(positionHightlight)}
            </p>
        </div>
    );
}
