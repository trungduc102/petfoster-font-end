'use client';
import { acceptAdoptionAdmin, cancelAdoptionAdmin, comfirmAdoptionAdmin } from '@/apis/admin/adoption';
import { cancelAdoptionPet } from '@/apis/pets';
import { CustomReasonDialog, DetailUserAdoptionDialog, DialogAceptChooser, MiniLoading, WrapperAnimation } from '@/components';
import WraperDialog from '@/components/dialogs/WraperDialog';
/* eslint-disable @next/next/no-img-element */
import { IAdoption } from '@/configs/interface';
import { LabelAdopt } from '@/configs/types';
import { links } from '@/datas/links';
import { adoptionReasons, adoptionReasonsForUser } from '@/datas/reason';
import firebaseService from '@/services/firebaseService';
import { contants } from '@/utils/contants';
import { faCat, faChevronUp, faEllipsisVertical, faFaceFrown, faHeart, faMars, faMaximize, faVenus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames';
import moment from 'moment';
import { Nunito_Sans } from 'next/font/google';
import Link from 'next/link';
import React, { MouseEvent, MouseEventHandler, useState } from 'react';
import { toast } from 'react-toastify';

const nunito = Nunito_Sans({
    subsets: ['latin'],
    style: ['normal'],
    weight: ['500', '600'],
});

export interface IAdoptionPageItemProps {
    data: IAdoption;
    styles?: {
        image?: string;
    };
    showHeart?: boolean;
    showDetailType?: boolean;
    advanced?: boolean;
    onBeforeCancel?: () => void;
    onBeforeAccept?: () => void;
    onBeforeComfirm?: () => void;
}

const Label = ({ type, showDetailType = false }: { type: LabelAdopt; showDetailType?: boolean }) => {
    const cancelArr = ['cancelled by admin', 'cancelled by customer'];

    return (
        <div
            className={classNames('capitalize py-1 px-3 text-xs md:py-2 md:px-5 rounded-full  md:text-sm text-black-main font-medium', {
                ['bg-adopted']: type.toLocaleLowerCase() === 'adopted',
                ['bg-register']: type.toLocaleLowerCase() === 'waiting',
                ['bg-[#D3D7FF]']: type.toLocaleLowerCase() === 'registered',
                ['bg-cancelled']: cancelArr.includes(type.toLocaleLowerCase()),
            })}
        >
            {!showDetailType && (cancelArr.includes(type.toLocaleLowerCase()) ? 'Cancel' : type)}
            {showDetailType && type}
        </div>
    );
};

export default function AdoptionPageItem({
    data,
    styles,
    showHeart = true,
    showDetailType = false,
    advanced,
    onBeforeCancel,
    onBeforeAccept,
    onBeforeComfirm,
}: IAdoptionPageItemProps) {
    const [loadmore, setLoadmore] = useState(false);
    const [loading, setLoading] = useState(false);

    const [openDetailUser, setOpenDetailUser] = useState(false);

    const [types, setTypes] = useState<LabelAdopt>(data.state.toLowerCase() as LabelAdopt);

    // state when advanced
    const [openAdvanced, setOpenAdvanced] = useState(false);
    const [openReason, setOpenReason] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const handleCancel = async (reason: string) => {
        try {
            setLoading(true);
            const response = await cancelAdoptionPet({ id: String(data.id), reason });

            if (!response || response.errors) {
                return toast.warn(response.message);
            }

            toast.success('Cancellation successful');
            requestIdleCallback(handleClearWhenSuccess);
        } catch (error) {
            return toast.error(contants.messages.errors.server);
        } finally {
            setLoading(false);
            await firebaseService.publistCancelAdoptPetNotification(data, reason);
        }
    };

    const handleClearWhenSuccess = () => {
        if (advanced) {
            setTypes('cancelled by admin');
            return;
        }
        setTypes('cancelled by customer');
    };

    const handleCancelByAdmin = async (reason: string) => {
        try {
            setLoading(true);
            const response = await cancelAdoptionAdmin({ id: String(data.id), reason });

            if (!response) return toast.warn(contants.messages.errors.handle);

            if (response.errors) return toast.warn(response.message);

            toast.success(response.message);
        } catch (error) {
            toast.error(contants.messages.errors.server);
        } finally {
            setLoading(false);
            handleClearWhenSuccess();
            await firebaseService.publistCancelAdoptPetNotification(data, reason, true);
        }
    };

    const handleSubmitCancel = async (reason: string) => {
        if (advanced) {
            await handleCancelByAdmin(reason);
        } else {
            await handleCancel(reason);
        }

        if (!advanced || !onBeforeCancel) return;
        setOpenAdvanced(false);
        onBeforeCancel();
    };

    const handleAcceptOrUpdateAppointment = async (date: string, reason?: string) => {
        try {
            setLoading(true);
            const response = await acceptAdoptionAdmin({ id: String(data.id), data: date });

            if (!response) return toast.warn(contants.messages.errors.handle);

            if (response.errors) return toast.warn(response.message);

            toast.success(response.message);

            if (response.data.length) {
                console.log(response.data);
                response.data.forEach(async (item) => {
                    await firebaseService.publistCancelAdoptPetNotification(
                        item,
                        item.cancelReason || `Thank you for your interest in ${item.pet.name}. We are very sorry that ${item.pet.name} has been adopted by someone else.`,
                        true,
                    );
                });
            }
        } catch (error) {
            toast.error(contants.messages.errors.server);
        } finally {
            setLoading(false);

            setTypes('registered');

            if (!reason) {
                await firebaseService.publistAceptAdoptPetNotification(data, moment(date).format('MMM Do YY'));
            } else {
                await firebaseService.publistAdjustAdoptPetNotification(data, moment(date).format('MMM Do YY'), reason);
            }
        }

        if (!advanced || !onBeforeAccept) return;
        setOpenAdvanced(false);
        onBeforeAccept();
    };

    const handleComfirm = async () => {
        try {
            setLoading(true);
            const response = await comfirmAdoptionAdmin({ id: String(data.id), data: '' });

            if (!response) return toast.warn(contants.messages.errors.handle);

            if (response.errors) return toast.warn(response.message);

            toast.success(response.message);
        } catch (error) {
            toast.error(contants.messages.errors.server);
        } finally {
            setLoading(false);
            await firebaseService.publistComfirmAdoptPetNotification(data);
        }

        setOpenModal(false);

        if (!advanced || !onBeforeComfirm) return;
        setOpenAdvanced(false);
        onBeforeComfirm();
    };

    const handleOpenDetailUser: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
        setOpenDetailUser(true);
    };

    return (
        <div
            onDoubleClick={handleOpenDetailUser}
            className="relative overflow-hidden rounded-lg p-4 select-none shadow-primary flex gap-7 min-h-[100px] border border-gray-primary transition-all ease-linear w-full items-center"
        >
            <div
                className={classNames('h-full aspect-square rounded-xl overflow-hidden hidden md:block hover:shadow-primary transition-all ease-linear ', {
                    ['w-1/3']: !styles?.image,
                    [styles?.image || '']: styles?.image,
                })}
            >
                <img className="w-full h-full object-cover hover:scale-110 transition-all ease-linear" src={data.pet.image} alt={data.pet.image} />
            </div>
            <div className=" flex-1 flex flex-col justify-between py-4 w-full h-full gap-3 relative select-none">
                {advanced && !(['cancelled by customer', 'cancelled by admin', 'adopted'] as LabelAdopt[]).includes(types) && (
                    <Tippy
                        onClickOutside={() => setOpenAdvanced(false)}
                        interactive
                        visible={openAdvanced}
                        placement="left"
                        render={(attr) => {
                            return (
                                <div className="bg-white shadow-primary rounded-md border py-1 border-gray-primary flex flex-col gap-1" tabIndex={-1} {...attr}>
                                    {types === 'waiting' && (
                                        <DialogAceptChooser
                                            onDatas={handleAcceptOrUpdateAppointment}
                                            title="Select appointment date"
                                            className="px-5 cursor-pointer hover:bg-gray-300 py-1 transition-all ease-linear"
                                            label={'Accept'}
                                        />
                                    )}
                                    {types === 'registered' && (
                                        <span onClick={() => setOpenModal(true)} className="px-5 cursor-pointer hover:bg-gray-300 py-1 transition-all ease-linear">
                                            Confirm
                                        </span>
                                    )}
                                    {types === 'registered' && (
                                        <DialogAceptChooser
                                            isShowreason={true}
                                            iniData={moment(data.pickUpDate).format('yyyy-MM-DD')}
                                            onDatas={handleAcceptOrUpdateAppointment}
                                            title="Change appointment date"
                                            className="px-5 cursor-pointer hover:bg-gray-300 py-1 transition-all ease-linear"
                                            label={'Adjust'}
                                        />
                                    )}
                                    <span onClick={() => setOpenReason(true)} className="px-5 cursor-pointer hover:bg-gray-300 py-1 transition-all ease-linear">
                                        Cancel
                                    </span>
                                </div>
                            );
                        }}
                    >
                        <div
                            onClick={() => setOpenAdvanced((prev) => !prev)}
                            className="absolute cursor-pointer top-0 right-0 p-3 rounded-full hover:bg-slate-300 text-black-main w-10 h-10 flex items-center justify-center transition-all ease-linear"
                        >
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </div>
                    </Tippy>
                )}
                <div className="flex items-center justify-between">
                    <h4
                        className={classNames('text-lg font-bold capitalize', {
                            [nunito.className]: true,
                        })}
                    >
                        {data.pet.name}
                    </h4>

                    {!(['adopted', 'cancelled', 'cancelled by admin', 'cancelled by customer'] as LabelAdopt[]).includes(types) && !advanced && (
                        <span onClick={() => setOpenReason(true)} className="w-1/4 text-center text-[15px] text-[#505DE8] hover:underline cursor-pointer">
                            Cancel
                        </span>
                    )}
                </div>
                <ul className="flex items-center gap-7 text-black-main">
                    <li className="flex items-center gap-1 text-[#727272]">
                        <span className="flex items-center justify-center ">
                            <FontAwesomeIcon className="" icon={faCat} />
                        </span>
                        <span className="hidden md:inline-block capitalize">{data.pet.type}</span>
                    </li>
                    <li className="flex items-center gap-1 text-[#727272]">
                        <span className="flex items-center justify-center ">
                            <FontAwesomeIcon className="" icon={data.pet.sex === 'male' ? faMars : faVenus} />
                        </span>
                        <span className="hidden md:inline-block capitalize">{data.pet.sex}</span>
                    </li>
                    <li className="flex items-center gap-1 text-[#727272]">
                        <span className="flex items-center justify-center ">
                            <FontAwesomeIcon className="" icon={faMaximize} />
                        </span>
                        <span className="hidden md:inline-block capitalize">{data.pet.size}</span>
                    </li>
                </ul>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Label showDetailType={showDetailType} type={types} />
                        {!['adopted', 'registered'].includes(types) && <span className="text-sm text-[#727272]">{moment(data.registerAt).format('MMM Do YY')}</span>}
                        {types === 'registered' && (
                            <span className="text-sm text-[#727272]">
                                {moment(data.pickUpDate).format('MMM Do YY')} <small className="text-xs italic mr-1">Please arrive during this time to pick up</small>
                            </span>
                        )}
                        {types === 'adopted' && <span className="text-sm text-[#727272]">{moment(data.adoptAt).format('MMM Do YY')}</span>}
                    </div>
                    {showHeart && (
                        <div className="w-1/4 flex items-center justify-center">
                            <FontAwesomeIcon
                                className={classNames('', {
                                    ['text-fill-heart']: data.pet.like,
                                    ['text-inherit']: !data.pet.like,
                                })}
                                icon={faHeart}
                            />
                        </div>
                    )}
                </div>
                <div className="text-sm text-black-main flex items-start gap-5">
                    <div className="flex flex-col gap-1">
                        {advanced && (
                            <span>
                                Fullname:{' '}
                                <Link className="hover:text-blue-primary hover:underline" href={links.adminFuntionsLink.users.detail + data.user.id}>
                                    {data.user.fullname}
                                </Link>
                            </span>
                        )}
                        {types === 'adopted' && (
                            <>
                                <span>Adopted: {moment(data.adoptAt).format('DD/MM/yyyy')}</span>
                                <span>Pickup: {moment(data.pickUpDate).format('DD/MM/yyyy')}</span>
                                <span>Registered: {moment(data.registerAt).format('DD/MM/yyyy')}</span>
                            </>
                        )}
                        <span>Phone: {data.phone}</span>
                        <span>Address: {data.address}</span>
                    </div>
                </div>
                {data.cancelReason && (
                    <div className="flex items-center gap-2 text-[#4C6B99] ">
                        <FontAwesomeIcon icon={faFaceFrown} />
                        {(() => {
                            const limit = 100;
                            const condition = data.cancelReason.length >= limit;
                            return (
                                <>
                                    <span className="text-sm">
                                        {condition ? (!loadmore ? data.cancelReason.slice(0, limit) : data.cancelReason) : data.cancelReason}
                                        {condition && !loadmore && (
                                            <span className="hover:underline text-blue-primary cursor-pointer ml-1" onClick={() => setLoadmore(true)}>
                                                load more
                                            </span>
                                        )}
                                    </span>
                                </>
                            );
                        })()}
                    </div>
                )}

                {loadmore && (
                    <div className=" hover:text-blue-primary cursor-pointer text-center absolute -bottom-[8%] right-[50%]" onClick={() => setLoadmore(false)}>
                        <FontAwesomeIcon className="p-2" icon={faChevronUp} />
                    </div>
                )}
            </div>

            {openReason && (
                <CustomReasonDialog handleAfterClickSend={handleSubmitCancel} onClose={() => setOpenReason(false)} reasons={advanced ? adoptionReasons : adoptionReasonsForUser} />
            )}

            {advanced && openAdvanced && <DialogAceptChooser />}

            {advanced && openDetailUser && <DetailUserAdoptionDialog data={data} open={openDetailUser} setOpen={setOpenDetailUser} />}

            <WraperDialog open={openModal} setOpen={setOpenModal}>
                <div className="p-6 flex flex-col gap-4 items-center text-black-main">
                    Confirmed <b className="capitalize">{data.user.fullname}</b> has received <b className="capitalize">{data.pet.name}</b>
                    <div className="flex items-center justify-between text-sm">
                        <WrapperAnimation
                            onClick={() => setOpenModal(false)}
                            hover={{}}
                            className="py-2 px-6 rounded-full hover:bg-[rgba(0,0,0,.2)] transition-all ease-linear cursor-pointer hover:text-white"
                        >
                            Cancel
                        </WrapperAnimation>
                        <WrapperAnimation
                            onClick={handleComfirm}
                            hover={{}}
                            className="py-2 px-6 rounded-full hover:bg-[rgba(0,0,0,.2)] transition-all ease-linear cursor-pointer hover:text-white text-red-primary"
                        >
                            Comfirm
                        </WrapperAnimation>
                    </div>
                </div>
            </WraperDialog>

            {loading && (
                <div className="absolute inset-0 bg-black-040 flex items-center justify-center">
                    <MiniLoading />
                </div>
            )}
        </div>
    );
}
