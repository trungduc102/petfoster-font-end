import { IProductManageList, IRepository } from '@/configs/interface';
import { toGam } from '@/utils/format';

export const productManageData = {
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
            id: 'PA',
            name: 'Pet accessories',
        },
    ],
    branhs: [
        { id: 'Royal Canin', name: 'Royal Canin' },
        { id: 'Zenith', name: 'Zenith' },
    ],
    sizes: [
        {
            id: '100',
            name: toGam(100),
        },
        {
            id: '200',
            name: toGam(200),
        },
        {
            id: '300',
            name: toGam(300),
        },
        {
            id: '400',
            name: toGam(400),
        },
        {
            id: '1000',
            name: toGam(1000),
        },
    ],
};

export const productManageListData = [
    {
        id: 1,
        image: 'https://bizweb.dktcdn.net/100/229/172/products/125382699-1787018864786630-4599836884327070559-n.jpg?v=1605709115500',
        brand: 'Zenith',
        name: 'Hạt Royal Canin X-Small Adult Cho Chó Trưởng Thành Giống Siêu Nhỏ',
        type: 'Cat Food',
        repo: [
            {
                size: 200,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 300,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 400,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 1000,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
        ],
    },
    {
        id: 2,
        image: 'https://bizweb.dktcdn.net/100/229/172/products/125382699-1787018864786630-4599836884327070559-n.jpg?v=1605709115500',
        brand: 'Zenith',
        name: 'Hạt Royal Canin X-Small Adult Cho Chó Trưởng Thành Giống Siêu Nhỏ',
        type: 'Dog Food',
        repo: [
            {
                size: 200,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 300,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 400,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 1000,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
        ],
    },
    {
        id: 3,
        image: 'https://bizweb.dktcdn.net/100/229/172/products/125382699-1787018864786630-4599836884327070559-n.jpg?v=1605709115500',
        brand: 'Zenith',
        name: 'Hạt Royal Canin X-Small Adult Cho Chó Trưởng Thành Giống Siêu Nhỏ',
        type: 'Cat Food',
        repo: [
            {
                size: 200,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 300,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 400,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 1000,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
        ],
    },
    {
        id: 4,
        image: 'https://bizweb.dktcdn.net/100/229/172/products/125382699-1787018864786630-4599836884327070559-n.jpg?v=1605709115500',
        brand: 'Zenith',
        name: 'Hạt Royal Canin X-Small Adult Cho Chó Trưởng Thành Giống Siêu Nhỏ',
        type: 'Cat Food',
        repo: [
            {
                size: 200,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 300,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 400,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 1000,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
        ],
    },
    {
        id: 5,
        image: 'https://bizweb.dktcdn.net/100/229/172/products/125382699-1787018864786630-4599836884327070559-n.jpg?v=1605709115500',
        brand: 'Zenith',
        name: 'Hạt Royal Canin X-Small Adult Cho Chó Trưởng Thành Giống Siêu Nhỏ',
        type: 'Cat Food',
        repo: [
            {
                size: 200,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 300,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 400,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 1000,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
        ],
    },
    {
        id: 6,
        image: 'https://bizweb.dktcdn.net/100/229/172/products/125382699-1787018864786630-4599836884327070559-n.jpg?v=1605709115500',
        brand: 'Zenith',
        name: 'Hạt Royal Canin X-Small Adult Cho Chó Trưởng Thành Giống Siêu Nhỏ',
        type: 'Cat Food',
        repo: [
            {
                size: 200,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 300,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 400,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 1000,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
        ],
    },
    {
        id: 7,
        image: 'https://bizweb.dktcdn.net/100/229/172/products/125382699-1787018864786630-4599836884327070559-n.jpg?v=1605709115500',
        brand: 'Zenith',
        name: 'Hạt Royal Canin X-Small Adult Cho Chó Trưởng Thành Giống Siêu Nhỏ',
        type: 'Cat Food',
        repo: [
            {
                size: 200,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 300,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 400,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 1000,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
        ],
    },
    {
        id: 8,
        image: 'https://bizweb.dktcdn.net/100/229/172/products/125382699-1787018864786630-4599836884327070559-n.jpg?v=1605709115500',
        brand: 'Zenith',
        name: 'Hạt Royal Canin X-Small Adult Cho Chó Trưởng Thành Giống Siêu Nhỏ',
        type: 'Cat Food',
        repo: [
            {
                size: 200,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 300,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 400,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
            {
                size: 1000,
                quantity: 100,
                inPrice: 200000,
                outPrice: 220000,
            },
        ],
    },
] as IProductManageList[];
