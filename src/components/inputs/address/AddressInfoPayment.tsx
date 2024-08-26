'use client';
import { IInfoAddress } from '@/configs/interface';
import { useGetDefaultAddress } from '@/hooks';
import { addressToString } from '@/utils/format';
import React, { createContext, memo, useEffect, useLayoutEffect, useState } from 'react';
import AddressDialog from './AddressDialog';
import { PaymentItem } from '@/components/pages';

export const AddressInfoPaymentContext = createContext<{ addressActive: IInfoAddress | null; setDefaultValue: (data: IInfoAddress) => void; backToDefaultValue?: () => void }>({
    addressActive: null,
    setDefaultValue: () => {},
});

export interface IAddressInfoPaymentProps {
    onData?: (data: IInfoAddress | null) => void;
}

function AddressInfoPayment({ onData }: IAddressInfoPaymentProps) {
    // cutum hooks
    const { defaultAddress, setId } = useGetDefaultAddress();

    const data = defaultAddress as IInfoAddress | null;

    const [defaultValue, setDefaultValue] = useState(data);

    // hooks
    const [open, setOpen] = useState(false);

    // varibles

    let handleSwictToForm: () => void;

    const backToDefaultValue = () => {
        setDefaultValue(data);
    };

    useLayoutEffect(() => {
        setDefaultValue(data);
    }, [data]);

    useEffect(() => {
        if (!onData) return;
        onData(defaultValue || null);
    }, [defaultValue, onData]);
    return (
        <AddressInfoPaymentContext.Provider
            value={{
                addressActive: defaultValue || null,
                setDefaultValue,
                backToDefaultValue,
            }}
        >
            <PaymentItem
                title="Shipping info"
                action={
                    <>
                        <span onClick={() => setOpen(!open)} className="text-violet-primary font-medium hover:underline cursor-pointer">
                            Change
                        </span>
                    </>
                }
            >
                <>
                    {defaultValue && (
                        <div className="text-black-main">
                            <h2 className="font-bold text-lg">
                                {defaultValue?.name} - {defaultValue?.phone}
                            </h2>
                            <p className="line-clamp-4 text-1xl mt-[6px]">{defaultValue?.address && addressToString(defaultValue?.address)}</p>
                        </div>
                    )}
                    {!defaultValue && (
                        <div className="text-black-main flex items-center justify-center border-2 border-gray-primary rounded-xl py-11">
                            {"You don't have a shipping address yet, "}{' '}
                            <p onClick={() => handleSwictToForm()} className="hover:underline text-violet-primary ml-2 cursor-pointer">
                                create a new one
                            </p>
                        </div>
                    )}

                    <AddressDialog
                        handleSwictToForm={(callback) => {
                            handleSwictToForm = callback;
                        }}
                        open={open}
                        setOpen={setOpen}
                        onData={(data) => {
                            if (!data) return;
                            setDefaultValue({ ...data });
                        }}
                    />
                </>
            </PaymentItem>
        </AddressInfoPaymentContext.Provider>
    );
}

export default memo(AddressInfoPayment);
