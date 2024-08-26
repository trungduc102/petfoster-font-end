import { HeadTabType, MenuHeaderType } from '@/configs/types';
import {
    faBox,
    faBoxesStacked,
    faCarSide,
    faCat,
    faCircleCheck,
    faCircleXmark,
    faDog,
    faFaceDizzy,
    faHeart,
    faHourglassStart,
    faNotesMedical,
    faPaw,
    faRightFromBracket,
    faShield,
    faShieldCat,
    faShieldDog,
    faShoppingCart,
    faStar,
    faUser,
    faUserTie,
    faVirus,
} from '@fortawesome/free-solid-svg-icons';
import { links } from './links';
import { dataTakeAction } from './adopt';

export const navbar = [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Take Action', href: '/take-action' },
    { title: 'Adopt', href: '/adopt' },
    { title: 'ADORABLE SNAPSHOTS', href: '/adorable-snapshots' },
    { title: 'Donation', href: '/donation', style: { border: true } },
];

export const navarMobileNonLogin = [
    { title: 'Login', href: links.auth.login },
    { title: 'Register', href: links.auth.register },
];

export const listProfile = [
    {
        title: 'Profile',
        href: '/profile',
        icon: faUser,
    },
    // {
    //     title: 'Cart',
    //     href: '/cart',
    //     style: { badge: true },
    //     icon: faShoppingCart,
    // },
    {
        title: 'Favorite',
        href: '/favorite',
        icon: faHeart,
    },
    {
        title: 'Log out',
        href: '/log-out',
        icon: faRightFromBracket,
    },
] as MenuHeaderType[];

export const dataHeadHistory = [
    {
        title: 'All order',
        icon: faBoxesStacked,
    },
    {
        title: 'Placed',
        icon: faBox,
    },
    {
        title: 'Shipping',
        icon: faCarSide,
    },
    {
        title: 'Delivered',
        icon: faCircleCheck,
    },
    {
        title: 'Cancelled',
        icon: faCircleXmark,
    },
] as HeadTabType[];

export const dataHeadPet = [
    {
        title: 'All',
        icon: faPaw,
    },
    {
        title: dataTakeAction.fillters.status[0].name,
        icon: faNotesMedical,
    },
    {
        title: dataTakeAction.fillters.status[1].name,
        icon: faVirus,
    },
    {
        title: dataTakeAction.fillters.status[2].name,
        icon: faFaceDizzy,
    },
] as HeadTabType[];

export const dataHeadReviews = [
    {
        title: 'All',
        icon: faBoxesStacked,
    },
    {
        title: '5',
        icon: faStar,
        styles: {
            iconPosition: 'end',
        },
    },
    {
        title: '4',
        icon: faStar,
        styles: {
            iconPosition: 'end',
        },
    },
    {
        title: '3',
        icon: faStar,
        styles: {
            iconPosition: 'end',
        },
    },
    {
        title: '2',
        icon: faStar,
        styles: {
            iconPosition: 'end',
        },
    },
    {
        title: '1',
        icon: faStar,
        styles: {
            iconPosition: 'end',
        },
    },
] as HeadTabType[];

export const dataHeadAdoption = [
    {
        title: 'All',
        icon: faCat,
    },
    {
        title: 'Adopted',
        icon: faShieldDog,
    },

    {
        title: 'Waiting',
        icon: faHourglassStart,
    },
    {
        title: 'Registered',
        icon: faShieldCat,
    },
    {
        title: 'Cancelled By Admin',
        icon: faUserTie,
    },
    {
        title: 'Cancelled By Customer',
        icon: faUser,
    },
] as HeadTabType[];

export const dataHeadNotification = [
    {
        title: 'Website',
        icon: faCat,
    },
    {
        title: 'System',
        icon: faDog,
    },
] as HeadTabType[];

export const dataHeadListUser = [
    {
        title: 'User',
        icon: faUser,
    },
    {
        title: 'Admin',
        icon: faUserTie,
    },
];

export const listTabsPostProfile = [
    {
        title: 'Posts',
    },
    {
        title: 'Likes',
    },
];
