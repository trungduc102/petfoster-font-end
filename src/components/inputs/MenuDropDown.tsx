'use client';
import { Checkbox, Collapse, List, ListItem, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { capitalize } from '@/utils/format';

export interface IMenuDropDownProps {
    title: string;
    data: string[];
    clearValue?: {
        value: boolean;
        option?: {
            closeOnClear?: boolean;
        };
    };
    onValues?: (values: string[]) => void;
}

export default function MenuDropDown({ data, title, clearValue, onValues }: IMenuDropDownProps) {
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState<string[]>([]);
    const handleClick = () => {
        setOpen(!open);
    };
    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);

        if (onValues) {
            onValues(newChecked);
        }
    };

    useEffect(() => {
        if (clearValue && clearValue?.value) {
            setChecked([]);
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
                    <List
                        sx={{
                            width: '100%',
                            maxWidth: 360,
                            bgcolor: 'background.paper',
                        }}
                    >
                        {data.map((value) => {
                            const labelId = `checkbox-list-label-${value}`;

                            return (
                                <ListItem key={value} disablePadding>
                                    <div className="flex items-center" onClick={handleToggle(value)}>
                                        <Checkbox edge="start" checked={checked.includes(value)} tabIndex={-1} disableRipple inputProps={{ 'aria-labelledby': labelId }} />
                                        <ListItemText id={labelId} primary={value} />
                                    </div>
                                </ListItem>
                            );
                        })}
                    </List>
                </Collapse>
            </List>
        </div>
    );
}
