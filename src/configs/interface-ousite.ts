export interface BaseShipping {
    success: boolean;
    message: string;
    fee: Fee;
}

export interface Fee {
    name: string;
    fee: number;
    insurance_fee: number;
    include_vat: number;
    cost_id: number;
    delivery_type: string;
    a: string;
    dt: string;
    extFees: any[];
    ship_fee_only: number;
    promotion_key: string;
    distance: number;
    delivery: boolean;
}

export interface ITransactionResponse {
    error: number;
    message: string;
    data: IDataTransaction;
}

export interface IDataTransaction {
    page: number;
    pageSize: number;
    nextPage: number;
    prevPage: number;
    totalPages: number;
    totalRecords: number;
    records: IRecordTransaction[];
}

export interface IRecordTransaction {
    id: number;
    tid: string;
    description: string;
    amount: number;
    cusumBalance: string;
    when: string;
    bookingDate: string;
    bankSubAccId: string;
    paymentChannel: string;
    virtualAccount: string;
    virtualAccountName: string;
    corresponsiveName: string;
    corresponsiveAccount: string;
    corresponsiveBankId: string;
    corresponsiveBankName: string;
    accountId: number;
    bankCodeName: string;
}
