import { IChart } from '@/configs/interface';

export const dataChart = {
    revenue: {
        title: ['16/08', '17/08', '18/08', '19/08', '20/08', '21/08', '22/08', '23/08'], // mảng các tháng
        data: {
            name: 'Eanings this month', // tên mảng dữ liệu
            data: [355, 390, 300, 350, 390, 180, 355, 390, 400], // mảng dữ liệu
        },
    } as IChart,
    product: {
        title: ['16/08', '17/08', '18/08', '19/08', '20/08', '21/08', '22/08', '23/08'], // mảng các tháng
        data: {
            name: 'Eanings this month', // tên mảng dữ liệu
            data: [355, 390, 300, 350, 390, 180, 355, 390, 400], // mảng dữ liệu
        },
    } as IChart,
    impactOfYear: [
        {
            title: 'total pets fostered',
            data: 20000,
        },
        {
            title: 'in products & donations',
            data: 20000,
        },
        {
            title: 'total pets fostered',
            data: 20000,
        },
    ],
};
