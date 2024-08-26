/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { ChangeEvent, memo, useEffect, useState } from 'react';
import { CardInfo, Notifycation } from '..';
import { Avatar, Box, Button, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { fileToUrl, toDataURL } from '@/utils/format';
import { INotifycationProps } from '../notifycations/Notifycation';

export interface ISelectImagesProps {
    dataOutsite?: { id: string; image: string }[];
    onImages?: (files: File[]) => void;
}

function SelectImages({ dataOutsite, onImages }: ISelectImagesProps) {
    const [data, setData] = useState<File[]>([]);
    const [dataImagesProduct, setdataImagesProduct] = useState<{ id: string; image: string }[]>(dataOutsite || []);

    const [notifycation, setNotifycation] = useState<INotifycationProps>({ open: false, title: '', type: 'error' });

    const urlsPreview: string[] = [];

    // {files: File[], urls: []}
    const handleChange = ({ currentTarget: { files } }: ChangeEvent<HTMLInputElement>) => {
        if (files && files.length) {
            const arrFile = Array.from(files);

            arrFile.reverse();

            const condition = 4 - dataImagesProduct.length;

            if (arrFile.length > condition || data.length > condition) {
                setData([...arrFile.splice(0, condition)]);
                setNotifycation({ ...notifycation, title: 'Limit images is 4 !', open: true });
                return;
            }

            if (data.length >= condition) {
                if (data.length > condition) {
                    setNotifycation({ ...notifycation, title: 'Limit images is 4 !', open: true });
                }

                setData([...data.reverse().splice(0, condition)]);

                return;
            }

            if (data.length + arrFile.length >= condition) {
                if (data.length + arrFile.length > condition) {
                    setNotifycation({ ...notifycation, title: 'Limit images is 4 !', open: true });
                }
                const subArray = [...arrFile, ...data].splice(0, condition);
                setData([...subArray]);
                return;
            }

            setData((existing) => [...existing, ...arrFile]);
        }
    };

    useEffect(() => {
        if (!onImages) return;

        onImages(data);
    }, [data]);

    useEffect(() => {
        setdataImagesProduct(dataOutsite || []);
    }, [dataOutsite]);

    useEffect(() => {
        return () => {
            if (urlsPreview && urlsPreview.length) {
                urlsPreview.forEach((img) => {
                    URL.revokeObjectURL(img);
                });
            }
        };
    }, []);

    return (
        <CardInfo title="Images">
            <Grid container spacing={4}>
                <Grid item xs={12} md={4} lg={4}>
                    <div className="flex items-center justify-center w-full h-full">
                        <label
                            className="w-full h-full max-h-10 border-4 border-violet-primary px-[20px] py-[40px] lg:p-[40px]  rounded-xl border-dashed flex items-center justify-center text-sm lg:text-xl"
                            htmlFor="image-file"
                        >
                            <span>Choose your images</span>
                        </label>
                        <input id="image-file" accept="image/*" name="images" multiple hidden type="file" onChange={handleChange} />
                    </div>
                </Grid>

                <Grid item xs={12} md={8} lg={8}>
                    {(data.length > 0 || dataImagesProduct.length > 0) && (
                        <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                            <Table
                                aria-label="simple table"
                                sx={{
                                    whiteSpace: 'nowrap',
                                    mt: 2,
                                }}
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                No
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                Image
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                Name
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataImagesProduct &&
                                        dataImagesProduct.map((item, index) => {
                                            console.log(dataImagesProduct.length);
                                            return (
                                                <TableRow hover key={index}>
                                                    <TableCell>
                                                        <Typography
                                                            sx={{
                                                                fontSize: '15px',
                                                                fontWeight: '500',
                                                            }}
                                                        >
                                                            {index + 1}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Avatar
                                                            src={
                                                                item.image ||
                                                                'https://petshopsaigon.vn/wp-content/uploads/2019/09/hat-cho-cho-truong-thanh-royal-canin-poodle-adult-1-1.jpg'
                                                            }
                                                            variant="rounded"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Typography color="textSecondary" variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                                                            {'image 1' + index}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Button>
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}

                                    {data.map((img, index) => (
                                        <TableRow hover key={index}>
                                            <TableCell>
                                                <Typography
                                                    sx={{
                                                        fontSize: '15px',
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {index + 1}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Avatar
                                                    src={
                                                        fileToUrl(img, (url) => {
                                                            urlsPreview.push(url);
                                                        }) || 'https://file1.hutech.edu.vn/file/hutechnextgen/images/hinhcanhan/617404e2c6232.jpg'
                                                    }
                                                    variant="rounded"
                                                />
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography color="textSecondary" variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                                                    {img.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    onClick={() => {
                                                        data.splice(index, 1);
                                                        setData([...data]);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    )}

                    {/* {data.length <= 0 && dataImagesProduct && dataImagesProduct.length && (
                        <Stack alignItems={'center'} justifyContent={'center'} height={'100%'}>
                            <Typography color={'red'}>No image selected</Typography>
                        </Stack>
                    )} */}
                </Grid>
            </Grid>
            <Notifycation
                onClose={() => {
                    setNotifycation({ ...notifycation, open: false });
                }}
                {...notifycation}
            />
        </CardInfo>
    );
}

export default memo(SelectImages);
