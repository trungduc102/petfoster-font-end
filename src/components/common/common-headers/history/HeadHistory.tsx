'use client';
import { HeadTabType } from '@/configs/types';
import { dataHeadHistory } from '@/datas/header';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBox, faCarSide, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab, Tabs, styled, withStyles } from '@mui/material';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const AntTabs = styled(Tabs)({
    '& .MuiButtonBase-root': {
        padding: '0px',

        // fontSize: { xs: '14px', md: '18px', lg: '18px' },
        textTransform: 'capitalize !important',
        minHeight: '60px',
    },

    '&': { color: '#727272 !important' },
});

export interface IHeadHistoryProps {
    iniData?: HeadTabType[];
    styles?: 'outline' | 'rounded' | 'border-bottom';
    layouts?: 'center' | 'space-between' | 'flex-start';
    color?: string;
    onTab?: (value: { index: number; title: string }) => void;
}

export default function HeadHistory({ iniData = dataHeadHistory, styles = 'rounded', color = '#505DE8', layouts = 'space-between', onTab }: IHeadHistoryProps) {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (!onTab) return;

        onTab({ index: value, title: iniData[value].title });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <div
            className={classNames('border-gray-primary  px-2 md:px-10 w-full mb-6 ', {
                ['border rounded-lg']: styles === 'rounded',
                ['border-t border-b']: styles === 'outline',
                ['border-b']: styles === 'border-bottom',
            })}
        >
            <AntTabs
                sx={{
                    '& .Mui-selected': {
                        color: `${color} !important`,
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: color,
                    },
                    '& .MuiTabs-flexContainer ': {
                        display: 'flex',
                        justifyContent: layouts,

                        [layouts === 'flex-start' ? 'gap' : '']: '2rem',
                    },
                }}
                scrollButtons
                allowScrollButtonsMobile
                value={value}
                onChange={handleChange}
                aria-label="header-tabs"
            >
                {iniData.map((item, index) => {
                    return (
                        <Tab
                            sx={{
                                fontSize: { xs: '14px', md: '18px', lg: '18px' },
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                            key={item.title}
                            icon={<FontAwesomeIcon icon={item.icon} />}
                            iconPosition={item.styles?.iconPosition || 'start'}
                            label={item.title}
                            {...a11yProps(index)}
                        />
                    );
                })}
            </AntTabs>
        </div>
    );
}
