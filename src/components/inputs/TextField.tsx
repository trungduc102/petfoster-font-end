'use client';
import React from 'react';
import { TextFieldProps, TextField as Tx } from '@mui/material';
import Validate from '@/utils/validate';

export default function TextField({ ref, ...props }: TextFieldProps & { message?: string; ref?: any }) {
    return (
        <>
            <Tx
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            border: '1px solid #6366F1', // customized
                        },
                    },
                    '& .MuiOutlinedInput-root:hover': {
                        '& fieldset': {
                            border: '1px solid #6366F1', // customized
                        },
                    },
                    '& .MuiFormLabel-root': {
                        color: '#6C6C6C !important',
                        fontSize: '14px !important',
                    },
                }}
                ref={ref}
                {...props}
                error={Validate.isNotBlank(props.message || '')}
                helperText={Validate.isNotBlank(props.message || '') && props.message}
                variant="outlined"
                fullWidth
            />
        </>
    );
}
