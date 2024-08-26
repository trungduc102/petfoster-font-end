import { IUserFirebase } from '@/configs/interface';
import { Avatar } from '@mui/material';
import moment from 'moment';
import React from 'react';

export interface ISearchFilterItemProps {
    data: IUserFirebase;
    handleClickItem?: (data: IUserFirebase) => void;
}

export default function SearchFilterItem({ data, handleClickItem }: ISearchFilterItemProps) {
    return (
        <div
            onClick={handleClickItem ? () => handleClickItem(data) : undefined}
            className="flex items-center gap-2 hover:bg-[#f2f2f2] px-3 py-2 transition-all ease-linear cursor-pointer"
        >
            <Avatar
                sx={{
                    width: '30px',
                    height: '30px',
                }}
                src={data.avartar}
            >
                {!data.avartar && data.username.charAt(0).toUpperCase()}
            </Avatar>
            <div className="text-black-main text-sm w-full">
                <span className="block w-full truncate max-w-[70%]">{data.displayname || data.username}</span>
                <div className="flex items-center text-xs gap-1">
                    {data.online && (
                        <>
                            <small className="w-1 h-1 rounded-full bg-green-600"></small>
                            <span>online</span>
                        </>
                    )}

                    {!data.online && <small className="italic">last seen: {moment(data.lassSeen).fromNow()}</small>}
                </div>
            </div>
        </div>
    );
}
