import { IInfoAddress } from '@/configs/interface';
import { addressToString } from '@/utils/format';
import { Grid } from '@mui/material';
import React, { MouseEvent, MouseEventHandler } from 'react';

export interface IAddressItemProps {
    data: IInfoAddress;
    handleEdit?: (e?: MouseEvent<HTMLSpanElement>, data?: IInfoAddress) => void;
    handleDelete?: (e?: MouseEvent<HTMLSpanElement>, data?: IInfoAddress) => void;
    handleClick?: (e?: MouseEvent<HTMLSpanElement>, data?: IInfoAddress) => void;
    disableControll?: boolean;
}

export default function AddressItem({ data, disableControll = false, handleEdit, handleClick, handleDelete }: IAddressItemProps) {
    return (
        <div
            onClick={(e) => {
                if (!handleClick) return;
                handleClick(e, data);
            }}
            className="text-black-main py-6 w-full border-b border-gray-primary cursor-pointer "
        >
            <Grid container spacing={2}>
                <Grid item lg={10}>
                    <div className="text-sm flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold">{data.name}</h4>
                            {data.isDefault && <span className="py-1 px-5 rounded bg-[#C9C5C5] font-medium">Default</span>}
                        </div>
                        <span>{data.phone}</span>
                        <p className="line-clamp-4">{addressToString(data.address)}</p>
                    </div>
                </Grid>
                <Grid item lg={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {!disableControll && (
                        <div className="flex items-center justify-center h-full gap-2 text-violet-primary font-medium text-sm">
                            <span
                                onClick={(e) => {
                                    if (!handleEdit) return;
                                    e.stopPropagation();
                                    handleEdit(e, data);
                                }}
                                className="hover:underline cursor-pointer"
                            >
                                Edit
                            </span>
                            <span className="w-[2px] h-[18px] bg-[#BCB9B9]"></span>
                            <span
                                onClick={(e) => {
                                    if (!handleDelete) return;
                                    e.stopPropagation();
                                    handleDelete(e, data);
                                }}
                                className="hover:underline cursor-pointer"
                            >
                                Remove
                            </span>
                        </div>
                    )}
                </Grid>
            </Grid>
        </div>
    );
}
