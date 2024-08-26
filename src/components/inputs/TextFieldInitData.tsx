import React, { ChangeEvent, useEffect, useState } from 'react';
import { TextField } from '..';
import { TextFieldProps } from '@mui/material';

export interface ITextFieldInitDataProps {}

export default function TextFieldInitData({ initData, ...props }: TextFieldProps & { initData: string }) {
    const [showPopup, setShowPopup] = useState(false);
    const [value, setValue] = useState(initData || '');
    const [width, setWidth] = useState(0);
    const [error, setError] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleClickItem = (item: string) => {
        setValue(item);
        setShowPopup(false);
        setError('');
    };

    useEffect(() => {
        if (!initData) return;
        setValue(initData);
    }, [initData]);

    return (
        <div className="w-full">
            <TextField onClick={() => setShowPopup(true)} size="small" />
        </div>
    );
}
