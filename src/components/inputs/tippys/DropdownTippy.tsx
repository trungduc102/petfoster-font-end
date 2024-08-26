'use client';
import { useDebounce } from '@/hooks';
import Tippy from '@tippyjs/react/headless';
import React, { ChangeEvent, forwardRef, useCallback, useEffect, useRef, useState, Ref, FocusEvent, memo, useContext } from 'react';
import TextField from '../TextField';
import { IDistrict, IDistrictOutside, IFilter, IProvinceOutside, IProvinces, IWard, IWardOutside } from '@/configs/interface';
import classNames from 'classnames';
import Validate from '@/utils/validate';
import { TextFieldProps } from '@mui/material';

export interface IDropdownTippy {}

export interface IDropdownTippyProps {
    data: IFilter[];
    placeholder?: string;
    messageUndefined?: string;
    initData?: string;
    label?: string;
    name: string;
    inputProps?: TextFieldProps & {
        message?: string;
    };
    options?: {
        showValueBeforeClick?: boolean;
    };
    onValue?: (value: IFilter | null) => void;
    onClickItem?: (item: IFilter) => void;
    onSubmit?: (item: string) => void;
}

export default function DropdownTippy({
    data,
    placeholder,
    messageUndefined,
    initData,
    name,
    label,
    inputProps,
    onValue,
    onClickItem,
    onSubmit,
    options = { showValueBeforeClick: true },
}: IDropdownTippyProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [value, setValue] = useState(initData || '');
    const [width, setWidth] = useState(0);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleClickItem = (item: IFilter) => {
        if (options.showValueBeforeClick) {
            setValue(item.name);
        }

        if (onClickItem) {
            onClickItem(item);
        }

        setShowPopup(false);
    };

    const handleKeyEnter = (value: string) => {
        setShowPopup(false);
        setValue('');

        if (!onSubmit) return;
        onSubmit(value);
    };

    useEffect(() => {
        if (!ref.current) return;

        setWidth(ref.current.clientWidth);
    }, [ref]);

    useEffect(() => {
        if (!onValue) return;
        if (!data) return;
        const item = data.find((i) => {
            return i.name === value;
        });
        onValue(item || null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    useEffect(() => {
        if (data === null || !data) {
            setValue('');
            return;
        }
        if (!onValue) return;
        const item = data.find((i) => {
            return i.name === value;
        });
        onValue(item || null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        if (!initData) return;
        requestIdleCallback(() => {
            setValue(initData);
        });
    }, [initData]);

    const renderData = useCallback(() => {
        if (!data) return <li className="text-center">{messageUndefined || 'Please choose ' + (placeholder && placeholder.toLowerCase())}</li>;

        let curData = [...data];

        if (value.length > 0) {
            curData = data.filter((item) => {
                return item.name.toLowerCase().includes(value.toLowerCase());
            });
        }

        if (!curData.length) {
            return <li className="text-center">No results</li>;
        }

        return curData.map((item) => {
            return (
                <li onClick={() => handleClickItem(item)} className={classNames('py-[6px] hover:bg-[rgba(93,135,255,0.08)] px-[14px] text-sm cursor-pointer')} key={item.name}>
                    {item.name}
                </li>
            );
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, data]);
    return (
        <div className="w-full">
            <Tippy
                interactive
                visible={showPopup}
                placement="bottom-start"
                onClickOutside={() => setShowPopup(false)}
                render={(attr) => {
                    return (
                        <div style={{ width: width }} tabIndex={-1} {...attr} className={'h-[240px] bg-white border border-gray-primary rounded py-2'}>
                            <ul
                                className={classNames('scroll overflow-y-auto w-full h-full', {
                                    'flex items-center justify-center': !data,
                                })}
                            >
                                {renderData()}
                            </ul>
                        </div>
                    );
                }}
            >
                <div ref={ref} className="w-full ">
                    <TextField
                        {...inputProps}
                        label={label}
                        autoComplete={'off'}
                        name={name}
                        value={value}
                        onChange={handleChange}
                        placeholder={placeholder}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleKeyEnter(value);
                            }
                        }}
                        onClick={() => setShowPopup(true)}
                        size="small"
                    />
                </div>
            </Tippy>
        </div>
    );
}
