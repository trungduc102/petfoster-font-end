import { StateType } from '@/configs/types';

const baseApiProvince = 'https://provinces.open-api.vn/api/';
const baseApiGHTK = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/';

const TOKEN_GHN = '461c907b-8f99-11ee-a6e6-e60958111f48';
const CLIENT_ID = '190422';

const TOKEN_GHN_PRINT = '539096b5-8f95-11ee-a6e6-e60958111f48';
const CLIENT_ID_PRINT = '190419';

export const contants = {
    shopName: 'Pet Foster',
    avartarDefault: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    avartarAdminDefault: '/icons/icon-chat-now.svg',
    usernameAdmin: 'management-admin',
    askConditions: [
        'Are you working or still in school?',
        'Have you received consent from your family/host/roommate to adopt your baby?',
        'When you go on a long trip, will you take your baby with you / will you send someone to take care of it?',
        'Are you raising any pet? Pets often like to roam free, so is your home area safe for pet?',
        'If you get a pet, do you intend to keep it on a leash or let it roam around?',
        'Adopting a pet from us requires a commitment to CARE - STERILIZATION - VACCINE. If you violate our commitment, we will unfortunately come and take the baby back & publicize your case on the page.',
    ],

    messages: {
        errors: {
            server: 'Something went wrong !',
            handle: 'There was an error during processing, please try again or contact customer service. Thanks',
            notFound: "Can't found this page.",
            exceedTheLimit: 'Your order exceeds 30kg. Please contact us for support',
            loginWithFacebook: 'Sonething went wrong when connect to facebook. Try agin !',
            loginWithGoogle: 'Sonething went wrong when connect to google. Try agin !',
        },
        success: {
            payment: 'You have placed your order successfully. Thank you for your trust ❤️❤️❤️',
            review: 'Thank you for rating ❤️❤️❤️',
        },
        review: {
            whenEmpty: 'Let us know your satisfaction with the product',
            whenEmptyReason: 'Please let us know the reason for better service.',
        },
        product: {
            repIsEmpty: 'The product is currently out of stock',
        },
        cart: {
            empty: 'Make a purchase to fill your cart ❤️',
        },
    },
    roles: {
        superRole: 'ROLE_SUPER',
        manageRoles: ['ROLE_SUPER', 'ROLE_ADMIN'],
        userRoles: ['ROLE_STAFF', 'ROLE_USER'],
    },
    apis: {
        provinces: baseApiProvince + 'p/',
        provincesSearch: baseApiProvince + 'p/search/',
        districts: (province: number | string) => {
            return baseApiProvince + `p/${province}?depth=2`;
        },
        districtsSearch: baseApiProvince + 'd/search/',

        wards: (district: number | string) => {
            return baseApiProvince + `d/${district}?depth=2`;
        },
        wardsSearch: baseApiProvince + 'w/search/',
        ghn: {
            token: TOKEN_GHN,
            clientId: CLIENT_ID,
            tokenPrint: TOKEN_GHN_PRINT,
            clientIdPrint: CLIENT_ID_PRINT,
            base: baseApiGHTK,
            shippingFee: baseApiGHTK + 'shipping-order/fee',
            printMethod: {
                a5: 'https://dev-online-gateway.ghn.vn/a5/public-api/printA5',
                '8080': 'https://dev-online-gateway.ghn.vn/a5/public-api/print80x80',
                '5072': 'https://dev-online-gateway.ghn.vn/a5/public-api/print52x70',
            },
        },
    },

    animations: {
        addressForm: {
            custom: 1,

            initial: {
                x: 100,
                opacity: 0,
            },
            animate: {
                x: 0,
                opacity: 1,
            },
            exit: {
                x: -100,
                opacity: 0,
            },
        },
    },

    notify: {
        nonLogin: 'Please login to use !',
    },
    dataCard: [
        { id: 1, title: 'Express (in Can Tho)', business: '4 hours', price: 20000 },
        { id: 2, title: 'GHN', business: '2 - 6 business days', price: 45000 },
    ],
    stateCancel: ['cancelled', 'cancelled_by_admin', 'cancelled_by_customer'] as StateType[],
    styleMessageManagePage: {
        height: 'calc(100vh - 100px)',
    },
    instantProvince: ['Cần Thơ', 'TP.Cần Thơ', 'TP. Cần Thơ', 'TP Cần Thơ', 'Thành phố Cần Thơ', 'cantho'],

    statusAdtoption: ['adopted', 'waiting', 'cancelled by admin', 'cancelled by customer'],
    acceptAnimals: ['dog', 'cat'],
};
