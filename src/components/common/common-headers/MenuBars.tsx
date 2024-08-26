'use client';
import classNames from 'classnames';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar } from '@mui/material';
import React, { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomBadge, SocialButton, WrapperAnimation } from '@/components';
import { listProfile, navarMobileNonLogin, navbar } from '@/datas/header';
import Link from 'next/link';
import { contants } from '@/utils/contants';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { RootState } from '@/configs/types';
import { faSquareFacebook, faSquareGooglePlus } from '@fortawesome/free-brands-svg-icons';
import { useRouter } from 'next/navigation';
import { useSignInWithFacebook, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '@/configs/firebase';
import { loginWithFacebook, loginWithGoogle } from '@/apis/user';
import { setToken } from '@/redux/slice/userSlice';
import { toast } from 'react-toastify';
import { getPreviousUrl } from '@/utils/session';
import { links } from '@/datas/links';

export interface IMenuBarsProps {
    isScroll: boolean;
}

function MenuBars({ isScroll }: IMenuBarsProps) {
    const [open, setOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const { cartUser } = useAppSelector((state: RootState) => state.cartReducer);
    const { user } = useAppSelector((state: RootState) => state.userReducer);

    const handleClick = () => {
        setOpen(!open);
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    const router = useRouter();

    const dispatch = useAppDispatch();

    const [signInWithFacebook, userFb, _loadingFb, errorFb] = useSignInWithFacebook(auth);
    const [signInWithGoogle, userGg, loadingGg, errorGg] = useSignInWithGoogle(auth);

    useEffect(() => {
        if (!userFb) return;

        (async () => {
            try {
                const res = await loginWithFacebook({ uuid: userFb.user.uid, avartar: userFb.user.photoURL || '', username: userFb.user.displayName || '' });

                if (res.errors && res.message === '401') {
                    toast.warning('Your account has not been verified. Please check your email');
                    return;
                }

                if (res.errors && Object.keys(res.errors).length > 0) {
                    toast.error(contants.messages.errors.loginWithFacebook);

                    return;
                }

                // all good
                handleForward();
                dispatch(setToken(res.token));
            } catch (error) {
                console.log('error in login page: ' + error);
                toast.error(contants.messages.errors.server);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userFb]);

    useEffect(() => {
        if (!userGg) return;

        (async () => {
            try {
                const res = await loginWithGoogle({
                    uuid: userGg.user.uid,
                    avartar: userGg.user.photoURL || '',
                    username: userGg.user.displayName || '',
                    email: userGg.user.email || '',
                });

                if (res.errors && res.message === '401') {
                    toast.warning('Your account has not been verified. Please check your email');
                    return;
                }

                if (res.errors && Object.keys(res.errors).length > 0) {
                    toast.error(contants.messages.errors.loginWithFacebook);

                    return;
                }

                // all good
                handleForward();
                dispatch(setToken(res.token));
            } catch (error) {
                console.log('error in login page: ' + error);
                toast.error(contants.messages.errors.server);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userGg]);

    const handleLoginWithFacebook = () => {
        signInWithFacebook();
    };
    const handleLoginWithGoogle = () => {
        signInWithGoogle();
    };

    const handleForward = () => {
        const prevUrl = getPreviousUrl();
        if (prevUrl) {
            router.push(prevUrl);
        } else {
            router.push(links.home);
        }
    };

    if (errorFb) {
        toast.error(contants.messages.errors.loginWithFacebook);
        return;
    }

    return (
        <>
            {isClient ? (
                <>
                    <WrapperAnimation
                        onClick={handleClick}
                        className={classNames('cursor-pointer text-xl', {
                            'text-[#111]': isScroll,
                            'text-white': !isScroll,
                        })}
                    >
                        <CustomBadge badgeContent={cartUser.length} onClick={() => setOpen((prev) => !prev)} invisible={open || cartUser.length <= 0}>
                            <FontAwesomeIcon icon={faBars} />
                        </CustomBadge>
                    </WrapperAnimation>

                    <AnimatePresence>
                        {open && (
                            <div onClick={() => setOpen(!open)} className="fixed inset-0 bg-[rgba(0,0,0,.4)] flex text-[#757575]">
                                <motion.div
                                    onClick={(e) => e.stopPropagation()}
                                    initial={{ x: '-60%', opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: '-60%', opacity: 0 }}
                                    className="w-[80%] h-screen bg-white relative pt-4 pl-4 overflow-auto"
                                >
                                    {user && (
                                        <>
                                            <div className="flex flex-col gap-2 pt-4 pl-5 mb-5">
                                                <Avatar
                                                    alt="avartar"
                                                    sx={{ width: 80, height: 80 }}
                                                    className="cursor-pointer border-2"
                                                    src={user?.avatar || contants.avartarDefault}
                                                />
                                                <h2 className="font-medium ">{user.displayName || user?.username}</h2>
                                            </div>
                                            <ul className="py-2 mb-3 border-b border-[#ebebeb] text-sm">
                                                {listProfile.map((item) => {
                                                    return (
                                                        <li
                                                            key={item.href}
                                                            className="p-4 pr-0 font-medium rounded-tl-lg rounded-bl-lg hover:bg-[#f0f0f0] transition-all ease-linear capitalize"
                                                        >
                                                            <Link href={item.href} className="flex gap-4 items-center">
                                                                <CustomBadge badgeContent={cartUser.length}>
                                                                    <FontAwesomeIcon className=" h-5 w-5" icon={item.icon} />
                                                                </CustomBadge>
                                                                <span>{item.title}</span>
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </>
                                    )}

                                    {!user && (
                                        <>
                                            <ul className="py-2 text-sm mb-7">
                                                {navarMobileNonLogin.map((item) => {
                                                    return (
                                                        <li
                                                            key={item.href}
                                                            className="p-4 pr-0 font-medium rounded-tl-lg rounded-bl-lg hover:bg-[#f0f0f0] transition-all ease-linear "
                                                        >
                                                            <Link href={item.href} className="flex gap-4 items-center">
                                                                {item.title}
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                                <div className="pr-4">
                                                    <SocialButton onClick={handleLoginWithFacebook} maxWidth="max-w-full" title="Facebook" icon={faSquareFacebook} />
                                                    <SocialButton
                                                        onClick={handleLoginWithGoogle}
                                                        maxWidth="max-w-full"
                                                        title="Google"
                                                        background="#0D9488"
                                                        icon={faSquareGooglePlus}
                                                    />
                                                </div>
                                            </ul>
                                        </>
                                    )}

                                    <ul className="py-2 text-sm mb-7">
                                        {navbar.map((item) => {
                                            return (
                                                <li key={item.href} className="p-4 pr-0 font-medium rounded-tl-lg rounded-bl-lg hover:bg-[#f0f0f0] transition-all ease-linear ">
                                                    <Link href={item.href} className="flex gap-4 items-center">
                                                        {item.title}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </>
            ) : (
                ''
            )}
        </>
    );
}

export default memo(MenuBars);
