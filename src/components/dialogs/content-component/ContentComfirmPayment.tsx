import { IInfoAddress, IOrder } from '@/configs/interface';
import { contants } from '@/utils/contants';
import { addressToString, toCurrency, toGam } from '@/utils/format';
import { constants } from 'buffer';
import * as React from 'react';

export interface IContentCongirmPaymentProps {
    addresses: IInfoAddress | null;
    form: IOrder;
    totalAndWeight: {
        value: number;
        weight: number;
        quantity: number;
    };
}

export default function ContentCongirmPayment({ addresses, totalAndWeight, form }: IContentCongirmPaymentProps) {
    return (
        <div className="flex items-start justify-between gap-6 rounded-xl">
            <ul className="max-w-[50%] flex flex-col gap-3">
                <li className="text-lg font-medium">Infomation</li>
                <li>
                    Fullname: <span className="font-semibold tracking-wide ">{addresses && addresses.name}</span>
                </li>
                <li>
                    Phone: <span className="font-semibold tracking-wide ">{addresses && addresses.phone}</span>
                </li>
                <li>
                    Address: <span className="font-semibold tracking-wide ">{addresses && addressToString(addresses?.address)}</span>
                </li>
                <li>
                    Payment Method: <span className="font-semibold tracking-wide ">{form.methodId === 1 ? 'Cash' : 'Pre-Payment'}</span>
                </li>
                <li>
                    Delivery Method: <span className="font-semibold tracking-wide ">{contants.dataCard[form.deliveryId - 1].title}</span>
                </li>
            </ul>
            <ul className="flex-1 flex flex-col gap-3">
                <li className="text-lg font-medium">Order</li>

                <li>
                    Total weight: <span className="font-semibold tracking-wide ">{toGam(totalAndWeight.weight)}</span>
                </li>
                <li>
                    Total order quantity: <span className="font-semibold tracking-wide ">x{totalAndWeight.quantity}</span>
                </li>
                <li>
                    Subtotal: <span className="font-semibold tracking-wide ">{toCurrency(totalAndWeight.value)}</span>
                </li>
                <li>
                    Ship: <span className="font-semibold tracking-wide ">{toCurrency(form.ship)}</span>
                </li>
                <li>
                    Total: <span className="font-medium tracking-wide ">{toCurrency(form.ship + totalAndWeight.value)}</span>
                </li>
            </ul>
        </div>
    );
}
