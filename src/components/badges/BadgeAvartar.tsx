'use client';
import { Badge, BadgeTypeMap, styled } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import React, { ReactNode } from 'react';

export interface IBadgeAvartarProps {
    children: ReactNode;
    visible?: boolean;
}

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

export default function BadgeAvartar({ children, visible }: IBadgeAvartarProps) {
    return (
        <StyledBadge invisible={visible} overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
            {children}
        </StyledBadge>
    );
}
