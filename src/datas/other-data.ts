import { IDetailOrder, IInfoAddress, IOtherHistories, IOtherHistory } from '@/configs/interface';

export const dataOrtherHistory = {
    data: [
        {
            id: 1235,
            datePlace: new Date().toDateString(), // string dang Sun Oct 15 2023 or '12/2/2023'
            state: 'buy',
            stateMessage: 'Delivery on October 2, 2023',
            total: 100000,
            products: [
                {
                    id: 1,
                    brand: 'Royal Canin',
                    size: 200,
                    image: 'https://bizweb.dktcdn.net/100/362/345/products/xsmalladult-a81506df-ac29-4e87-8bd8-153192be5792.jpg?v=1571057515367',
                    name: 'Hạt Royal Canin X-Small Adult Cho Chó Trưởng Thành Giống Siêu Nhỏ',
                    price: 27000,
                    quantity: 1,
                    repo: 10,
                },
                {
                    id: 2,
                    brand: 'Zenith',
                    size: 200,
                    image: 'https://bizweb.dktcdn.net/100/438/021/products/56f71624-5d8b-4bcb-87ad-c23832bd1c46.jpg?v=1640251015190',
                    name: 'Hạt Mềm Cho Chó Trưởng Thành Zenith Adult',
                    price: 27000,
                    quantity: 1,
                    repo: 10,
                },
            ],
        },
        {
            id: 1236,
            datePlace: new Date().toDateString(),
            stateMessage: 'Delivery on October 2, 2023 ',
            state: 'cancel',
            total: 100000,
            products: [
                {
                    id: 2,
                    brand: 'Zenith',
                    size: 200,
                    image: 'https://bizweb.dktcdn.net/100/438/021/products/56f71624-5d8b-4bcb-87ad-c23832bd1c46.jpg?v=1640251015190',
                    name: 'Hạt Mềm Cho Chó Trưởng Thành Zenith Adult',
                    price: 27000,
                    quantity: 1,
                    repo: 10,
                },
            ],
        },
    ],
    pages: 10,
} as IOtherHistories;

export const orderDetail: IDetailOrder = {
    id: 123,
    address: '132 3/2 Street, Hung Loi Ward, Ninh Kieu District, Can Tho City',
    placedDate: new Date().toDateString(),
    deliveryMethod: 'Express in 4 hours',
    name: 'Ha Lam',
    paymentMethod: 'Credit Card',
    phone: '0964 909 321',
    expectedTime: null,
    products: [
        {
            id: 1,
            brand: 'Royal Canin',
            size: 200,
            image: 'https://bizweb.dktcdn.net/100/362/345/products/xsmalladult-a81506df-ac29-4e87-8bd8-153192be5792.jpg?v=1571057515367',
            name: 'Hạt Royal Canin X-Small Adult Cho Chó Trưởng Thành Giống Siêu Nhỏ',
            price: 27000,
            quantity: 1,
            isRate: true,
            repo: 10,
        },
        {
            id: 2,
            brand: 'Zenith',
            size: 200,
            image: 'https://bizweb.dktcdn.net/100/438/021/products/56f71624-5d8b-4bcb-87ad-c23832bd1c46.jpg?v=1640251015190',
            name: 'Hạt Mềm Cho Chó Trưởng Thành Zenith Adult',
            price: 27000,
            quantity: 1,
            isRate: false,
            repo: 10,
        },
    ],
    description: '',
    shippingFee: 20000,
    subTotal: 59000,
    total: 79000,
    state: 'Delivered',
};

interface IOrderItem {
    id: string;
    size: number;
    quantity: number;
}

interface IOrder {
    address: number; // id address
    delivery: number; // id phuong thuc van chuyen
    method: number; // id phuong thuc thanh toan
    ship: number; // phí ship
    data: IOrderItem[];
}

export const orders: IOrder = {
    address: 20,
    delivery: 2,
    method: 2,
    ship: 40000,
    data: [
        {
            id: 'SP001',
            size: 200,
            quantity: 10,
        },
        {
            id: 'SP002',
            size: 400,
            quantity: 10,
        },
        {
            id: 'SP003',
            size: 500,
            quantity: 10,
        },
    ],
};

interface IPayment {
    orderId: number;
    amount: number; //2000000
    isPaid: boolean;
    payAt: string; // 20231115224608 <=> yyyyMMddHHmmss,
    transactionNumber: number; // 14182407
    paymentMethod: {
        id: number; // 1 là cash 2 là banking tương ứng trong bảng [payment_method],
        cardType: string; // ATM cách thức chuyển khoản
    };
}

// const payment: IPayment = {
//     orderId: 10,
//     amount: 100000,
//     isPaid: true,
//     payAt: '20231115224608',
//     transactionNumber: 14182407,
//     paymentMethod: {
//         id: 2,
//         cardType: 'ATM',
//     },
// };
