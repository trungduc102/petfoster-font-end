import { RolesName } from '@/configs/enum';
import { IAddress, INotification, INotificationKey } from '@/configs/interface';
import { RoleType, StateType, TypeNotification } from '@/configs/types';
import { faBox, faCarSide, faCheckCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import Validate from './validate';

const floor = Math.floor,
    abs = Math.abs,
    log = Math.log,
    round = Math.round,
    min = Math.min;
const abbrev = ['K', 'Mil', 'Bil']; // abbreviations in steps of 1000x; extensible if need to edit

export const toCurrency = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    })
        .format(price)
        .replace('₫', 'VND');
};

export const stringToUrl = (string: string) => {
    if (!string || string.length <= 0) return '';
    return string.toLowerCase().replaceAll(' ', '-');
};

export const toFromNow = (time: string) => {
    return moment(time, 'DDMMYYYY h:mm:ss a').fromNow();
};

export const toFullname = (firstName: string | null, lastName: string | null, email: string) => {
    if (!firstName || !lastName) return email;

    return `${firstName} ${lastName}`;
};

function rnd(n: number, precision: number) {
    const prec = 10 ** precision;
    return round(n * prec) / prec;
}

export function toAbbrevNumber(n: number) {
    let base = floor(log(abs(n)) / log(1000));
    const suffix = abbrev[min(abbrev.length - 1, base - 1)];
    base = abbrev.indexOf(suffix) + 1;
    return suffix ? rnd(n / 1000 ** base, 2) + suffix : '' + n;
}

export function capitalize(value: string) {
    if (value.length < 1) return value;

    return value;

    // const words = value.split(' ');

    // return words
    //     .map((word) => {
    //         return word[0].toUpperCase() + word.substring(1);
    //     })
    //     .join(' ');
}

export const toGam = (value: number) => {
    return value < 1000 ? value + 'g' : (value / 1000).toFixed(1) + 'kg';
};

export const urlToString = (value: string) => {
    return value.replaceAll('-', ' ');
};

export const fileToUrl = (file: File, callback?: (url: string) => void) => {
    const urlObj = URL.createObjectURL(file);
    if (callback) {
        callback(urlObj);
    }
    return urlObj;
};

export const toDataURL = (url: string) =>
    fetch(url)
        .then((response) => response.blob())
        .then(
            (blob) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                }),
        );

export function dataURLtoFile(dataurl: string) {
    let arr = dataurl.split(',');
    let afterMine = arr[0].match(/:(.*?);/);
    if (!afterMine?.length) return;
    let mine: string = afterMine[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], 'avartar.png', { type: mine });
}

export const addressToString = (value: IAddress) => {
    if (Validate.isBlank(value.address)) {
        return `${value.ward}, ${value.district}, ${value.province}`;
    }
    return `${value.address}, ${value.ward}, ${value.district}, ${value.province}`;
};

export const formatIndex = (page: number | null, index: number) => {
    if (!page) return index + 1;

    if (page <= 1) {
        return index + 1;
    }

    return index + 1 + page * 10;
};

export const formatStatus = (status: StateType) => {
    return status.replaceAll('_', ' ');
};

export const toStatus = (value: string) => {
    return value.toLocaleLowerCase().replaceAll(' ', '_') as StateType;
};

export const formatRole = (value: RoleType) => {
    const [prefix, ...role] = value.split('_');

    return role;
};

export const getIconWithStatus = (status: StateType) => {
    switch (status) {
        case 'placed': {
            return {
                color: '#505DE8',
                icon: faBox,
            };
        }
        case 'delivered': {
            return {
                color: '#65A30D',
                icon: faCheckCircle,
            };
        }
        case 'shipping': {
            return {
                color: '#EF4444',
                icon: faCarSide,
            };
        }
        case 'cancelled': {
            return {
                color: '#EF4444',
                icon: faCircleXmark,
            };
        }
        default: {
            return {
                color: '#EF4444',
                icon: faCircleXmark,
            };
        }
    }
};

export const convertFirestoreTimestampToString = (timestamp: Timestamp) => new Date(timestamp?.toDate().getTime());

export const convertRoleToId = (role: RoleType) => {
    switch (role) {
        case 'ROLE_SUPER': {
            return RolesName.ROLE_SUPER;
        }
        case 'ROLE_ADMIN': {
            return RolesName.ROLE_ADMIN;
        }
        case 'ROLE_USER': {
            return RolesName.ROLE_USER;
        }
        default: {
            return RolesName.ROLE_USER;
        }
    }
};

export function wraperTextToLink(content: string) {
    const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|~|%|:)+)/g;

    return content.replace(reg, `<a class="message-link" href="$1$2" target="_blank">$1$2</a>`);
}

export const replaceValidDistrich = (content: string) => {
    const reg = /(Thuỷ)/g;

    return content.replace(reg, `Thủy`);
};

export function convertMsToTime(milliseconds: number) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    // 👇️ If you don't want to roll hours over, e.g. 24 to 00
    // 👇️ comment (or remove) the line below
    // commenting next line gets you `24:00:00` instead of `00:00:00`
    // or `36:15:31` instead of `12:15:31`, etc.
    hours = hours % 24;

    return hours;
}

export function paseDataNotification<T>(noti: INotification, data: T, isAdmin = false) {
    let result = isAdmin ? noti.adminCotent || noti.content : noti.content;
    if (!noti || !noti.meta || !noti.meta.keys) return result;

    noti.meta.keys.forEach((key, index) => {
        if (result.includes(`@${key.name}`)) {
            result = result.replaceAll(`@${key.name}`, `<span style="color: ${key.color};">${data[key.name as keyof T]}</span>`);
        }
    });
    return result;
}

export function paseDataNotificationPreview(value: string, keys: INotificationKey[]) {
    return keys.reduce((curentItem, item) => {
        return curentItem.replaceAll(`@${item.name}`, `<span style="color: ${item.color};">@${item.name}</span>`);
    }, value);
}

export const secondsToMinute = (inp: number) => {
    return moment.utc(inp * 1000).format('mm:ss') + '';
};
