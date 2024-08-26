'use client';
import { TippyChooserType } from '@/configs/types';
import { faChevronDown, faChevronUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface ITippyChooserProps {
    title: string;
    data: TippyChooserType[];
    onValue?: (value: TippyChooserType) => void;
    styles?: {
        minWidth?: string;
        className?: string;
        classNamePopup?: string;
    };
}

export default function TippyChooser({ title, data, styles, onValue }: ITippyChooserProps) {
    const initValue = { id: '0', title };

    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<TippyChooserType>({ ...initValue });

    const handleValue = (item: TippyChooserType) => {
        setValue(item);
        handleClose();
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClear = () => {
        setValue({ ...initValue });
    };
    useLayoutEffect(() => {
        if (!ref.current) return;

        setWidth(ref.current.offsetWidth);
    }, []);

    useEffect(() => {
        if (!onValue) return;

        if (value.title === title) {
            onValue({ ...value, title: '' });
            return;
        }

        onValue(value);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    return (
        <div className="w-full select-none">
            <Tippy
                interactive
                visible={open}
                placement="bottom"
                onClickOutside={handleClose}
                render={(attr) => {
                    return (
                        <ul
                            style={{
                                width,
                            }}
                            {...attr}
                            tabIndex={-1}
                            className={classNames('shadow-lg overflow-hidden', {
                                [styles?.classNamePopup || 'border border-gray-primary bg-white rounded-xl']: true,
                            })}
                        >
                            {data.map((item) => {
                                return (
                                    <li
                                        onClick={() => handleValue(item)}
                                        key={item.id}
                                        className="px-5 py-2 hover:text-white last:border-none hover:border-transparent border-b border-gray-primary hover:bg-violet-primary transition cursor-pointer"
                                    >
                                        <p>{item.title}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    );
                }}
            >
                <div
                    onClick={() => setOpen((prev) => !prev)}
                    ref={ref}
                    className={classNames('flex items-center justify-between gap-2  whitespace-nowrap cursor-pointer w-full', {
                        [styles?.minWidth || ' min-w-[140px]']: styles?.minWidth,
                        [styles?.className || 'border border-[#333333] rounded-xl py-2 px-4']: true,
                    })}
                >
                    <span>{value.title}</span>
                    {value.id == '0' && <FontAwesomeIcon icon={!open ? faChevronDown : faChevronUp} />}
                    {value.id !== '0' && <FontAwesomeIcon icon={faXmark} onClick={handleClear} />}
                </div>
            </Tippy>
        </div>
    );
}
