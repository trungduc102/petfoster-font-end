import { ICart } from '@/configs/interface';

const keyCart: string = 'cart-user';

export const addCartTolocal = (data: { cart: ICart[]; payment: ICart[] }, username: string) => {
    localStorage.setItem(username, JSON.stringify({ ...data, cart: data.cart }));
};

export const addPaymetnTolocal = (data: { cart: ICart[]; payment: ICart[] }, username: string) => {
    localStorage.setItem(username, JSON.stringify({ ...data, payment: data.payment }));
};

export const getPaymentFromLocal = (username: string) => {
    if (typeof window === 'undefined') {
        return undefined;
    }
    const store = localStorage?.getItem(username);

    if (!store) {
        return undefined;
    }

    return JSON.parse(store);
};

export const getStoreFromLocal = (username: string) => {
    if (typeof window === 'undefined') {
        return undefined;
    }
    const store = localStorage?.getItem(username);

    if (!store) {
        return undefined;
    }

    return JSON.parse(store);
};

export const getCartFromLocal = () => {
    if (typeof window === 'undefined') {
        return [];
    }
    const store = localStorage?.getItem(keyCart);

    if (!store) {
        return [];
    }

    return JSON.parse(store);
};
