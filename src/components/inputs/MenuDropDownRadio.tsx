'use client';
import { IFilter } from '@/configs/interface';
import { capitalize } from '@/utils/format';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkbox, Collapse, FormControlLabel, List, ListItem, ListItemText, Radio, RadioGroup } from '@mui/material';
import { motion } from 'framer-motion';
import React, { ChangeEvent, useEffect, useState } from 'react';

export interface IMenuDropDownRadioProps {
    title: string;
    data: IFilter[];
    defaultValue?: boolean;
    clearValue?: {
        value: boolean;
        option?: {
            closeOnClear?: boolean;
        };
    };
    onValues?: (values: string | number[], name?: string) => void;
}

export default function MenuDropDownRadio({ title, data, defaultValue, clearValue, onValues }: IMenuDropDownRadioProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(defaultValue ? (typeof data[0].id === 'object' ? data[0].id.join(',') : data[0].id) : '');
    const handleClick = () => {
        setOpen(!open);
    };
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    useEffect(() => {
        if (onValues) {
            const item = data.find((i) => {
                return i.id === value;
            });

            onValues(value, item?.name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    useEffect(() => {
        if (clearValue && clearValue?.value) {
            setValue('');
            if (clearValue.option && clearValue.option.closeOnClear) {
                setOpen(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clearValue]);

    return (
        <div className="py-2 w-full border-b border-gray-primary">
            <List component="nav" aria-labelledby="nested-list-subheader">
                <div className="cursor-pointer flex items-center justify-between" onClick={handleClick}>
                    <span className="font-medium text-lg">{capitalize(title)}</span>
                    <motion.span initial={false} animate={{ rotate: open ? 0 : 180 }} className="w-4 h-4 flex items-center justify-center">
                        <FontAwesomeIcon className="w-full h-full" icon={faPlus} />
                    </motion.span>
                </div>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        <RadioGroup onChange={handleChange} value={value} aria-labelledby={title} defaultValue="" name="radio-buttons-group">
                            {data.map((value, index) => {
                                return <FormControlLabel key={index} value={typeof value.id === 'object' ? value.id.join(',') : value.id} control={<Radio />} label={value.name} />;
                            })}
                        </RadioGroup>
                    </List>
                </Collapse>
            </List>
        </div>
    );
}
