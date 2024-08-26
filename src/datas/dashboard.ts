import { IDashboard } from '@/configs/interface';

export const dataDashboard = {
    reports: {
        dailyOrders: {
            value: 300000,
            percentYesterday: 10,
        },
        dailyRevenue: {
            value: 500000,
            percentYesterday: 20,
        },
        users: {
            value: 200000,
        },
    },
    salesOverview: {
        revenue: {
            categories: ['Mon', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Sep', 'Sep', 'Sep'],
            data: [
                {
                    name: 'Thang 1', // name od chart
                    data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 150, 160, 180],
                },
            ],
            total: 2423423,
        },
        productRevenueByType: {
            categories: ['dog', 'cat', 'bird'],
            data: [
                {
                    name: 'type of product', // name od chart
                    data: [10, 41, 35],
                },
            ],
            total: 2423423,
        },
    },
    productRevenueByDate: {
        data: [
            {
                id: '123',
                name: 'Hạt Royal Canin X-Small Adult Cho Chó Trưởng Thành Giống Siêu Nhỏ',
                brand: 'Zenith',
                quantity: 1000,
                size: 1000,
                revenue: 2000034,
            },
            {
                id: '122',
                name: 'Hạt Royal Canin X-Small Adult Cho Chó Trưởng Thành Giống Siêu Nhỏ',
                brand: 'Zenith',
                quantity: 1000,
                size: 1000,
                revenue: 2000034,
            },
            {
                id: '124',
                name: 'Hạt Royal Canin X-Small Adult Cho Chó Trưởng Thành Giống Siêu Nhỏ',
                brand: 'Zenith',
                quantity: 1000,
                size: 1000,
                revenue: 2000034,
            },
            {
                id: '125',
                name: 'Hạt Royal Canin X-Small Adult Cho Chó Trưởng Thành Giống Siêu Nhỏ',
                brand: 'Zenith',
                quantity: 1000,
                size: 1000,
                revenue: 2000034,
            },
        ],
        total: 2342342,
    },
} as IDashboard;
