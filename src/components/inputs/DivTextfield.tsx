'use client';
import React, { InputHTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { TextField } from '..';
import { MenuItem, TextFieldProps } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { IFilter } from '@/configs/interface';

export interface IDivTextfieldProps {
    label: string;
    showEye?: boolean;
    dataSelect?: { id: string; name: string }[];
    dataSelectFilter?: IFilter[];
    action?: {
        children: ReactNode;
        classnames?: {
            wraper?: string;
        };
    };
    propsInput?: TextFieldProps & {
        message?: string;
    };
    children?: ReactNode;
}

export default function DivTextfield({ label, propsInput, dataSelect, dataSelectFilter, showEye, children, action }: IDivTextfieldProps) {
    const [hideEye, setHideEye] = useState(true);

    return (
        <div className="flex flex-col justify-between gap-2 w-full">
            {!action && <label className="text-sm font-medium">{label}</label>}
            {action && (
                <div className={action.classnames?.wraper}>
                    <label className="text-sm font-medium">{label}</label>

                    {action.children}
                </div>
            )}
            {!children && (
                <>
                    {!dataSelect && !dataSelectFilter && !showEye && (
                        <TextField spellCheck={false} id={label.toLowerCase().replaceAll(' ', '-')} {...propsInput} fullWidth size="small" />
                    )}

                    {dataSelect && dataSelect.length && !dataSelectFilter && (
                        <TextField select spellCheck={false} id={label.toLowerCase().replaceAll(' ', '-')} {...propsInput} fullWidth size="small">
                            {dataSelect.map((item, index) => {
                                return (
                                    <MenuItem key={index} value={item.id} sx={{ fontSize: '14px !important' }}>
                                        {item.name}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                    )}

                    {dataSelectFilter && dataSelectFilter.length && !dataSelect && (
                        <TextField select spellCheck={false} id={label.toLowerCase().replaceAll(' ', '-')} {...propsInput} fullWidth size="small">
                            {dataSelectFilter.map((item, index) => {
                                return (
                                    <MenuItem key={index} value={item.id + ''} sx={{ fontSize: '14px !important' }}>
                                        {item.name}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                    )}

                    {propsInput?.type === 'password' && showEye && (
                        <div className="relative">
                            <TextField
                                spellCheck={false}
                                id={label.toLowerCase().replaceAll(' ', '-')}
                                {...propsInput}
                                type={!hideEye ? 'text' : 'password'}
                                fullWidth
                                size="small"
                            />
                            <div onClick={() => setHideEye(!hideEye)} className="absolute right-[14px] top-[50%] translate-y-[-50%] cursor-pointer">
                                <FontAwesomeIcon icon={hideEye ? faEye : faEyeSlash} />
                            </div>
                        </div>
                    )}
                </>
            )}

            {children && children}
        </div>
    );
}
