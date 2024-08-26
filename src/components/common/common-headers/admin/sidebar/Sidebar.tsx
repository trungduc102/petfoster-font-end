import { useMediaQuery, Box, Drawer } from '@mui/material';
import Logo from '../shared/logo/Logo';
import SidebarItems from './SidebarItems';
import { usePathname } from 'next/navigation';
import { links } from '@/datas/links';

interface ItemType {
    isMobileSidebarOpen: boolean;
    onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
    isSidebarOpen: boolean;
}

const Sidebar = ({ isMobileSidebarOpen, onSidebarClose, isSidebarOpen }: ItemType) => {
    const pathname = usePathname();

    const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg')) && !pathname.includes(links.message);

    const sidebarWidth = '270px';

    if (lgUp) {
        return (
            <Box
                sx={{
                    width: sidebarWidth,
                    flexShrink: 0,
                }}
            >
                {/* ------------------------------------------- */}
                {/* Sidebar for desktop */}
                {/* ------------------------------------------- */}
                <Drawer
                    anchor="left"
                    open={isSidebarOpen}
                    variant="permanent"
                    PaperProps={{
                        sx: {
                            width: sidebarWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    {/* ------------------------------------------- */}
                    {/* Sidebar Box */}
                    {/* ------------------------------------------- */}
                    <div className="scroll w-full h-full">
                        <Box
                            sx={{
                                height: '100%',
                            }}
                        >
                            {/* ------------------------------------------- */}
                            {/* Logo */}
                            {/* ------------------------------------------- */}
                            <Box px={3}>
                                <Logo />
                            </Box>
                            <Box>
                                {/* ------------------------------------------- */}
                                {/* Sidebar Items */}
                                {/* ------------------------------------------- */}
                                <SidebarItems />
                            </Box>
                        </Box>
                    </div>
                </Drawer>
            </Box>
        );
    }

    return (
        <Drawer
            className="scroll"
            anchor="left"
            open={isMobileSidebarOpen}
            onClose={onSidebarClose}
            variant="temporary"
            PaperProps={{
                sx: {
                    width: sidebarWidth,
                    boxShadow: (theme) => theme.shadows[8],
                },
            }}
        >
            {/* ------------------------------------------- */}
            {/* Logo */}
            {/* ------------------------------------------- */}
            <Box px={2}>
                <Logo />
            </Box>
            {/* ------------------------------------------- */}
            {/* Sidebar For Mobile */}
            {/* ------------------------------------------- */}
            <SidebarItems />
        </Drawer>
    );
};

export default Sidebar;
