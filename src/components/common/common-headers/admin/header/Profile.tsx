'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Avatar, Box, Menu, Button, IconButton, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { IconListCheck, IconMail, IconUser } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { RootState } from '@/configs/types';
import { contants } from '@/utils/contants';
import { unwrapResult } from '@reduxjs/toolkit';
import { fetchUserByToken } from '@/redux/slice/userSlice';

const Profile = () => {
    const { user, token } = useAppSelector((state: RootState) => state.userReducer);
    const dispatch = useAppDispatch();

    const [anchorEl2, setAnchorEl2] = useState(null);
    const handleClick2 = (event: any) => {
        setAnchorEl2(event.currentTarget);
    };
    const handleClose2 = () => {
        setAnchorEl2(null);
    };

    useEffect(() => {
        (async () => {
            const actionResult = dispatch(fetchUserByToken());
            const curUser = unwrapResult(await actionResult);
            // console.log(curUser);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <Box>
            <IconButton
                size="large"
                aria-label="show 11 new notifications"
                color="inherit"
                aria-controls="msgs-menu"
                aria-haspopup="true"
                sx={{
                    ...(typeof anchorEl2 === 'object' && {
                        color: 'primary.main',
                    }),
                }}
                onClick={handleClick2}
            >
                <Avatar
                    src={user?.avatar || contants.avartarDefault}
                    alt="image"
                    sx={{
                        width: 35,
                        height: 35,
                    }}
                />
            </IconButton>
            {/* ------------------------------------------- */}
            {/* Message Dropdown */}
            {/* ------------------------------------------- */}
            <Menu
                id="msgs-menu"
                anchorEl={anchorEl2}
                keepMounted
                open={Boolean(anchorEl2)}
                onClose={handleClose2}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                sx={{
                    '& .MuiMenu-paper': {
                        width: '200px',
                    },
                }}
            >
                <MenuItem>
                    <ListItemIcon>
                        <IconListCheck width={20} />
                    </ListItemIcon>
                    <ListItemText>
                        <Link href={'/'}>Website</Link>
                    </ListItemText>
                </MenuItem>
                <Box mt={1} py={1} px={2}>
                    <Button href="/log-out" variant="outlined" color="primary" component={Link} fullWidth>
                        Logout
                    </Button>
                </Box>
            </Menu>
        </Box>
    );
};

export default Profile;
