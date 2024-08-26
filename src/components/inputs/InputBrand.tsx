'use client';
import { Box, Button, MenuItem, Stack, TextFieldProps, Typography } from '@mui/material';
import React, { ChangeEvent, useRef, useState } from 'react';
import { FormBrandDialog, TextField } from '..';
import { IFilter } from '@/configs/interface';

export interface IInputBrandProps {
    title: string;
    propsInput?: TextFieldProps & {
        message?: string;
    };
    dataSelect: IFilter[];
    onAfterSubmit?: () => void;
}

export default function InputBrand({ title, propsInput, dataSelect, onAfterSubmit }: IInputBrandProps) {
    const [open, setOpen] = useState(false);

    const handleOpenFormBrand = () => {
        setOpen(true);
    };
    return (
        <Stack>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }} mb={'10px'}>
                <Typography sx={{ fontWeight: '500', fontSize: '14px' }}>{title}</Typography>
                <Typography
                    sx={{
                        fontWeight: '500',
                        fontSize: '14px',
                        color: '#5587ff',
                        textTransform: 'uppercase',
                        '&:hover': { textDecoration: 'underline' },
                        cursor: 'pointer',
                        userSelect: 'none',
                    }}
                    onClick={handleOpenFormBrand}
                >
                    Other
                </Typography>
            </Box>
            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ position: 'relative' }}>
                <TextField select {...propsInput} fullWidth size="small">
                    {dataSelect.map((item, index) => {
                        return (
                            <MenuItem key={item.name} value={typeof item.id === 'object' ? item.id.join() : item.id}>
                                {item.name}
                            </MenuItem>
                        );
                    })}
                </TextField>
            </Stack>

            <FormBrandDialog onAfterSubmit={onAfterSubmit} open={open} setOpen={setOpen} />
        </Stack>
    );
}
