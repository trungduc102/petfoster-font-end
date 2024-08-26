'use client';
import { faChevronDown, faChevronUp, faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import style from './styles/createorupdate.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, Button, Grid, Stack, Typography } from '@mui/material';
import classNames from 'classnames';
import { useQuery } from '@tanstack/react-query';
import React, { ChangeEvent, FocusEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { contants } from '@/utils/contants';
import { AvartarEdit, Comfirm, DivTextfield, LoadingPrimary } from '@/components';
import moment from 'moment';
import { getUserManage, updateRoleUser, updateUserManage } from '@/apis/admin/user';
import { IUserManage } from '@/configs/interface';
import Validate from '@/utils/validate';
import { toast } from 'react-toastify';
import { useAppSelector } from '@/hooks/reduxHooks';
import { RoleType, RootState } from '@/configs/types';
import { RolesName } from '@/configs/enum';
import { convertRoleToId } from '@/utils/format';

export interface ICreateOrUpdateUserProps {
    param: string | 'create';
}

const initdata: IUserManage = {
    id: '',
    username: '',
    fullname: '',
    birthday: '',
    gender: true,
    phone: '',
    avatar: '',
    email: '',
    role: 'ROLE_USER',
    createAt: '',
    password: '',
    active: true,
};

interface IErrors {
    username: string;
    fullname: string;
    birthday: string;
    gender: string;
    phone: string;
    avatar: string;
    email: string;
}

const initdataErrors: IErrors = {
    username: '',
    fullname: '',
    birthday: '',
    gender: '',
    phone: '',
    avatar: '',
    email: '',
};

export default function UpdateUser({ param }: ICreateOrUpdateUserProps) {
    let prevData = useRef<{ data: IUserManage; avatar: string } | undefined>();

    const { user } = useAppSelector((state: RootState) => state.userReducer);

    const dataUser = useQuery({
        queryKey: ['updateUser', param],
        queryFn: () => getUserManage(param || ''),
    });

    const [avartar, setAvartar] = useState(contants.avartarDefault);
    const [openEditor, setOpenEditor] = useState(false);
    const [openPassword, setOpenPassword] = useState(param === 'create');
    const [errors, setErrors] = useState({ ...initdataErrors });
    const [openComfirm, setOpenComfirm] = useState({ open: false, comfirm: 'cancel' });
    const [data, setData] = useState(initdata);
    const [role, setRole] = useState(data.role as RoleType);
    const [showButtonUpdate, setShowButtonUpdate] = useState(false);

    const [loading, setLoading] = useState(false);

    const listRoles = [
        {
            id: 'ROLE_USER',
            name: 'User',
        },
        {
            id: 'ROLE_ADMIN',
            name: 'Admin',
        },
    ];

    if ((data.role as RoleType) === 'ROLE_SUPER') {
        listRoles.push({
            id: contants.roles.superRole,
            name: 'Super',
        });
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };
    const handleChangeRole = (e: ChangeEvent<HTMLInputElement>) => {
        setRole(e.target.value as RoleType);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const dynamicKey = e.target.name as keyof IErrors;

        const { message } = Validate[dynamicKey](e.target.value);
        setErrors({
            ...errors,
            [dynamicKey]: message,
        });
    };

    const validate = () => {
        let flag = false;

        flag = Object.values(errors).some((item) => {
            return item.length > 1;
        });

        return flag;
    };

    const handleUpdate = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate()) return;

        setOpenComfirm({ ...openComfirm, open: true });
    };

    const handleComfirm = async (v: { open: boolean; comfirm: 'cancel' | 'ok' }) => {
        if (validate() || v.comfirm === 'cancel') return;

        if ((user?.role as RoleType) === 'ROLE_SUPER' && (data.role as RoleType) !== role) {
            const res = await updateRoleUser({ id: data.id, roleId: convertRoleToId(role) });
        }

        try {
            setLoading(true);
            const response = await updateUserManage({ ...data, avatar: avartar });
            setLoading(false);

            if (response.errors) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);
            dataUser.refetch();
        } catch (error) {
            setLoading(false);
            toast.error(contants.messages.errors.server);
        }
    };

    useEffect(() => {
        if (dataUser.data && dataUser.data.data) {
            const objData = {
                ...dataUser.data.data,
            };
            setData(objData);
            setAvartar(dataUser.data.data.avatar || contants.avartarDefault);
            setRole(dataUser.data.data.role as RoleType);

            // set prev data after update to compare and show btn
            prevData.current = { data: { ...objData }, avatar: dataUser.data.data.avatar || contants.avartarDefault };
        }
    }, [dataUser.data]);

    useEffect(() => {
        if (!prevData.current) return;

        if (JSON.stringify(prevData.current.data) != JSON.stringify(data) || prevData.current.avatar != avartar || prevData.current.data.role !== role) {
            setShowButtonUpdate(true);
        } else {
            setShowButtonUpdate(false);
        }
    }, [data, avartar, role]);

    return (
        <div>
            <Grid container spacing={4} component={'form'} onSubmit={handleUpdate}>
                <Grid item xs={12} md={12} lg={12}>
                    <div className="flex items-end justify-between select-none">
                        <div className="flex items-center w-full gap-6">
                            <div
                                className={classNames('relative rounded-full overflow-hidden', {
                                    [style['avatar']]: true,
                                })}
                            >
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                    }}
                                    alt="avatar"
                                    src={avartar || contants.avartarDefault}
                                />

                                <div
                                    onClick={() => setOpenEditor(true)}
                                    className={classNames(
                                        'absolute bg-[rgba(0,0,0,.4)] inset-0 flex items-center justify-center text-white transition-all ease-linear cursor-pointer',
                                        {
                                            [style['avatar-backdrop']]: true,
                                        },
                                    )}
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </div>
                            </div>

                            <div className="text-xl font-semibold text-black-main">
                                <h2>{data.displayName || data.username}</h2>
                                <div className="text-xs text-gray-400 font-normal mt-1 flex flex-col gap-[2px]">
                                    <p>id: {data.id}</p>
                                    <p>username: {data.username}</p>
                                    <p>active: {data.active + ''}</p>
                                    <span className="">created: {moment(data.createAt).fromNow()}</span>
                                </div>
                            </div>
                        </div>
                        {param !== 'create' && (
                            <div
                                onClick={() => setOpenPassword(!openPassword)}
                                className="text-blue-primary text-sm whitespace-nowrap hover:underline cursor-pointer flex gap-2 items-center"
                            >
                                <span>Show password</span>
                                <FontAwesomeIcon icon={!openPassword ? faChevronDown : faChevronUp} />
                            </div>
                        )}
                    </div>
                </Grid>
                {param === 'create' && (
                    <Grid item xs={12} md={12} lg={12}>
                        <DivTextfield
                            propsInput={{
                                name: 'username',
                                placeholder: 'khavt',
                                onBlur: handleBlur,
                                onChange: handleChange,
                                message: errors.username,
                                value: data.username,
                            }}
                            label="Username"
                        />
                    </Grid>
                )}

                <Grid item xs={12} md={6} lg={6}>
                    <div className="flex flex-col gap-[40px]">
                        <DivTextfield
                            propsInput={{
                                name: 'fullname',
                                type: 'fullname',
                                placeholder: 'Võ Thanh Kha',
                                value: data.fullname,
                                onBlur: handleBlur,
                                onChange: handleChange,
                                message: errors.fullname,
                            }}
                            label="Fullname"
                        />
                        <DivTextfield
                            propsInput={{
                                name: 'phone',
                                type: 'phone',
                                placeholder: '0344507492',
                                value: data.phone || '',
                                onBlur: handleBlur,
                                onChange: handleChange,
                                message: errors.phone,
                            }}
                            label="Phone"
                        />
                        <DivTextfield
                            propsInput={{
                                name: 'email',
                                type: 'email',
                                disabled: true,
                                placeholder: 'kha@gmail.com',
                                value: data.email,
                                onBlur: handleBlur,
                                onChange: handleChange,
                                message: errors.email,
                            }}
                            label="Email ( unique )"
                        />
                    </div>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <div className="flex flex-col gap-[40px]">
                        <DivTextfield
                            dataSelect={[
                                {
                                    id: 'true',
                                    name: 'Male',
                                },
                                {
                                    id: 'false',
                                    name: 'Female',
                                },
                            ]}
                            propsInput={{
                                name: 'gender',
                                value: data.gender + '',
                                onBlur: handleBlur,
                                onChange: handleChange,
                                message: errors.gender,
                            }}
                            label="Gender"
                        />
                        <DivTextfield
                            dataSelect={listRoles}
                            propsInput={{
                                name: 'role',
                                type: 'role',
                                value: role,
                                onChange: handleChangeRole,
                                disabled: user?.role !== (contants.roles.superRole as RoleType) || (data.role as RoleType) === 'ROLE_SUPER',
                            }}
                            label="Role"
                        />
                        <DivTextfield
                            propsInput={{
                                name: 'birthday',
                                type: 'date',
                                value: data.birthday || '',
                                onBlur: handleBlur,
                                onChange: handleChange,
                                message: errors.birthday,
                            }}
                            label="Birthday"
                        />
                    </div>
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                    <AnimatePresence>
                        {openPassword && (
                            <motion.div
                                initial={{ y: -10, opacity: 0 }}
                                exit={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="relative flex justify-between items-center gap-[32px] pb-8"
                            >
                                <DivTextfield
                                    showEye={true}
                                    propsInput={{
                                        name: 'password',
                                        type: 'password',
                                        value: data.password,
                                    }}
                                    label="Password"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                    <Stack direction={'row'} justifyContent={'flex-end'}>
                        {showButtonUpdate && (
                            <Button type="submit" variant="contained">
                                {param !== 'create' ? 'Update' : 'Create'}
                            </Button>
                        )}
                    </Stack>
                </Grid>
            </Grid>

            <AvartarEdit
                setOpen={setOpenEditor}
                onAvartar={(avatar) => {
                    setAvartar(avatar || contants.avartarDefault);
                }}
                open={openEditor}
            />

            <Comfirm
                title={'Comfirm update user'}
                subtitle={
                    <>
                        {'Are you sure update '} <b>{data.username}</b>
                    </>
                }
                open={openComfirm.open}
                setOpen={setOpenComfirm}
                onComfirm={handleComfirm}
            />

            {(loading || dataUser.isLoading) && <LoadingPrimary />}
        </div>
    );
}
