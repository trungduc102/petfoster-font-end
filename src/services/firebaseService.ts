import { uploadImagesMessage } from '@/apis/admin/images';
import { db } from '@/configs/firebase';
import {
    IAdoptPetNotification,
    IAdoption,
    IDetailOrder,
    IImageDefaultNotification,
    IMessage,
    INotification,
    IPet,
    IPost,
    IPostDetail,
    IProductDetailOrders,
    IProfile,
    IPublistNotification,
} from '@/configs/interface';
import { ImageType, TypeNotification } from '@/configs/types';
import { links } from '@/datas/links';
import { contants } from '@/utils/contants';
import { generateKeywords } from '@/utils/firebaseUltils';
import { paseDataNotification, stringToUrl } from '@/utils/format';
import Validate from '@/utils/validate';
import {
    addDoc,
    doc,
    serverTimestamp,
    setDoc,
    collection,
    query,
    where,
    orderBy,
    and,
    or,
    OrderByDirection,
    limit,
    QueryFilterConstraint,
    getDoc,
    collectionGroup,
    QueryCompositeFilterConstraint,
    QueryConstraint,
    QueryDocumentSnapshot,
    DocumentData,
    QueryNonFilterConstraint,
    startAfter,
} from 'firebase/firestore';

const setUserInBd = async (user: IProfile) => {
    try {
        await setDoc(
            doc(db, 'users', user.username),
            {
                username: user.username,
                lassSeen: serverTimestamp(),
                avartar: user.avatar || contants.avartarDefault,
                online: true,
                keywords: generateKeywords(user.username),
                displayname: user.displayName || user.username,
            },
            { merge: true }, // just update what is change
        );
    } catch (error) {
        console.log(error);
        console.log('LOGIN: Error setting user info in DB');
    }
};

const setLastseen = async (user: IProfile) => {
    try {
        await setDoc(
            doc(db, 'users', user.username),
            {
                lassSeen: serverTimestamp(),
                online: false,
            },
            { merge: true }, // just update what is change
        );
    } catch (error) {
        console.log('setLastseen: Error setting setLastseen info in DB');
    }
};

const setRead = async (notificationid: string, readArr: string[], newRead: string) => {
    try {
        await setDoc(
            doc(db, 'notifications', notificationid),
            {
                read: [...readArr, newRead],
            },
            { merge: true }, // just update what is change
        );
    } catch (error) {
        console.log('setRead: Error setting setRead info in DB');
    }
};

const setActionGimConversation = async (conversationId: string, gim = true) => {
    try {
        await setDoc(
            doc(db, 'conversations', conversationId),
            {
                gim,
            },
            { merge: true }, // just update what is change
        );
    } catch (error) {
        console.log('setActionGimConversation: Error setting setActionGimConversation info in DB');
    }
};

const setImageDefaultNotification = async (data: IImageDefaultNotification) => {
    try {
        await setDoc(
            doc(db, 'config-image-notification', data.id),
            {
                updatedAt: serverTimestamp(),
                photourl: data.photourl,
            },
            { merge: true }, // just update what is change
        );
    } catch (error) {
        console.log('setActionGimConversation: Error setting setActionGimConversation info in DB');
    }
};

const getNotification = async (notificationId: string) => {
    try {
        const notificationRef = doc(db, 'notifications', notificationId);
        const notificationRefShapshot = await getDoc(notificationRef);

        return notificationRefShapshot;
    } catch (error) {
        console.log('getNotification: Error setting getNotification info in DB');
    }
};

const getConstantNotification = async (notificationId: string) => {
    try {
        const notificationRef = doc(db, 'config-constant-notifications', notificationId);
        const notificationRefShapshot = await getDoc(notificationRef);

        return notificationRefShapshot;
    } catch (error) {
        console.log('getNotification: Error setting getNotification info in DB');
    }
};

const addConversation = async (usernameUser: string) => {
    const response = await addDoc(collection(db, 'conversations'), {
        users: [contants.usernameAdmin, usernameUser],
        newMessage: null,
        sendAt: null,
        gim: false,
        seenMessage: false,
    });

    try {
        await setDoc(
            doc(db, 'users', usernameUser),
            {
                conversationId: response.id,
            },
            { merge: true }, // just update what is change
        );
    } catch (error) {
        console.log('LOGIN: Error setting user info in DB');
    }

    return response;
};

const addNotification = async (data: INotification) => {
    const options = (() => {
        if (!data.options || !data.options.end || !data.options.start) {
            return {
                start: 0,
                end: 0,
            };
        }

        return data.options;
    })();

    try {
        //await addDoc(collection(db, 'notifications')
        await addDoc(collection(db, 'notifications'), {
            content: data.content,
            createdAt: serverTimestamp(),
            deleted: false,
            link: Validate.isBlank(data.link as string) ? null : data.link,
            photourl: data.photourl,
            read: [],
            target: data.target.length <= 0 ? ['all'] : data.target,
            title: data.title,
            type: data.type,
            options: options,
            public: true,
            // public: false,
            // meta: {
            //     keys: [
            //         { name: 'username', color: '#cccccc' },
            //         { name: 'displayName', color: '#cccccc' },
            //     ],
            // },
        });
    } catch (error) {
        console.log(error);
        console.log('AddNotification: Error setting addNotification info in DB');
    }
};

const addSuccessfulPurchaseNotification = async ({
    orderId,
    photourl,
    username,
    displayName,
}: {
    orderId?: number | string;
    photourl: string;
    username: string;
    displayName: string;
}) => {
    try {
        const notificationRef = doc(db, 'config-constant-notifications', 'RPk9O04QQMTdMExcHUnK');
        const notificationRefShapshot = await getDoc(notificationRef);

        const constNotification = {
            id: notificationRefShapshot.id,
            ...notificationRefShapshot.data(),
        } as INotification;

        return await addDoc(collection(db, 'notifications'), {
            content: paseDataNotification<{ username: string; orderId?: number | string; displayName: string }>(constNotification, { username, orderId, displayName }),
            createdAt: serverTimestamp(),
            deleted: false,
            link: orderId ? links.history.orderHistory + `/${orderId}` : links.history.orderHistory,
            linkAdmin: links.adminFuntionsLink.orders.index + `?orderId=${orderId}`,
            photourl: photourl,
            read: [],
            target: [username],
            title: constNotification.title,
            type: constNotification.type,
            options: constNotification.options,
            public: false,
            adminCotent: paseDataNotification<{ username: string; orderId?: number | string; displayName: string }>(constNotification, { username, orderId, displayName }, true),
        });
    } catch (error) {
        console.log('addSuccessfulPurchaseNotification: Error setting addSuccessfulPurchaseNotification info in DB');
    }
};

const publistFavoriteNotification = async (pet: IPet, user: IProfile) => {
    try {
        const notificationRef = doc(db, 'config-constant-notifications', 'NwgpAJynez1II8sylmKF');
        const notificationRefShapshot = await getDoc(notificationRef);

        const constNotification = {
            id: notificationRefShapshot.id,
            ...notificationRefShapshot.data(),
        } as INotification;

        return await addDoc(collection(db, 'notifications'), {
            content: paseDataNotification<IPublistNotification<IPet & { displayName: string }>>(
                constNotification,
                { ...pet, username: user.username, displayName: user.displayName },
                false,
            ),
            createdAt: serverTimestamp(),
            deleted: false,
            link: links.pet + `${pet.id}/${stringToUrl(pet.name)}`,
            linkAdmin: links.adminFuntionsLink.pets.index + `/${pet.id}`,
            photourl: pet.image,
            read: [],
            target: [user.username],
            title: constNotification.title,
            type: constNotification.type,
            options: constNotification.options,
            public: false,
            adminCotent: paseDataNotification<IPublistNotification<IPet>>(constNotification, { ...pet, username: user.username, displayName: user.displayName }, true),
        });
    } catch (error) {
        console.log('addSuccessfulPurchaseNotification: Error setting addSuccessfulPurchaseNotification info in DB');
    }
};

const publistAdoptPetNotification = async (pet: IPet, username: string, phone: string, displayName: string) => {
    try {
        const notificationRefShapshot = await getConstantNotification('eZl5uAq6XalWL317fB6k');

        if (!notificationRefShapshot) return null;

        const constNotification = {
            id: notificationRefShapshot.id,
            ...notificationRefShapshot.data(),
        } as INotification;

        return await addDoc(collection(db, 'notifications'), {
            // content: constNotification.content.replaceAll('&&', pet.name),
            content: paseDataNotification<IAdoptPetNotification>(constNotification, { ...pet, phone, username, displayName }, false),
            createdAt: serverTimestamp(),
            deleted: false,
            link: links.users.profiles.adoption,
            linkAdmin: links.adminFuntionsLink.adoption.index + `?q=${stringToUrl(pet.name)}`,
            photourl: pet.image,
            read: [],
            target: [username],
            title: constNotification.title,
            type: constNotification.type,
            options: constNotification.options,
            public: false,
            adminCotent: paseDataNotification<IAdoptPetNotification>(constNotification, { ...pet, phone, username, displayName }, true),
        });
    } catch (error) {
        console.log('publistAdoptPetNotification: Error setting publistAdoptPetNotification info in DB');
    }
};

const publistPostsNotification = async (posts: IPostDetail, user: IProfile, currentUser: IProfile, type: 'comment' | 'like' | 'like-comment') => {
    let id = null;

    switch (type) {
        case 'like': {
            id = 'wX6NXRPWiC3zn19IvqsM';
            break;
        }
        case 'comment': {
            id = '7RO8xNmitb95RpiE7KmP';
            break;
        }
        case 'like-comment': {
            id = 'gKiQcsah5oZJ9xPWGGxq';
            break;
        }
        default:
            id = null;
    }

    if (!id) return;

    try {
        const notificationRefShapshot = await getConstantNotification(id);

        if (!notificationRefShapshot) return null;

        const constNotification = {
            id: notificationRefShapshot.id,
            ...notificationRefShapshot.data(),
        } as INotification;

        return await addDoc(collection(db, 'notifications'), {
            content: paseDataNotification<IPostDetail & { displayName: string }>(constNotification, { ...posts, user, displayName: currentUser.displayName }, false),
            createdAt: serverTimestamp(),
            deleted: false,
            link: links.adorables.index + `?uuid=${posts.id}&open=auto`,
            linkAdmin: links.adorables.index + `?uuid=${posts.id}&open=auto`,
            photourl: posts.user.avatar,
            read: [],
            target: [user.username],
            title: constNotification.title,
            type: constNotification.type,
            options: constNotification.options,
            public: false,
            adminCotent: paseDataNotification<IPostDetail & { displayName: string }>(constNotification, { ...posts, user, displayName: currentUser.displayName }, true),
        });
    } catch (error) {
        console.log('publistAdoptPetNotification: Error setting publistAdoptPetNotification info in DB');
    }
};

const publistDeleteOrReportPostsNotification = async (posts: IPostDetail, user: IProfile, reason: string, type: 'delete' | 'report') => {
    let id = null;

    switch (type) {
        case 'delete': {
            id = 'wKPlLGxmnHi9d3bOfkBn';
            break;
        }
        case 'report': {
            id = '3hrP2FamEAmDDHjwFaWC';
            break;
        }

        default:
            id = null;
    }

    if (!id) return;

    try {
        const notificationRefShapshot = await getConstantNotification(id);

        if (!notificationRefShapshot) return null;

        const constNotification = {
            id: notificationRefShapshot.id,
            ...notificationRefShapshot.data(),
        } as INotification;

        return await addDoc(collection(db, 'notifications'), {
            content: paseDataNotification<IPostDetail & { reason: string; displayName: string }>(
                constNotification,
                { ...posts, user, displayName: user.displayName, reason },
                false,
            ),
            createdAt: serverTimestamp(),
            deleted: false,
            link: type === 'report' ? links.adorables.index + `?uuid=${posts.id}&open=auto` : null,
            linkAdmin: type === 'report' ? links.adorables.index + `?uuid=${posts.id}&open=auto` : null,
            photourl: constNotification.photourl,
            read: [],
            target: [user.username],
            title: constNotification.title,
            type: constNotification.type,
            options: constNotification.options,
            public: false,
            adminCotent: paseDataNotification<IPostDetail & { reason: string; displayName: string }>(
                constNotification,
                { ...posts, user, displayName: user.displayName, reason },
                true,
            ),
        });
    } catch (error) {
        console.log('publistDeleteOrReportPostsNotification: Error setting publistDeleteOrReportPostsNotification info in DB');
    }
};

const publistAceptAdoptPetNotification = async (adoption: IAdoption, appointmentDate: string) => {
    try {
        const notificationRefShapshot = await getConstantNotification('3ggKv18Cq1BK26mh0G5a');

        if (!notificationRefShapshot) return null;

        const constNotification = {
            id: notificationRefShapshot.id,
            ...notificationRefShapshot.data(),
        } as INotification;

        return await addDoc(collection(db, 'notifications'), {
            // content: constNotification.content.replaceAll('&&', pet.name),
            content: paseDataNotification<IPublistNotification<IAdoption> & { shopAddress: string; name: string; appointmentDate: string }>(
                constNotification,
                {
                    ...adoption,
                    shopAddress: process.env.NEXT_PUBLIC_DETAIL_ADDRESS || '',
                    username: adoption.user.username,
                    displayName: adoption.user.displayName,
                    name: adoption.pet.name,
                    appointmentDate,
                },
                false,
            ),
            createdAt: serverTimestamp(),
            deleted: false,
            link: links.users.profiles.adoption,
            linkAdmin: links.adminFuntionsLink.adoption.index + `?q=${stringToUrl(adoption.pet.name)}`,
            photourl: adoption.pet.image,
            read: [],
            target: [adoption.user.username],
            title: constNotification.title,
            type: constNotification.type,
            options: constNotification.options,
            public: false,
            adminCotent: paseDataNotification<IPublistNotification<IAdoption> & { shopAddress: string; name: string; appointmentDate: string }>(
                constNotification,
                {
                    ...adoption,
                    shopAddress: process.env.NEXT_PUBLIC_DETAIL_ADDRESS || '',
                    username: adoption.user.username,
                    displayName: adoption.user.displayName,
                    name: adoption.pet.name,
                    appointmentDate,
                },
                true,
            ),
        });
    } catch (error) {
        console.log('publistAdoptPetNotification: Error setting publistAdoptPetNotification info in DB');
    }
};

const publistCancelAdoptPetNotification = async (adoption: IAdoption, reason: string, isAdmin = false) => {
    const id = isAdmin ? '0KIFLeKQr3D86qRLRyBF' : 'K4t9RIWpl6b3xKdbjKYI';
    try {
        const notificationRefShapshot = await getConstantNotification(id);

        if (!notificationRefShapshot) return null;

        const constNotification = {
            id: notificationRefShapshot.id,
            ...notificationRefShapshot.data(),
        } as INotification;

        return await addDoc(collection(db, 'notifications'), {
            // content: constNotification.content.replaceAll('&&', pet.name),
            content: paseDataNotification<IPublistNotification<IAdoption> & { shopAddress: string; name: string; reason: string }>(
                constNotification,
                {
                    ...adoption,
                    shopAddress: process.env.NEXT_PUBLIC_DETAIL_ADDRESS || '',
                    username: adoption.user.username,
                    displayName: adoption.user.displayName,
                    name: adoption.pet.name,
                    reason,
                },
                false,
            ),
            createdAt: serverTimestamp(),
            deleted: false,
            link: links.users.profiles.adoption,
            linkAdmin: links.adminFuntionsLink.adoption.index + `?q=${stringToUrl(adoption.pet.name)}`,
            photourl: adoption.pet.image,
            read: [],
            target: [adoption.user.username],
            title: constNotification.title,
            type: constNotification.type,
            options: constNotification.options,
            public: false,
            adminCotent: paseDataNotification<IPublistNotification<IAdoption> & { shopAddress: string; name: string; reason: string }>(
                constNotification,
                {
                    ...adoption,
                    shopAddress: process.env.NEXT_PUBLIC_DETAIL_ADDRESS || '',
                    username: adoption.user.username,
                    displayName: adoption.user.displayName,
                    name: adoption.pet.name,
                    reason,
                },
                true,
            ),
        });
    } catch (error) {
        console.log('publistAdoptPetNotification: Error setting publistAdoptPetNotification info in DB');
    }
};

const publistComfirmAdoptPetNotification = async (adoption: IAdoption) => {
    try {
        const notificationRefShapshot = await getConstantNotification('SI6YMnlbbQNfJ3OTmUIz');

        if (!notificationRefShapshot) return null;

        const constNotification = {
            id: notificationRefShapshot.id,
            ...notificationRefShapshot.data(),
        } as INotification;

        return await addDoc(collection(db, 'notifications'), {
            // content: constNotification.content.replaceAll('&&', pet.name),
            content: paseDataNotification<IPublistNotification<IAdoption> & { shopAddress: string; name: string }>(
                constNotification,
                {
                    ...adoption,
                    shopAddress: process.env.NEXT_PUBLIC_DETAIL_ADDRESS || '',
                    username: adoption.user.username,
                    displayName: adoption.user.displayName,
                    name: adoption.pet.name,
                },
                false,
            ),
            createdAt: serverTimestamp(),
            deleted: false,
            link: links.users.profiles.adoption,
            linkAdmin: links.adminFuntionsLink.adoption.index + `?q=${stringToUrl(adoption.pet.name)}`,
            photourl: adoption.pet.image,
            read: [],
            target: [adoption.user.username],
            title: constNotification.title,
            type: constNotification.type,
            options: constNotification.options,
            public: false,
            adminCotent: paseDataNotification<IPublistNotification<IAdoption> & { shopAddress: string; name: string }>(
                constNotification,
                {
                    ...adoption,
                    shopAddress: process.env.NEXT_PUBLIC_DETAIL_ADDRESS || '',
                    username: adoption.user.username,
                    displayName: adoption.user.displayName,
                    name: adoption.pet.name,
                },
                true,
            ),
        });
    } catch (error) {
        console.log('publistAdoptPetNotification: Error setting publistAdoptPetNotification info in DB');
    }
};

const publistAdjustAdoptPetNotification = async (adoption: IAdoption, appointmentDate: string, reason: string) => {
    try {
        const notificationRefShapshot = await getConstantNotification('NRRK2lUaVAhYfjYwws3w');

        if (!notificationRefShapshot) return null;

        const constNotification = {
            id: notificationRefShapshot.id,
            ...notificationRefShapshot.data(),
        } as INotification;

        return await addDoc(collection(db, 'notifications'), {
            // content: constNotification.content.replaceAll('&&', pet.name),
            content: paseDataNotification<IPublistNotification<IAdoption> & { shopAddress: string; name: string; appointmentDate: string; reason: string }>(
                constNotification,
                {
                    ...adoption,
                    shopAddress: process.env.NEXT_PUBLIC_DETAIL_ADDRESS || '',
                    username: adoption.user.username,
                    displayName: adoption.user.displayName,
                    name: adoption.pet.name,
                    appointmentDate,
                    reason,
                },
                false,
            ),
            createdAt: serverTimestamp(),
            deleted: false,
            link: links.users.profiles.adoption,
            linkAdmin: links.adminFuntionsLink.adoption.index + `?q=${stringToUrl(adoption.pet.name)}`,
            photourl: adoption.pet.image,
            read: [],
            target: [adoption.user.username],
            title: constNotification.title,
            type: constNotification.type,
            options: constNotification.options,
            public: false,
            adminCotent: paseDataNotification<IPublistNotification<IAdoption> & { shopAddress: string; name: string; appointmentDate: string; reason: string }>(
                constNotification,
                {
                    ...adoption,
                    shopAddress: process.env.NEXT_PUBLIC_DETAIL_ADDRESS || '',
                    username: adoption.user.username,
                    displayName: adoption.user.displayName,
                    name: adoption.pet.name,
                    appointmentDate,
                    reason,
                },
                true,
            ),
        });
    } catch (error) {
        console.log('publistAdoptPetNotification: Error setting publistAdoptPetNotification info in DB');
    }
};

const publistStateShippingOrderNotification = async (order: IDetailOrder & { orderId: string }) => {
    try {
        const notificationRef = doc(db, 'config-constant-notifications', 'RMGNinRXXoE4UdbYLH8C');
        const notificationRefShapshot = await getDoc(notificationRef);

        const constNotification = {
            id: notificationRefShapshot.id,
            ...notificationRefShapshot.data(),
        } as INotification;

        return await addDoc(collection(db, 'notifications'), {
            // content: constNotification.content.replaceAll('&&', pet.name),
            content: paseDataNotification<IDetailOrder>(constNotification, { ...order }, false),
            createdAt: serverTimestamp(),
            deleted: false,
            link: links.history.orderHistory + `/${order.id}`,
            linkAdmin: links.adminFuntionsLink.orders.index + `?orderId=${order.id}`,
            photourl: order.products[0].image,
            read: [],
            target: [order.username],
            title: constNotification.title,
            type: constNotification.type,
            options: constNotification.options,
            public: false,
            adminCotent: paseDataNotification<IDetailOrder>(constNotification, { ...order }, true),
        });
    } catch (error) {
        console.log('publistStateOrder: Error setting publistStateOrder info in DB');
    }
};

const publistStateDeleveredOrderNotification = async (order: IDetailOrder & { orderId: string }) => {
    try {
        const notificationRef = doc(db, 'config-constant-notifications', 'FXIc1iVyBEIK9YTDEG5Y');
        const notificationRefShapshot = await getDoc(notificationRef);

        const constNotification = {
            id: notificationRefShapshot.id,
            ...notificationRefShapshot.data(),
        } as INotification;

        return await addDoc(collection(db, 'notifications'), {
            // content: constNotification.content.replaceAll('&&', pet.name),
            content: paseDataNotification<IDetailOrder>(constNotification, { ...order }, false),
            createdAt: serverTimestamp(),
            deleted: false,
            link: links.history.orderHistory + `/${order.id}`,
            linkAdmin: links.adminFuntionsLink.orders.index + `?orderId=${order.id}`,
            photourl: order.products[0].image,
            read: [],
            target: [order.username],
            title: constNotification.title,
            type: constNotification.type,
            options: constNotification.options,
            public: false,
            adminCotent: paseDataNotification<IDetailOrder>(constNotification, { ...order }, true),
        });
    } catch (error) {
        console.log('publistStateOrder: Error setting publistStateOrder info in DB');
    }
};

const publistStateCancelByAdminOrderNotification = async (order: IDetailOrder & { orderId: string; reason: string }) => {
    try {
        const notificationRef = doc(db, 'config-constant-notifications', 'Fcwg09ypnEFYLN0iAJRU');
        const notificationRefShapshot = await getDoc(notificationRef);

        const constNotification = {
            id: notificationRefShapshot.id,
            ...notificationRefShapshot.data(),
        } as INotification;

        return await addDoc(collection(db, 'notifications'), {
            // content: constNotification.content.replaceAll('&&', pet.name),
            content: paseDataNotification<IDetailOrder & { orderId: string; reason: string }>(constNotification, { ...order }, false),
            createdAt: serverTimestamp(),
            deleted: false,
            link: links.history.orderHistory + `/${order.id}`,
            linkAdmin: links.adminFuntionsLink.orders.index + `?orderId=${order.id}`, // http://localhost:3000/admin/dashboard/orders?orderId=186
            photourl: order.products[0].image,
            read: [],
            target: [order.username],
            title: constNotification.title,
            type: constNotification.type,
            options: constNotification.options,
            public: false,
            adminCotent: paseDataNotification<IDetailOrder & { orderId: string; reason: string }>(constNotification, { ...order }, true),
        });
    } catch (error) {
        console.log('publistStateOrder: Error setting publistStateOrder info in DB');
    }
};

const publistStateCancelByCustomerOrderNotification = async (order: IDetailOrder & { orderId: string; reason: string }) => {
    try {
        const notificationRef = doc(db, 'config-constant-notifications', 'zqDeVsqeZMHNmkOK1j7B');
        const notificationRefShapshot = await getDoc(notificationRef);

        const constNotification = {
            id: notificationRefShapshot.id,
            ...notificationRefShapshot.data(),
        } as INotification;

        return await addDoc(collection(db, 'notifications'), {
            // content: constNotification.content.replaceAll('&&', pet.name),
            content: paseDataNotification<IDetailOrder & { orderId: string; reason: string }>(constNotification, { ...order }, false),
            createdAt: serverTimestamp(),
            deleted: false,
            link: links.history.orderHistory + `/${order.id}`,
            linkAdmin: links.adminFuntionsLink.orders.index + `?orderId=${order.id}`, // http://localhost:3000/admin/dashboard/orders?orderId=186
            photourl: order.products[0].image,
            read: [],
            target: [order.username],
            title: constNotification.title,
            type: constNotification.type,
            options: constNotification.options,
            public: false,
            adminCotent: paseDataNotification<IDetailOrder & { orderId: string; reason: string }>(constNotification, { ...order }, true),
        });
    } catch (error) {
        console.log('publistStateOrder: Error setting publistStateOrder info in DB');
    }
};

const publistRatingProductNotification = async (product: IProductDetailOrders, username: string) => {
    try {
        const notificationRef = doc(db, 'config-constant-notifications', 'tdGI6jAiqD4wtASFLjkW');
        const notificationRefShapshot = await getDoc(notificationRef);

        const constNotification = {
            id: notificationRefShapshot.id,
            ...notificationRefShapshot.data(),
        } as INotification;

        return await addDoc(collection(db, 'notifications'), {
            // content: constNotification.content.replaceAll('&&', pet.name),
            content: paseDataNotification<IProductDetailOrders & { username: string }>(constNotification, { ...product, username }, false),
            createdAt: serverTimestamp(),
            deleted: false,
            link: links.produt + `/${product.id}/${stringToUrl(product.name)}`,
            linkAdmin: links.adminFuntionsLink.reviews.index + `/${product.id}`,
            photourl: product.image,
            read: [],
            target: [username],
            title: constNotification.title,
            type: constNotification.type,
            options: constNotification.options,
            public: false,
            adminCotent: paseDataNotification<IProductDetailOrders & { username: string }>(constNotification, { ...product, username }, true),
        });
    } catch (error) {
        console.log('publistStateOrder: Error setting publistStateOrder info in DB');
    }
};

const setNotification = async (data: INotification, collectionName?: string) => {
    const collection = collectionName || 'notifications';

    const meta: INotification['meta'] = {};

    if (data.meta) {
        if (data.meta.keys) {
            meta.keys = data.meta.keys;
        }
    }

    try {
        await setDoc(
            doc(db, collection, data.id),
            {
                content: data.content,
                link: Validate.isBlank(data.link as string) ? null : data.link,
                photourl: data.photourl,
                target: data.target.length <= 0 || data.target[0] === 'all' ? ['all'] : data.target,
                title: data.title,
                type: data.type,
                options: data.options,
                meta: {
                    ...meta,
                },
                adminCotent: data.adminCotent ? data.adminCotent : data.content,
            },
            {
                merge: true,
            },
        );
    } catch (error) {
        console.log(error);
        console.log('AddNotification: Error setting addNotification info in DB');
    }
};
const deleteNotification = async (id: string) => {
    try {
        await setDoc(
            doc(db, 'notifications', id),
            {
                deleted: true,
            },
            {
                merge: true,
            },
        );
    } catch (error) {
        console.log('AddNotification: Error setting addNotification info in DB');
    }
};

const setNewMessageConversation = async (conversationId: string, newMessageId: string) => {
    try {
        await setDoc(
            doc(db, 'conversations', conversationId),
            {
                newMessage: newMessageId,
                sendAt: serverTimestamp(),
                seenMessage: false,
            },
            { merge: true }, // just update what is change
        );
    } catch (error) {
        console.log('setNewMessageConversation: Error setting user info in DB');
    }
};

const setRecallMessage = async (id: string) => {
    try {
        await setDoc(
            doc(db, 'messages', id),
            {
                recall: true,
            },
            { merge: true }, // just update what is change
        );
    } catch (error) {
        console.log('setNewMessageConversation: Error setting user info in DB');
    }
};

const setSeenMessage = async (id: string) => {
    try {
        await setDoc(
            doc(db, 'messages', id),
            {
                seen: true,
            },
            { merge: true }, // just update what is change
        );
    } catch (error) {
        console.log(error);
        console.log('setSeenMessage: Error setting setSeenMessage info in DB');
    }
};

const queryGetConversationForCurrentUser = (usernameUser: string | undefined) => {
    return query(collection(db, 'conversations'), where('users', 'array-contains', usernameUser));
};

const generateQueryGetMessages = (conversationId: string) => {
    return query(collection(db, 'messages'), where('conversationId', '==', conversationId), orderBy('sendAt', 'asc'));
};

// just get conversations have message
const getConversations = (typeSort: OrderByDirection = 'desc') => {
    return query(collection(db, 'conversations'), where('sendAt', '!=', 'null'), orderBy('sendAt', typeSort));
};

const getNotifications = (
    user: IProfile | null,
    options: { limit: number; start?: QueryDocumentSnapshot<DocumentData, DocumentData> } = { limit: Number(process.env.NEXT_PUBLIC_LIMIT_NOTIFI) },
) => {
    if (!user) return null;

    const constraintsAdmin: any = [
        and(
            where('deleted', '==', false),
            or(
                where('target', 'array-contains', 'all'),
                where('target', 'array-contains', user.username),
                where('target', 'array-contains', contants.usernameAdmin),
                where('public', '==', false),
            ),
        ),
        orderBy('createdAt', 'desc'),
        limit(options.limit),
    ];

    const constraintsUser: any = [
        and(where('deleted', '==', false), or(where('target', 'array-contains', 'all'), where('target', 'array-contains', user.username))),
        orderBy('createdAt', 'desc'),
        limit(options.limit),
    ];

    if (options.start) {
        if (contants.roles.manageRoles.includes(user.role)) {
            constraintsAdmin.push(startAfter(options.start));
        } else {
            constraintsUser.push(startAfter(options.start));
        }
    }

    if (contants.roles.manageRoles.includes(user.role)) {
        return query(collection(db, 'notifications'), ...(constraintsAdmin as QueryNonFilterConstraint[]));
    } else {
        return query(collection(db, 'notifications'), ...(constraintsUser as QueryNonFilterConstraint[]));
    }
};

const getAllNotification = (search?: string, type?: TypeNotification) => {
    const condition: QueryFilterConstraint[] = [];

    if (search && !Validate.isBlank(search)) {
        condition.push(where('title', '==', search));
    }

    if (type) {
        condition.push(where('type', '==', type));
    }

    return query(collection(db, 'notifications'), and(where('deleted', '==', false), where('public', '==', true), or(...condition)));
};

// just get conversations have message and gim

const getUserByUsername = (username: string | null) => {
    if (!username) return;
    return query(collection(db, 'users'), where('username', '==', username));
};

const getUsersByKeywords = (keyword: string) => {
    if (Validate.isBlank(keyword)) return;
    return query(collection(db, 'users'), where('keywords', 'array-contains', keyword), limit(4));
};

const getUsersToAddRecidient = (keyword: string) => {
    if (Validate.isBlank(keyword)) return query(collection(db, 'users'), limit(8));
    return query(collection(db, 'users'), where('keywords', 'array-contains', keyword), limit(4));
};

const getImageDefaultNotification = () => {
    return query(collection(db, 'config-image-notification'));
};

const getAllConstantNotification = () => {
    return query(collection(db, 'config-constant-notifications'));
};

const getMessageWithId = (id: string) => {
    if (!id) return;
    return query(collection(db, `messages`));
};

const handleSendMessage = async (value: string, conversationId: string, username: string, differentData?: { images?: ImageType[] }, type = 'message') => {
    let images: string[] | null = null;

    if (differentData && differentData.images) {
        images = await handleImages(differentData);
    }

    const newMessage = await addDoc(collection(db, 'messages'), {
        conversationId: conversationId,
        currentUser: username,
        message: value,
        sendAt: serverTimestamp(),
        username: contants.usernameAdmin,
        recall: false,
        seen: true,
        images: images,
        type,
    });

    const idNewMessage = newMessage.id;

    await firebaseService.setNewMessageConversation(conversationId, idNewMessage);
};

const handleSendMessageToUser = async (value: string, conversationId: string, username: string, differentData?: { images?: ImageType[]; orderId?: string }, type = 'message') => {
    let images: string[] | null = null;

    if (differentData && differentData.images) {
        images = await handleImages(differentData);
    }

    return await addDoc(collection(db, 'messages'), {
        conversationId: conversationId,
        currentUser: username,
        message: value,
        sendAt: serverTimestamp(),
        username: username,
        recall: false,
        seen: false,
        images: images,
        type: type,
    });
};

const handleSendOrder = async (conversationId: string, username: string, differentData?: { images?: ImageType[]; orderId?: string }, type = 'order') => {
    let images: string[] | null = null;

    if (differentData && differentData.images) {
        images = await handleImages(differentData);
    }

    return await addDoc(collection(db, 'messages'), {
        conversationId: conversationId,
        currentUser: username,
        message: null,
        sendAt: serverTimestamp(),
        username: username,
        recall: false,
        seen: false,
        images: images,
        orderId: differentData?.orderId,
        type: type,
    });
};

const handleSendMap = async (conversationId: string, username: string, data: { address: IMessage['address']; location: IMessage['location'] }, isAdmin = false) => {
    const newMessage = await addDoc(collection(db, 'messages'), {
        conversationId: conversationId,
        currentUser: username,
        message: null,
        sendAt: serverTimestamp(),
        username: isAdmin ? contants.usernameAdmin : username,
        recall: false,
        seen: false,
        images: null,
        orderId: null,
        type: 'map',
        ...data,
    });

    const idNewMessage = newMessage.id;

    await firebaseService.setNewMessageConversation(conversationId, idNewMessage);

    return newMessage;
};

const handleMarkAllAsRead = async (dataNotifications: INotification[], user: IProfile | null) => {
    if (!user) return;

    dataNotifications.forEach(async (item) => {
        if (!item.read.includes(user.username)) {
            await firebaseService.setRead(item.id, item.read, user.username);
        }
    });
};

const handleImages = async (differentData: { images?: ImageType[] }) => {
    let images: string[] | null = null;
    let linksResponse: string[] = [];

    if (differentData?.images && differentData.images.length > 0) {
        const imagesRaw = differentData.images.filter((item) => {
            return item.data;
        });

        if (imagesRaw.length > 0) {
            // call api here

            try {
                const response = await uploadImagesMessage(imagesRaw);

                if (!response.errors && response.data.length > 0) {
                    linksResponse = [...response.data];
                }
            } catch (error) {
                console.log('error in handleImages file firebase service: ', error);
            }
        }

        const imagesLink = differentData.images.filter((item) => {
            return !item.data;
        });

        if (linksResponse.length > 0) {
            images = [...linksResponse];
        }

        const imageLinkAfterMap = imagesLink.map((item) => {
            return item.link;
        });

        if (!images) {
            images = [...imageLinkAfterMap];
        } else {
            images = [...images, ...imageLinkAfterMap];
        }
    }

    return images;
};

const firebaseService = {
    setRead,
    setLastseen,
    setUserInBd,
    handleSendMap,
    setSeenMessage,
    handleSendOrder,
    addNotification,
    addConversation,
    setNotification,
    setRecallMessage,
    handleSendMessage,
    deleteNotification,
    handleMarkAllAsRead,
    handleSendMessageToUser,
    publistPostsNotification,
    setActionGimConversation,
    setNewMessageConversation,
    publistAdoptPetNotification,
    publistFavoriteNotification,
    setImageDefaultNotification,
    publistAceptAdoptPetNotification,
    publistRatingProductNotification,
    publistAdjustAdoptPetNotification,
    publistCancelAdoptPetNotification,
    addSuccessfulPurchaseNotification,
    publistComfirmAdoptPetNotification,
    publistStateShippingOrderNotification,
    publistDeleteOrReportPostsNotification,
    publistStateDeleveredOrderNotification,
    publistStateCancelByAdminOrderNotification,
    publistStateCancelByCustomerOrderNotification,
    querys: {
        getNotification,
        getNotifications,
        getConversations,
        getMessageWithId,
        getUserByUsername,
        getUsersByKeywords,
        getAllNotification,
        getUsersToAddRecidient,
        getConstantNotification,
        generateQueryGetMessages,
        getAllConstantNotification,
        getImageDefaultNotification,
        queryGetConversationForCurrentUser,
    },
};

export default firebaseService;
