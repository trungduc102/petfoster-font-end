import React, { ReactNode } from 'react';
import { SelectProps, Select as Sl, styled } from '@mui/material';
import { Value } from 'classnames';

export interface ISelectProps {
    children: ReactNode;
}

export default function Select({ children, ...props }: ISelectProps & SelectProps<Value>) {
    return (
        <Sl
            {...props}
            sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #6366F1',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#6366F1',
                },
            }}
        >
            {children}
        </Sl>
    );
}
