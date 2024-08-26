'use client';
import { MainButton } from '@/components';
import { ContainerContent, Header } from '@/components/common';
import Footer from '@/components/common/common-footer/Footer';
import { Stack, Typography } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
    return (
        <html lang="en">
            <body>
                <Header dynamic={false} />
                <ContainerContent className="flex items-center justify-center min-h-screen">
                    {/* <p className=" text-[80px] lg:text-[150px] font-bold text-[#505DE8]">404</p>
                    <span className="text-[32px] lg:text-[48px]">Oops!!! Page not found</span>
                    <p className="text-[18px] text-center lg:text-[28px] mb-10 mt-4">The page you are looking for does not exist. It might have been moved or deleted.</p>
                    <MainButton href={'/'} title="BACK TO HOME" background="bg-[#505DE8]" /> */}
                    <Stack sx={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography
                            sx={{
                                fontWeight: '600',
                                lineHeight: { xs: '80px', md: '80px', lg: '150px' },
                                fontSize: { xs: '80px', md: '80px', lg: '150px' },
                                color: '#505DE8',
                            }}
                        >
                            404
                        </Typography>
                        <Typography
                            sx={{
                                lineHeight: { xs: '32px', md: '32px', lg: '48px' },
                                fontSize: { xs: '32px', md: '32px', lg: '48px' },
                                color: '#333333',
                                my: '16px',
                            }}
                        >
                            Oops!!! Page not found
                        </Typography>
                        <Typography
                            sx={{
                                lineHeight: { xs: '18px', md: '18px', lg: '28px' },
                                fontSize: { xs: '18px', md: '18px', lg: '28px' },
                                color: '#333333',
                                mt: '20px',
                            }}
                        >
                            The page you are looking for does not exist. It might have been moved or deleted.
                        </Typography>
                    </Stack>
                </ContainerContent>
            </body>
        </html>
    );
}
