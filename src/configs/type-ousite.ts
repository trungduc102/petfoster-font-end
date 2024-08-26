import { IInfoAddress } from './interface';
import { BaseShipping } from './interface-ousite';

export type DataFormShippingFee = { info: IInfoAddress; weight: number; value: number };

export type ApiGetShippingFee = (data: DataFormShippingFee) => Promise<BaseShipping>;
