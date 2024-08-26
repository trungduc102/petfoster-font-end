import { dataHeadNotification } from './header';

const commonAdmin = '/admin/dashboard';
const commonPet = '/pet/';

export const links = {
    home: '/',
    pet: commonPet,
    produt: '/product/',
    products: '/take-action/',
    admin: commonAdmin + '/',
    adminMidleware: commonAdmin,
    adminFuntionsLink: {
        product: {
            create: commonAdmin + '/product/create',
            index: commonAdmin + '/product',
        },
        users: {
            detail: commonAdmin + '/users/',
            create: commonAdmin + '/users/create',
        },
        pets: {
            create: commonAdmin + '/pet/create',
            detail: commonAdmin + '/pet/',
            index: commonAdmin + '/pet',
        },
        orders: {
            index: commonAdmin + '/orders',
        },
        feedbacks: {
            index: commonAdmin + '/feedbacks',
        },
        adoption: {
            index: commonAdmin + '/adoption',
        },
        reviews: {
            index: commonAdmin + '/reviews',
        },
        notifycation: {
            index: commonAdmin + '/notification',
            website: commonAdmin + '/notification?layout=website',
            system: commonAdmin + '/notification?layout=system',
        },
        donation: {
            index: commonAdmin + '/donation',
        },
    },
    auth: {
        login: '/login',
        register: '/register',
        resetPassword: '/reset-password',
    },
    users: {
        payment: '/payment',
        cart: '/cart',
        profile: '/profile',
        profiles: {
            address: '/profile/addresses',
            noti: '/profile/notification',
            adoption: '/profile/adoption',
            personalpage: '/adorable-snapshots/profile/',
        },
    },
    history: {
        orderHistory: '/other-history',
    },
    reviews: {
        management: commonAdmin + '/reviews',
    },
    message: commonAdmin + '/message',
    profile: {
        notification: '/profile/notification',
    },
    pets: {
        adopt: commonPet + 'adopt',
        adoptPage: '/adopt',
        ask: '/ask-condition',
    },
    donation: '/donation',
    adorables: {
        index: '/adorable-snapshots',
        search: '/adorable-snapshots/search',
    },
};
