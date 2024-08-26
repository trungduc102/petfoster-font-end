import { WraperTippy, WrapperAnimation } from '@/components';
import { HeadTabType } from '@/configs/types';
import { listPopupNavChatItem } from '@/datas/popupData';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MouseEvent, useMemo, useState } from 'react';
import style from './styles.module.css';
import classNames from 'classnames';
import Tippy from '@tippyjs/react/headless';

export interface IPopupNavChatItemProps {
    customs?: HeadTabType[];
    handleClickItem?: (data: HeadTabType) => void;
}

export default function PopupNavChatItem({ customs, handleClickItem }: IPopupNavChatItemProps) {
    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleClose = () => {};

    const dataMemo = useMemo(() => {
        if (!customs) return listPopupNavChatItem;

        return customs;
    }, [customs]);

    return (
        <Tippy
            onClickOutside={handleClose}
            interactive
            render={(attr) => {
                return (
                    <ul
                        {...attr}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                        className="bg-white shadow-primary py-2 rounded-lg w-fit text-sm text-black-main min-w-[100px]"
                    >
                        {dataMemo.map((item) => {
                            return (
                                <li
                                    onClick={handleClickItem ? () => handleClickItem(item) : undefined}
                                    key={item.title}
                                    className="text-sm px-3 py-1 hover:bg-[#f2f2f2] transition-all ease-linear"
                                >
                                    {item.title}
                                </li>
                            );
                        })}
                    </ul>
                );
            }}
        >
            <WrapperAnimation
                onClick={handleClick}
                hover={{}}
                className={classNames('p-1 flex items-center justify-center transition-all ease-linear text-[#ccc]', {
                    [style['popup-nav-chat-item']]: true,
                })}
            >
                <FontAwesomeIcon icon={faEllipsisVertical} />
            </WrapperAnimation>
        </Tippy>
    );
}
