'use client';
import { styled } from '@mui/material';
import LinearProgress, { LinearProgressProps, linearProgressClasses } from '@mui/material/LinearProgress';
import * as React from 'react';

const BorderLinear = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: '#E4E4E4',
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: '#FCBD18',
    },
}));

export default function BorderLinearProgress(props: LinearProgressProps) {
    return <BorderLinear {...props} variant="determinate" />;
}
