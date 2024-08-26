'use client';
import { CardInfo, DynamicInput } from '@/components';
import { Box, Button, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { ChangeEvent, FocusEvent, useEffect, useState } from 'react';
import ComInput from './ComInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toCurrency, toGam } from '@/utils/format';
import Validate from '@/utils/validate';
import { productManageData } from '@/datas/product-manage-data';
import { RepoType, RepoTypeErrors } from '@/configs/types';
import { motion, AnimatePresence } from 'framer-motion';

const initDataErrors = {
    size: '',
    quantity: '',
    inPrice: '',
    outPrice: '',
};

export interface IRepositoryProps {
    dataOusite?: RepoType[];
    onRepos?: (repos: RepoType[]) => void;
}

export default function Repository({ dataOusite, onRepos }: IRepositoryProps) {
    const initData = {
        size: parseInt(productManageData.sizes[0].id),
        quantity: 0,
        inPrice: 0,
        outPrice: 0,
    };

    const [open, setOpen] = useState(false);

    const [data, setData] = useState<RepoType[]>([]);

    const [dataProduct, setdataProduct] = useState(dataOusite);

    const [items, setItems] = useState<RepoType>(initData);

    const [errors, setErrors] = useState<RepoTypeErrors>(initDataErrors);

    const handleChageData = (e: ChangeEvent<HTMLInputElement>) => {
        setItems({
            ...items,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddRepo = () => {
        if (validate()) return;

        setData([...data, items]);
        setItems({ ...initData });
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const dynamicKey = e.target.name as keyof RepoTypeErrors;

        const { message } = Validate.number(e.target.value, dynamicKey);

        if (data.length > 0) {
            // check overlap
            // check data has item has size overlap ?
            const doubleSize = data.some((i) => {
                return i.size == items.size;
            });

            // handle if doubleSize = true
            if (doubleSize) {
                setErrors({
                    ...errors,
                    size: 'Dimensions cannot overlap',
                });
                return;
            }
        }
        setErrors({
            ...errors,
            [dynamicKey]: message,
        });
    };

    useEffect(() => {
        if (dataOusite) {
            setdataProduct(dataOusite);
        }
    }, [dataOusite]);

    const validate = () => {
        let flag = false;
        const validateErrors: RepoTypeErrors = { ...initDataErrors };

        const keys: string[] = Object.keys(validateErrors);

        keys.forEach((key) => {
            const dynamic = key as keyof RepoType;

            if (dynamic !== 'id') {
                const { message, error } = Validate.number(items[dynamic], key);
                validateErrors[dynamic] = message;
                flag = error;
            }
        });

        if (data.length > 0) {
            const doubleSize = data.find((i) => {
                return i.size == items.size;
            });

            // handle if doubleSize = true
            if (doubleSize && Validate.isBlank(validateErrors.size)) {
                validateErrors.size = 'Dimensions cannot overlap';
                flag = !!doubleSize;
            }
        }

        setErrors(validateErrors);

        return flag;
    };

    useEffect(() => {
        if (!onRepos) return;
        onRepos(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
        <CardInfo
            title="Repository"
            action={
                <>
                    <motion.div
                        className="text-lg text-black-main select-none cursor-pointer"
                        whileHover={{
                            rotate: 180,
                        }}
                        onClick={() => setOpen(!open)}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </motion.div>
                </>
            }
        >
            <AnimatePresence>
                {open && (
                    <motion.div exit={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} initial={{ y: 10, opacity: 0 }}>
                        <Grid key={1} container spacing={4}>
                            <Grid item xs={12} md={6} lg={6}>
                                <DynamicInput
                                    dataSelect={productManageData.sizes}
                                    type="number"
                                    title="Size"
                                    propsInput={{
                                        type: 'number',
                                        placeholder: 'Size',
                                        name: 'size',
                                        onChange: handleChageData,
                                        onBlur: handleBlur,
                                        value: items.size,
                                        message: errors.size,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <ComInput
                                    title="Quantity"
                                    propsInput={{
                                        placeholder: 'Quantity',
                                        type: 'number',
                                        name: 'quantity',
                                        onChange: handleChageData,
                                        value: items.quantity,
                                        message: errors.quantity,
                                        onBlur: handleBlur,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <ComInput
                                    title="In price"
                                    propsInput={{
                                        placeholder: 'In price',
                                        type: 'number',
                                        name: 'inPrice',
                                        onChange: handleChageData,
                                        value: items.inPrice,
                                        message: errors.inPrice,
                                        onBlur: handleBlur,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <ComInput
                                    title="Out Price"
                                    propsInput={{
                                        name: 'outPrice',
                                        type: 'number',
                                        placeholder: 'Out Price',
                                        onChange: handleChageData,
                                        value: items.outPrice,
                                        message: errors.outPrice,
                                        onBlur: handleBlur,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={12}>
                                <Stack direction={'row'} justifyContent={'flex-end'}>
                                    <Button
                                        onClick={handleAddRepo}
                                        variant="contained"
                                        endIcon={
                                            <>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </>
                                        }
                                    >
                                        Add Repository
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </motion.div>
                )}
                <Grid key={2} container spacing={4}>
                    <Grid item xs={12} md={12} lg={12}>
                        {(data.length > 0 || (dataProduct && dataProduct?.length > 0)) && (
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
                                                    Size
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    Quantity
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    In Price
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    Out Price
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dataProduct &&
                                            dataProduct.map((item, index) => {
                                                return (
                                                    <TableRow hover key={index + item.size}>
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
                                                        <TableCell>{toGam(item.size)}</TableCell>
                                                        <TableCell align="left">
                                                            <Typography color="textSecondary" variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                                                                {item.quantity}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography color="textSecondary" variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                                                                {toCurrency(item.inPrice)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography color="textSecondary" variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                                                                {toCurrency(item.outPrice)}
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

                                        {data.map((repo, index) => (
                                            <TableRow hover key={index + repo.size}>
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
                                                <TableCell>{toGam(repo.size)}</TableCell>
                                                <TableCell align="left">
                                                    <Typography color="textSecondary" variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                                                        {repo.quantity}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Typography color="textSecondary" variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                                                        {toCurrency(repo.inPrice)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Typography color="textSecondary" variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                                                        {toCurrency(repo.outPrice)}
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

                        {data.length <= 0 && (
                            <Stack alignItems={'center'} justifyContent={'center'} height={'100%'}>
                                <Typography color={'red'}>Add repository for this product</Typography>
                            </Stack>
                        )}
                    </Grid>
                </Grid>
            </AnimatePresence>
        </CardInfo>
    );
}
