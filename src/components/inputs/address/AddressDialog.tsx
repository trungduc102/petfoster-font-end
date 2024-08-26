'use client';
import { AddressForm, ListAddress, WrapperAnimation } from '@/components';
import WraperDialog from '@/components/dialogs/WraperDialog';
import { AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { faArrowLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { createContext, useEffect, useState } from 'react';
import { getProvinces } from '@/apis/outside';
import { IListAddressProps } from './ListAddress';
import { IAddressFormProps } from './AddressForm';
import { IInfoAddress } from '@/configs/interface';

export const AddressDialogContext = createContext<{
    back: () => void;
    resetList?: () => void;
}>({ back: () => {} });

export interface IAddressDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    handleSwictToForm?: (callback: () => void) => void;
    onData?: (data: IInfoAddress) => void;
}

type stateType = {
    title: string;
    component: {
        props: IListAddressProps | IAddressFormProps;
        Component: any;
    };
}[];

export default function AddressDialog({ open, setOpen, handleSwictToForm, onData }: IAddressDialogProps) {
    const initialState = [
        {
            title: 'MY ADDRESS',
            component: {
                props: {
                    handleAddForm: () => {
                        setListComponent([
                            ...listComponent,
                            {
                                title: 'SHIPPING INFO',
                                component: {
                                    props: {} as IAddressFormProps,
                                    Component: AddressForm,
                                },
                            },
                        ]);
                    },

                    onUpdateData: (data) => {
                        setListComponent([
                            ...listComponent,
                            {
                                title: 'SHIPPING INFO',
                                component: {
                                    props: { initData: { ...data }, updateMode: true } as IAddressFormProps,
                                    Component: AddressForm,
                                },
                            },
                        ]);
                    },
                    onClickData(data) {
                        if (!data || !onData) return;
                        onData(data);
                        handleClose();
                    },
                } as IListAddressProps,
                Component: ListAddress,
            },
        },
    ];

    const handleClose = () => {
        setOpen(false);
        setListComponent([...initialState]);
    };

    const [listComponent, setListComponent] = useState<stateType>(initialState);

    const curComponent = listComponent[listComponent.length - 1];

    const Com = curComponent.component.Component;

    const handleBackForm = () => {
        setListComponent([...listComponent.slice(0, -1)]);
    };

    const handleChangeForm = () => {
        setListComponent([
            ...listComponent,
            {
                title: 'SHIPPING INFO',
                component: {
                    props: {} as IAddressFormProps,
                    Component: AddressForm,
                },
            },
        ]);

        if (!open) {
            setOpen(true);
        }
    };

    useEffect(() => {
        if (!handleSwictToForm) return;
        handleSwictToForm(handleChangeForm);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleSwictToForm]);
    return (
        <AddressDialogContext.Provider value={{ back: handleBackForm }}>
            <WraperDialog
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '14px',
                        overflowX: 'hidden',
                    },
                }}
                maxWidth={'md'}
                open={open}
                setOpen={setOpen}
            >
                <div className="w-full  text-black-main select-none min-h-[600px] py-6 px-10">
                    <div className="flex items-center justify-between  text-[#303B4E] text-xl  border-b border-gray-primary">
                        <div className="flex items-center ">
                            {listComponent.length > 1 && (
                                <WrapperAnimation onClick={handleBackForm} hover={{ x: -2 }} className="flex items-center justify-center pr-3">
                                    <FontAwesomeIcon className="cursor-pointer" icon={faArrowLeft} />
                                </WrapperAnimation>
                            )}
                            <h2 className="font-semibold uppercase">{curComponent.title}</h2>
                        </div>
                        <WrapperAnimation onClick={handleClose} hover={{}} className="flex items-center justify-center p-5 pr-0">
                            <FontAwesomeIcon className="cursor-pointer" icon={faXmark} />
                        </WrapperAnimation>
                    </div>

                    <div className="min-w-full md:min-w-[820px] ">
                        <Com {...curComponent.component.props} />
                    </div>
                </div>
            </WraperDialog>
        </AddressDialogContext.Provider>
    );
}
