import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent, memo } from 'react';
import { WrapperAnimation } from '..';
import classNames from 'classnames';

export interface ISearchInputProps {
    value: string;
    placeholder?: string;
    variant?: 'rounded' | 'circle';
    className?: string;
    defaultStyle?: boolean;
    classNameInput?: string;
    handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    handleClose?: () => void;
}

function SearchInput({ value, placeholder, variant = 'rounded', className, classNameInput, defaultStyle = true, handleChange, handleClose }: ISearchInputProps) {
    return (
        <div
            className={classNames('flex items-center border ', {
                ['rounded']: variant === 'rounded',
                ['rounded-full']: variant === 'circle',
                [className || '']: className,
                ['border-gray-primary py-2 px-4']: defaultStyle,
            })}
        >
            <input
                value={value}
                onChange={handleChange}
                name="search"
                className={classNames('flex-1 outline-none mr-2 ', {
                    [classNameInput || '']: classNameInput,
                })}
                placeholder={placeholder || 'Search for'}
                type="text"
            />
            <WrapperAnimation onClick={handleClose} hover={{}} className="flex items-center justify-center cursor-pointer">
                <FontAwesomeIcon className="text-[#A4A4A4] h-4 w-4" icon={value.length > 0 ? faXmark : faMagnifyingGlass} />
            </WrapperAnimation>
        </div>
    );
}
export default memo(SearchInput);
