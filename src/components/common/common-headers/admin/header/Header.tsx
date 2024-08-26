import React from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button } from '@mui/material';
import PropTypes from 'prop-types';

// components
import Profile from './Profile';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { WrapperAnimation, NotifycationCom } from '@/components';
import { usePathname, useRouter } from 'next/navigation';
import { links } from '@/datas/links';

interface ItemType {
    toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
    const pathname = usePathname();
    const router = useRouter();
    const AppBarStyled = styled(AppBar)(({ theme }) => ({
        boxShadow: 'none',
        background: theme.palette.background.paper,
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        [theme.breakpoints.up('lg')]: {
            minHeight: '70px',
        },
    }));
    const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
        width: '100%',
        color: theme.palette.text.secondary,
    }));

    return (
        <AppBarStyled position="sticky" color="default">
            <ToolbarStyled>
                <IconButton
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleMobileSidebar}
                    sx={{
                        display: {
                            lg: pathname.includes(links.message) ? 'inline' : 'none',
                            xs: 'inline',
                        },
                    }}
                >
                    <IconMenu width="20" height="20" />
                </IconButton>

                <Box flexGrow={1}>
                    <div className="flex items-center gap-2 select-none">
                        <WrapperAnimation
                            onClick={() => {
                                router.back();
                            }}
                            className="cursor-pointer p-2"
                            hover={{
                                x: -4,
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </WrapperAnimation>
                        <WrapperAnimation
                            onClick={() => {
                                router.forward();
                            }}
                            className="cursor-pointer p-2"
                            hover={{
                                x: 4,
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowRight} />
                        </WrapperAnimation>
                    </div>
                </Box>
                <Stack direction={'row'} alignItems={'center'}>
                    <NotifycationCom
                        icon={
                            <div className="w-full h-full flex items-center justify-center cursor-pointer">
                                <IconBellRinging size="21" stroke="1.5" />
                            </div>
                        }
                    />

                    <Stack spacing={1} direction="row" alignItems="center">
                        <Profile />
                    </Stack>
                </Stack>
            </ToolbarStyled>
        </AppBarStyled>
    );
};

Header.propTypes = {
    sx: PropTypes.object,
};

export default Header;
