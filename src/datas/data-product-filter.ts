import { IFilter } from '@/configs/interface';

export const dataProductFilter = {
    fillters: {
        prices: [
            {
                id: [0, 100000],
                name: '0 < 100.000',
            },
            {
                id: [100000, 300000],
                name: '100.000 - 300.000',
            },
            {
                id: [500000, 1000000000],
                name: '> 500.000',
            },
        ] as IFilter[],
        stock: [
            {
                id: 'in stock',
                name: 'In stock',
            },
        ] as IFilter[],
        brands: [
            {
                id: 'Natural Core',
                name: 'Natural Core',
            },
            {
                id: 'Nekko',
                name: 'Nekko',
            },
            {
                id: 'Pedigree',
                name: 'Pedigree',
            },
            {
                id: 'Royal Canin',
                name: 'Royal Canin',
            },
            {
                id: 'Snappy Tom',
                name: 'Snappy Tom',
            },
            {
                id: 'The Pet',
                name: 'The Pet',
            },
            {
                id: 'Whiskas',
                name: 'Whiskas',
            },
            {
                id: 'Whiskat',
                name: 'Whiskat',
            },
            {
                id: 'Zenith',
                name: 'Zenith',
            },
        ] as IFilter[],
        types: [
            {
                id: 'BF',
                name: 'Bird food',
            },
            {
                id: 'CF',
                name: 'Cat food',
            },
            {
                id: 'DF',
                name: 'Dog food',
            },
            {
                id: 'MF',
                name: 'Mouse food',
            },
            {
                id: 'RF',
                name: 'Rabbit Food',
            },
        ],
    },
};
