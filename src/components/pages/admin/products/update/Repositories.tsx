'use client';
import { CardInfo, Comfirm, DynamicInput, LoadingPrimary, TextField } from '@/components';
import { Box, Button, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography, capitalize } from '@mui/material';
import React, { ChangeEvent, FocusEvent, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroomBall, faEdit, faPlus, faRotate, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toCurrency, toGam } from '@/utils/format';
import { useQuery } from '@tanstack/react-query';
import Validate from '@/utils/validate';
import { productManageData } from '@/datas/product-manage-data';
import { RepoType, RepoTypeErrors } from '@/configs/types';
import { motion, AnimatePresence } from 'framer-motion';
import ComInput from '../ComInput';
import { getRepositories } from '@/apis/admin/product';
import { addRepository, deleteRepository, updateRepository } from '@/apis/admin/repositories';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';
import classNames from 'classnames';
import { DataProductType } from '@/configs/interface';

const dataHead = ['No', 'Id', 'Size', 'Quantity', 'In Price', 'Out Price'];

const initDataErrors = {
    size: '',
    quantity: '',
    inPrice: '',
    outPrice: '',
};

const initData = {
    size: 100,
    quantity: '',
    inPrice: '',
    outPrice: '',
};

type RepoTypeLocalCom = {
    size: number;
    quantity: number | string;
    inPrice: number | string;
    outPrice: number | string;
};

export interface IRepositoriesProps {
    id: string;
    dataProduct: DataProductType;
}

export default function Repositories({ id, dataProduct }: IRepositoriesProps) {
    const repositoriesData = useQuery({
        queryKey: ['Repositories', id],
        queryFn: () => getRepositories(id),
    });

    const [open, setOpen] = useState(false);
    const [data, setData] = useState<RepoType[]>([]);
    const [items, setItems] = useState<RepoTypeLocalCom>(initData);
    const [errors, setErrors] = useState<RepoTypeErrors>(initDataErrors);
    const [editMode, setEditMode] = useState(false);
    const [openComfirmUpdate, setOpenComfirmUpdate] = useState({ open: false, comfirm: 'cancel' });
    const [openComfirmDel, setOpenComfirmDel] = useState({ open: false, comfirm: 'cancel' });
    const [idDelRepo, setidDelRepo] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const dynamicKey = e.target.name as keyof RepoTypeErrors;

        const { message } = Validate.number(e.target.value, capitalize(dynamicKey));
        setErrors({
            ...errors,
            [dynamicKey]: message,
        });
    };

    const handleChageData = (e: ChangeEvent<HTMLInputElement>) => {
        setItems({
            ...items,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        let flag = false;
        let validateErrors: RepoTypeErrors = { ...initDataErrors };

        const keys: string[] = Object.keys(validateErrors);

        keys.forEach((key) => {
            const dynamic = key as keyof RepoType;

            if (dynamic !== 'id') {
                const { message, error } = Validate.number(items[dynamic], capitalize(key));
                validateErrors[dynamic] = message;
                flag = error;
            }
        });

        if (errors.size === '' && data.length > 0 && !editMode) {
            const finedItem = data.find((item) => {
                return item.size + '' === items.size + '';
            });

            if (finedItem) {
                validateErrors = {
                    ...errors,
                    size: 'Size is already, Please choose an other size',
                };
                flag = true;
            }
        }

        setErrors(validateErrors);

        return flag;
    };

    const handleAddRepo = async () => {
        if (validate()) return;

        try {
            const response = await addRepository(id, items as RepoType);

            if (response.errors) {
                toast.error(`Can't add this item`);
                return;
            }

            toast.success(`Add Successfully !`);
            repositoriesData.refetch();
            setItems({ ...initData });
        } catch (error) {
            toast.error(contants.messages.errors.server);
        }
    };

    const handleEdit = (item: RepoType) => {
        setEditMode(true);
        setOpen(true);
        setItems({
            ...item,
        });
        setErrors({
            ...initDataErrors,
        });
    };

    const handleClear = () => {
        setEditMode(false);
        setItems({
            ...initData,
        });
    };

    const handleOpenCofimUpdate = () => {
        if (validate()) return;
        setOpenComfirmUpdate({ ...openComfirmUpdate, open: true });
    };

    const handleOpenCofimDelete = (id: number | undefined) => {
        setidDelRepo(id || null);
        setOpenComfirmDel({ ...openComfirmDel, open: true });
    };

    const handleUpdate = async (value: { open: boolean; comfirm: 'cancel' | 'ok' }) => {
        if (value.comfirm !== 'ok' || !editMode) return;

        try {
            setLoading(true);
            const response = await updateRepository(items as RepoType);
            setLoading(false);
            if (response.errors) {
                toast.error(`Can't update this item`);
                return;
            }

            toast.success(`Update Successfully !`);
            repositoriesData.refetch();
            setItems({ ...initData });
            setEditMode(false);
        } catch (error) {
            setLoading(false);
            toast.error(contants.messages.errors.server);
        }
    };

    const handleDelete = async (value: { open: boolean; comfirm: 'cancel' | 'ok' }) => {
        if (value.comfirm !== 'ok') return;

        if (!idDelRepo) return;

        try {
            setLoading(true);
            const response = await deleteRepository(idDelRepo);
            setLoading(false);
            if (response.errors) {
                toast.error(`Can't delete this item`);
                return;
            }

            toast.success(`Delete Successfully !`);
            repositoriesData.refetch();
            setItems({ ...initData });
            setEditMode(false);
        } catch (error) {
            setLoading(false);
            toast.error(contants.messages.errors.server);
        }
    };

    useEffect(() => {
        if (repositoriesData.data && repositoriesData.data.data) {
            setData([...repositoriesData.data.data]);
        }
    }, [repositoriesData.data]);

    return (
        <div>
            <div className="flex items-center justify-end p-[14px] mb-2 text-2xl">
                <Tooltip title={open ? 'Close new repository' : 'Add new repository'}>
                    <motion.div
                        onClick={() => {
                            setOpen(!open);
                            if (!open) {
                                handleClear();
                            }
                        }}
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
                    <motion.div exit={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} initial={{ y: 10, opacity: 0 }}>
                        <Grid key={1} container spacing={4} p={'14px'}>
                            <Grid item xs={12} md={6} lg={6}>
                                <DynamicInput
                                    dataSelect={productManageData.sizes}
                                    type="number"
                                    title="Size"
                                    propsInput={{
                                        type: 'number',
                                        placeholder: 'Size',
                                        name: 'size',
                                        disabled: editMode,
                                        value: items.size,
                                        message: errors.size,
                                        onChange: handleChageData,
                                        onBlur: handleBlur,
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
                                        value: items.quantity,
                                        message: errors.quantity,
                                        onChange: handleChageData,
                                        onBlur: handleBlur,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <ComInput
                                    title="In price (VND)"
                                    propsInput={{
                                        placeholder: 'In price',
                                        type: 'number',
                                        name: 'inPrice',
                                        value: items.inPrice,
                                        message: errors.inPrice,
                                        onChange: handleChageData,
                                        onBlur: handleBlur,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <ComInput
                                    title="Out Price (VND)"
                                    propsInput={{
                                        name: 'outPrice',
                                        type: 'number',
                                        placeholder: 'Out Price',
                                        value: items.outPrice,
                                        message: errors.outPrice,
                                        onChange: handleChageData,
                                        onBlur: handleBlur,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={12}>
                                <Stack direction={'row'} justifyContent={'flex-end'} spacing={'20px'}>
                                    <Button onClick={handleClear}>
                                        <Tooltip title="Refresh form">
                                            <FontAwesomeIcon className="text-1xl" icon={faRotate} />
                                        </Tooltip>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={editMode ? handleOpenCofimUpdate : handleAddRepo}
                                        endIcon={
                                            <>
                                                <FontAwesomeIcon className="text-1xl" icon={editMode ? faEdit : faPlus} />
                                            </>
                                        }
                                    >
                                        {editMode ? 'Edit Repository' : 'Add Repository'}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </motion.div>
                )}
                <Grid key={2} container spacing={4} p={'14px'}>
                    <Grid item xs={12} md={12} lg={12}>
                        {data.length > 0 && (
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
                                            {dataHead.map((item) => {
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
                                                <TableCell>{'#' + repo.id}</TableCell>
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
                                                    <Button disabled={data.length <= 1} onClick={() => handleOpenCofimDelete(repo.id)}>
                                                        <FontAwesomeIcon
                                                            className={classNames('', {
                                                                'text-red-primary': data.length > 1,
                                                                'text-gray-500': data.length <= 1,
                                                            })}
                                                            icon={faTrash}
                                                        />
                                                    </Button>
                                                    <Button onClick={() => handleEdit(repo)}>
                                                        <FontAwesomeIcon className="" icon={faEdit} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        )}
                    </Grid>

                    {(loading || repositoriesData.isLoading) && <LoadingPrimary />}

                    <Comfirm
                        title={`Comfirm Update`}
                        subtitle={
                            <>
                                <p>
                                    {`You want to update `}
                                    <b>
                                        {toGam(items.size)} of {dataProduct.name}
                                    </b>
                                </p>
                            </>
                        }
                        open={openComfirmUpdate.open}
                        setOpen={setOpenComfirmUpdate}
                        onComfirm={handleUpdate}
                    />
                    <Comfirm
                        title={`Comfirm Delete`}
                        subtitle={
                            <>
                                <p>
                                    {`You want to delete id `}
                                    <b>
                                        #{idDelRepo} of {id}
                                    </b>
                                </p>
                            </>
                        }
                        open={openComfirmDel.open}
                        setOpen={setOpenComfirmDel}
                        onComfirm={handleDelete}
                    />
                </Grid>
            </AnimatePresence>
        </div>
    );
}
