import Tippy from '@tippyjs/react/headless';
import * as React from 'react';
import { WrapperAnimation } from '..';
import style from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import firebaseService from '@/services/firebaseService';
import { IMessage } from '@/configs/interface';
import { toast } from 'react-toastify';

export interface IPopupMessageProps {
    data: IMessage;
}

export default function PopupMessage({ data }: IPopupMessageProps) {
    const handleRecall = async () => {
        const validHour = (new Date().getTime() - data?.sendAt.getTime()) / 60 / 60 / 1000;

        console.log(validHour);

        if (validHour > 1) {
            toast.warn('Only messages sent 1 hour ago can be recalled');
            return;
        }
        await firebaseService.setRecallMessage(data.id);
    };

    return (
        <Tippy
            placement="bottom-end"
            offset={[0, -10]}
            interactive
            render={(attr) => {
                return (
                    <ul className="rounded bg-white shadow-md w-fit py-1 text-xs transition-all ease-linear">
                        <li onClick={handleRecall} className="hover:bg-[#f2f2f2] py-1 px-2 cursor-pointer">
                            message recall
                        </li>
                    </ul>
                );
            }}
        >
            <WrapperAnimation
                hover={{}}
                className={classNames('text-transparent py-2 px-1 cursor-pointer', {
                    [style['chat-item-func']]: true,
                })}
            >
                <FontAwesomeIcon icon={faEllipsisVertical} />
            </WrapperAnimation>
        </Tippy>
    );
}
