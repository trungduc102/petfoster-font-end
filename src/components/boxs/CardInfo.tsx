import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

export interface CardInfoProps {
    children?: ReactNode;
    title?: string;
    action?: ReactNode;
}

export default function CardInfo({ children, title, action }: CardInfoProps) {
    return (
        <Card elevation={0} variant={undefined}>
            <CardContent>
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    {title && <Typography sx={{ fontWeight: '500', fontSize: '14px' }}>{title}</Typography>}
                    {action}
                </Stack>
                <Box mt={3}>{children}</Box>
            </CardContent>
        </Card>
    );
}
