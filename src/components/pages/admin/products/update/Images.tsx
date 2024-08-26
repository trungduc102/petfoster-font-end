import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Box, Button, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getImages } from '@/apis/admin/product';
import { IImage } from '@/configs/interface';
import { Comfirm, LoadingPrimary } from '@/components';
import { fileToUrl } from '@/utils/format';
import classNames from 'classnames';
import { addImagesByIdProduct, deleteImagesByIdProduct } from '@/apis/admin/images';
import { contants } from '@/utils/contants';

const listHead = ['No', 'Image', 'Name'];

export interface IImagesProps {
    id: string;
}

export default function Images({ id }: IImagesProps) {
    const maxImage = 4;

    const imagesData = useQuery({
        queryKey: ['images/product', id],
        queryFn: () => getImages(id),
    });

    const urlsPreview: string[] = [];

    const [data, setData] = useState<File[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageDelete, setImageDelete] = useState<IImage | null>(null);
    const [openComfirm, setOpenComfirm] = useState({ open: false, comfirm: 'cancel' });
    const handleChange = ({ currentTarget: { files } }: ChangeEvent<HTMLInputElement>) => {
        if (files && files.length) {
            const arrFile = Array.from(files);

            arrFile.reverse();

            const condition = maxImage - (imagesData.data?.data.length || 0);

            if (arrFile.length > condition || data.length > condition) {
                setData([...arrFile.splice(0, condition)]);
                toast.warn('Limit image for a product is 4 !');
                return;
            }

            if (data.length >= condition) {
                if (data.length > condition) {
                    toast.warn('Limit image for a product is 4 !');
                }

                setData([...data.reverse().splice(0, condition)]);

                return;
            }

            if (data.length + arrFile.length >= condition) {
                if (data.length + arrFile.length > condition) {
                    toast.warn('Limit image for a product is 4 !');
                }
                const subArray = [...arrFile, ...data].splice(0, condition);
                setData([...subArray]);
                return;
            }

            setData((existing) => [...existing, ...arrFile]);
        }
    };

    const handleSubmit = async () => {
        if (imagesData.data && imagesData.data.data.length + data.length > maxImage) {
            toast.warn('Limit image for a product is 4 !');
            return;
        }

        try {
            setLoading(true);
            const reponse = await addImagesByIdProduct(id, data);
            setLoading(false);
            if (reponse.errors) {
                toast.error(reponse.message);
                return;
            }

            setData([]);
            imagesData.refetch();
            toast.success(reponse.message);
        } catch (error) {
            setLoading(false);
            toast.error(contants.messages.errors.server);
        }
    };

    const handleOpenComfirm = (image: IImage) => {
        setImageDelete(image);
        setOpenComfirm({ ...openComfirm, open: true });
    };

    const handleDelete = async (value: { open: boolean; comfirm: 'cancel' | 'ok' }) => {
        if (value.comfirm === 'cancel' || imageDelete === null) return;

        try {
            setLoading(true);
            const response = await deleteImagesByIdProduct({ id, idImage: imageDelete.id });
            setLoading(false);

            if (response.errors) {
                toast.error(response.message);
                return;
            }

            imagesData.refetch();
            toast.success(response.message);
        } catch (error) {
            setLoading(false);
            toast.success(contants.messages.errors.server);
        }
        console.log(123);
    };

    useEffect(() => {
        return () => {
            if (urlsPreview && urlsPreview.length) {
                urlsPreview.forEach((img) => {
                    URL.revokeObjectURL(img);
                });
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="select-none">
            <div className="flex items-center justify-end mb-2 text-2xl w-full px-[14px]">
                <Tooltip title={open ? 'Close new images' : 'Add new images'}>
                    <motion.div
                        onClick={() => setOpen(!open)}
                        animate={{
                            rotate: open ? 45 : 0,
                        }}
                    >
                        <FontAwesomeIcon className="cursor-pointer" icon={faPlus} />
                    </motion.div>
                </Tooltip>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div exit={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} initial={{ y: 10, opacity: 0 }} className="flex items-center justify-center mt-8">
                        <div className="flex items-center justify-center w-2/5 h-full">
                            <label
                                className="w-full h-full max-h-10 border-4 border-violet-primary px-[20px] py-[40px] lg:p-[40px]  rounded-xl border-dashed flex items-center justify-center text-sm lg:text-xl"
                                htmlFor="image-file"
                            >
                                <span>Choose your images</span>
                            </label>
                            <input id="image-file" accept="image/*" name="images" multiple hidden type="file" onChange={handleChange} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Grid container spacing={4} p={'14px'} mt={'20px'}>
                <Grid item xs={12} md={12} lg={12}>
                    {imagesData.data && imagesData.data.data && (
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
                                        {listHead.map((item) => {
                                            return (
                                                <TableCell key={item}>
                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                        {item}
                                                    </Typography>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {imagesData.data.data.map((img, index) => (
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
                                                <Avatar src={img.image} variant="rounded" />
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography color="textSecondary" variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                                                    {img.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button disabled={imagesData.data.data.length <= 1} onClick={() => handleOpenComfirm(img)}>
                                                    <FontAwesomeIcon
                                                        className={classNames('', {
                                                            'text-red-primary': imagesData.data.data.length > 1,
                                                            'text-gray-500': imagesData.data.data.length <= 1,
                                                        })}
                                                        icon={faTrash}
                                                    />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {data.length > 0 &&
                                        data.map((img, index) => (
                                            <TableRow hover key={index}>
                                                <TableCell>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '15px',
                                                            fontWeight: '500',
                                                        }}
                                                    >
                                                        {imagesData.data && imagesData.data.data.length + index + 1}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Avatar
                                                        src={fileToUrl(img, (url) => {
                                                            urlsPreview.push(url);
                                                        })}
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
                                                        <FontAwesomeIcon className="text-red-primary" icon={faTrash} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </Box>
                    )}

                    {(imagesData.isLoading || loading) && <LoadingPrimary />}
                </Grid>

                {data.length > 0 && (
                    <Grid item xs={12} md={12} lg={12}>
                        <Stack p={'14px'} direction={'row'} justifyContent={'flex-end'}>
                            <Button onClick={handleSubmit} type="submit" variant="contained">
                                Update
                            </Button>
                        </Stack>
                    </Grid>
                )}

                <Comfirm
                    title={`Comfirm Delete`}
                    subtitle={
                        <>
                            <p>
                                You want to Delete <br /> <b>{`${imageDelete?.name} of ${id}`}</b>. This action will be irreversible
                            </p>
                        </>
                    }
                    open={openComfirm.open}
                    setOpen={setOpenComfirm}
                    onComfirm={handleDelete}
                />
            </Grid>
        </div>
    );
}
