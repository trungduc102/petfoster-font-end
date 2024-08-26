import { ICart } from '@/configs/interface';

export const dataCart = [
    {
        id: 1,
        brand: 'Royal Canin',
        size: 200,
        image: 'https://bizweb.dktcdn.net/100/362/345/products/xsmalladult-a81506df-ac29-4e87-8bd8-153192be5792.jpg?v=1571057515367',
        name: 'Hạt Royal Canin X-Small Adult Cho Chó Trưởng Thành Giống Siêu Nhỏ',
        price: 27000,
        quantity: 1,
        repo: 10,
        checked: false,
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
        checked: false,
    },
] as ICart[];
