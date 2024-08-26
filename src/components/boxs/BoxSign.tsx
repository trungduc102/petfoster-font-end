'use client';
import React, { FormEventHandler, MouseEventHandler, ReactNode, useEffect } from 'react';
import { RoudedButton, SocialButton } from '@/components';
import { ContainerContent } from '@/components/common';
import { faSquareFacebook, faSquareGooglePlus } from '@fortawesome/free-brands-svg-icons';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { useSignInWithFacebook, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import Link from 'next/link';
import { auth } from '@/configs/firebase';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';
import { loginWithFacebook, loginWithGoogle } from '@/apis/user';
import { getPreviousUrl } from '@/utils/session';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setToken } from '@/redux/slice/userSlice';
import { links } from '@/datas/links';
export interface IBoxSignProps {
    onSubmit?: FormEventHandler<HTMLFormElement>;
    children: ReactNode;
    title: string;
    titleBtn?: string;
    link?: { link: string; content: string; contentLink: string };
    showForgot?: boolean;
    showReverify?: {
        onClick?: MouseEventHandler<HTMLSpanElement>;
    };
}

export default function BoxSign({
    onSubmit,
    children,
    title,
    titleBtn = 'send',
    link = {
        link: '/register',
        contentLink: 'Sign up',
        content: 'Need an account?',
    },
    showForgot = true,
    showReverify,
}: IBoxSignProps) {
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
        <ContainerContent className="pt-24 text-black-main">
            <Grid container>
                <Grid
                    component={'form'}
                    onSubmit={onSubmit}
                    item
                    xs={12}
                    md={6}
                    lg={6}
                    sx={{
                        borderRight: { xs: 0, md: 1 },
                        borderColor: '#DBDBDB !important',
                        pr: { xs: 0, md: '20px' },
                        pl: { xs: 0, md: '10%' },
                    }}
                >
                    <Typography variant="h3" fontSize={{ xs: 18, md: 22, lg: 32 }} sx={{ mb: '30px' }} fontWeight={600} className="uppercase text-[#4D4D4D]">
                        {title}
                    </Typography>

                    {children}

                    <Stack direction={'row'} sx={{ justifyContent: 'space-between' }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                mt: '20px',
                                fontSize: { xs: '14px', md: '15px', lg: '16px' },
                            }}
                        >
                            {link.content}
                            <Link href={link.link} className="text-blue-primary hover:underline ml-1">
                                {link.contentLink}
                            </Link>
                        </Typography>
                        {showForgot && (
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    mt: '20px',
                                    fontSize: { xs: '14px', md: '15px', lg: '16px' },
                                }}
                            >
                                <Link href={'/reset-password'} className="text-blue-primary hover:underline ml-1">
                                    Forgot password ?
                                </Link>
                            </Typography>
                        )}
                        {showReverify && (
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    mt: '20px',
                                    fontSize: { xs: '14px', md: '15px', lg: '16px' },
                                }}
                            >
                                <span onClick={showReverify?.onClick} className="text-blue-primary hover:underline ml-1">
                                    Send new code to email ?
                                </span>
                            </Typography>
                        )}
                    </Stack>

                    <RoudedButton title={titleBtn} />
                </Grid>
                <Grid
                    item
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pr: { xs: 0, md: '10%' },
                        pl: { xs: 0, md: '20px' },
                        mt: { xs: '20px', md: 0 },
                    }}
                    xs={12}
                    md={6}
                    lg={6}
                >
                    <Box component={'div'}>
                        <span className="text-center w-full block">Or sign in with</span>

                        <div className="grid grid-cols-2 items-center gap-2">
                            <SocialButton onClick={handleLoginWithFacebook} title="Facebook" icon={faSquareFacebook} />
                            <SocialButton onClick={handleLoginWithGoogle} title="Google" background="#0D9488" icon={faSquareGooglePlus} />
                        </div>
                    </Box>
                </Grid>
            </Grid>
        </ContainerContent>
    );
}
