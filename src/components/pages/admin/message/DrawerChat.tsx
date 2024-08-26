import { WrapperAnimation } from '@/components';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import { Avatar, SwipeableDrawer } from '@mui/material';
import React from 'react';
import { getUserManageWithUsername } from '@/apis/admin/user';
import { contants } from '@/utils/contants';

export interface IDrawerChatProps {
    open: boolean;
    username: string;
    setOpen: (open: boolean) => void;
}

export default function DrawerChat({ open, username, setOpen }: IDrawerChatProps) {
    const dataUser = useQuery({
        queryKey: ['updateUser', username],
        queryFn: () => getUserManageWithUsername(username),
    });

    if (dataUser.error) {
        setOpen(false);
        return;
    }

    const data = dataUser?.data?.data;

    if (!data) {
        setOpen(false);
        return;
    }

    const toggleDrawer = () => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event && event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }

        setOpen(!open);
    };

    return (
        <div>
            <React.Fragment>
                <SwipeableDrawer onClose={toggleDrawer()} onOpen={toggleDrawer()} anchor={'right'} open={open}>
                    <div className="md:w-[440px] h-full pt-9 px-5 text-black-main">
                        <div className="flex items-center justify-between font-bold text-xl">
                            <h2>Profile details</h2>
                            <WrapperAnimation onClick={toggleDrawer()} className="text-lg flex items-center justify-center cursor-pointer" hover={{}}>
                                <FontAwesomeIcon icon={faXmark} />
                            </WrapperAnimation>
                        </div>

                        <div className="flex flex-col items-center justify-center w-full mt-9 gap-3">
                            <Avatar
                                sx={{
                                    width: '102px',
                                    height: '102px',
                                    cursor: 'pointer',
                                }}
                                src={data.avatar || contants.avartarDefault}
                            />
                            <h4 className="font-bold text-xl break-all">{data.username}</h4>

                            <ul className="w-full flex flex-col justify-start gap-5">
                                <li>
                                    <span className="text-[#797878]">Phone</span>
                                    <p>{data.phone || 'phone not yet'}</p>
                                </li>
                                <li>
                                    <span className="text-[#797878]">Email</span>
                                    <p>{data.email}</p>
                                </li>
                                <li>
                                    <span className="text-[#797878]">Address</span>
                                    <p>{data.address || 'address not yet'}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </SwipeableDrawer>
            </React.Fragment>
        </div>
    );
}
