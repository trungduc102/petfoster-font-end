import { Box, Grid, Skeleton, Stack } from '@mui/material';
import React from 'react';
export interface ISekeletonProductProps {}

export default function SekeletonProduct(props: ISekeletonProductProps) {
    return (
        <Grid item lg={3}>
            <Box
                sx={{
                    width: '100%',
                    borderRadius: '8px',
                    p: '20px',
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                }}
            >
                <Skeleton variant="rectangular" width={'100%'} height={'304px'} sx={{ mb: '10px' }} />
                <Stack direction={'row'} sx={{ width: '100%', justifyContent: 'space-between', mb: '10px' }}>
                    <Skeleton animation="wave" width={'50%'} />
                    <Skeleton animation="wave" width={'20%'} />
                </Stack>
                <Stack spacing={'10px'}>
                    <Skeleton variant="rectangular" width={'100%'} />
                    <Skeleton variant="rectangular" width={'40%'} />
                    <Skeleton variant="rectangular" width={'100%'} />
                </Stack>
            </Box>
        </Grid>
    );
}
