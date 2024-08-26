'use client';
import { IconDefinition, faEllipsisVertical, faFlag, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react/headless';
import React, { ReactNode, useState } from 'react';
import { CustomReasonDialog, WrapperAnimation } from '..';
import classNames from 'classnames';
import WraperDialog from '../dialogs/WraperDialog';
import { reportReason } from '@/datas/reason';

export interface IOptionButtonProps {
    handleReport?: (reason?: string) => void;
    handleDelete?: (reason?: string) => void;
    handleEdit?: () => void;
    icon?: IconDefinition;
    children?: ReactNode;
    className?: string;
    showDelete?: boolean;
    options?: {
        border?: boolean;
        hover?: boolean;
        showReport?: boolean;
        showEdit?: boolean;
        size?: 'small' | 'medium';
        typeComfirm?: 'reason' | 'comfirm';
        reason?: string[];
    };
}

export default function OptionButton({
    handleDelete,
    handleReport,
    handleEdit,
    showDelete = true,
    options = { border: false, hover: true, showReport: false, size: 'medium', typeComfirm: 'comfirm', reason: reportReason },
    icon = faEllipsisVertical,
    children,
    className,
}: IOptionButtonProps) {
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openReason, setOpenReason] = useState(false);
    const [openReasonReport, setOpenReasonReport] = useState(false);

    const handleClickDelete = () => {
        if (options.typeComfirm === 'comfirm') {
            return setOpenModal(true);
        }

        if (options.typeComfirm === 'reason') {
            console.log(12124);
            return setOpenReason(true);
        }
    };

    const handleClickReport = () => {
        setOpenReasonReport(true);
    };

    return (
        <>
            <Tippy
                interactive
                placement="left-start"
                visible={open}
                onClickOutside={() => setOpen(false)}
                render={(attr) => {
                    return (
                        <ul
                            tabIndex={-1}
                            {...attr}
                            className={classNames('bg-white text-black-main rounded-lg py-2 text-1xl shadow-primary', {
                                ['border border-gray-primary']: options.border,
                                ['text-sm']: options.size === 'small',
                            })}
                        >
                            {options.showEdit && (
                                <li onClick={handleEdit} className="hover:bg-[#f2f2f2] transition-all cursor-pointer ease-linear px-6 py-2 flex items-center gap-3">
                                    <FontAwesomeIcon icon={faPen} />
                                    <span>Edit</span>
                                </li>
                            )}
                            {options.showReport && (
                                <li onClick={handleClickReport} className="hover:bg-[#f2f2f2] transition-all cursor-pointer ease-linear px-6 py-2 flex items-center gap-3">
                                    <FontAwesomeIcon icon={faFlag} />
                                    <span>Report</span>
                                </li>
                            )}
                            {showDelete && (
                                <li onClick={handleClickDelete} className="hover:bg-[#f2f2f2] cursor-pointer transition-all ease-linear px-6 py-2 flex items-center gap-3">
                                    <FontAwesomeIcon icon={faTrash} />
                                    <span>Delete</span>
                                </li>
                            )}
                        </ul>
                    );
                }}
            >
                <div>
                    {!children && (
                        <WrapperAnimation
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(true);
                            }}
                            hover={{}}
                            className={classNames(' p-3 pt-0 rounded-full transition-all ease-linear flex items-center justify-center cursor-pointer', {
                                ['hover:bg-gray-200']: options.hover,
                            })}
                        >
                            <FontAwesomeIcon icon={icon} />
                        </WrapperAnimation>
                    )}

                    {children && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(true);
                            }}
                            className={className}
                        >
                            {children}
                        </div>
                    )}
                </div>
            </Tippy>

            {openModal && options.typeComfirm === 'comfirm' && (
                <WraperDialog open={openModal} setOpen={setOpenModal}>
                    <div className="p-6 flex flex-col gap-4 items-center text-black-main">
                        <b>Are you sure about this action?</b>
                        <div className="flex items-center justify-between text-sm">
                            <WrapperAnimation
                                onClick={() => setOpenModal(false)}
                                hover={{}}
                                className="py-2 px-6 rounded-full hover:bg-[rgba(0,0,0,.2)] transition-all ease-linear cursor-pointer hover:text-white"
                            >
                                Cancel
                            </WrapperAnimation>
                            <WrapperAnimation
                                onClick={handleDelete ? () => handleDelete() : undefined}
                                hover={{}}
                                className="py-2 px-6 rounded-full hover:bg-[rgba(0,0,0,.2)] transition-all ease-linear cursor-pointer hover:text-white text-red-primary"
                            >
                                Ok
                            </WrapperAnimation>
                        </div>
                    </div>
                </WraperDialog>
            )}

            {openReason && options.typeComfirm === 'reason' && (
                <CustomReasonDialog handleAfterClickSend={handleDelete} onClose={() => setOpenReason(false)} reasons={options.reason || []} />
            )}
            {openReasonReport && handleReport && <CustomReasonDialog handleAfterClickSend={handleReport} onClose={() => setOpenReasonReport(false)} reasons={reportReason} />}
        </>
    );
}
