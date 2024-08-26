'use client';
import { TippyChooser, WrapperAnimation } from '@/components';
import { TippyChooserType } from '@/configs/types';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar } from '@mui/material';
import Tippy from '@tippyjs/react/headless';
import React, { memo, useLayoutEffect, useRef, useState } from 'react';
import SearchFilter from './SearchFilter';

interface FilterProps {
    handleSort?: (value: TippyChooserType) => void;
}

const Filter = ({ handleSort }: FilterProps) => {
    return (
        <div className="flex items-center justify-between w-full text-[#626262] gap-3 text-sm px-5">
            <div className="flex items-center ">
                <TippyChooser
                    styles={{
                        className: 'bg-[#f2f2f2] rounded px-5 py-2',
                        classNamePopup: 'bg-[#f2f2f2] rounded',
                    }}
                    title="Latest"
                    data={[{ title: 'Oldest', id: 'asc' }]}
                    onValue={handleSort}
                />
            </div>

            <SearchFilter />
        </div>
    );
};

export default memo(Filter);
