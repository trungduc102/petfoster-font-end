import React, {ReactNode} from 'react';
import classNames from 'classnames';
import {ContainerContent} from '../common';
import {LocationTileType} from '@/configs/types';
import Link from 'next/link';

export interface IBoxTitleProps {
   id?: string;
   children: ReactNode;
   title: string;
   locationTitle?: LocationTileType;
   background?: string;
   className?: string;
   underlineTitle?: boolean;
   fontSizeTitle?: string;
   fontWeigth?: string;
   mbUnderline?: string;
   mt?: string;
   border?: boolean;
   actions?: ReactNode;
}

export default function BoxTitle({
   id,
   children,
   title,
   locationTitle = 'center',
   background = 'bg-white',
   className,
   underlineTitle,
   fontSizeTitle = 'text-[32px]',
   fontWeigth = 'font-semibold',
   mbUnderline = 'mb-[34px]',
   mt = 'mt-24',
   actions,
   border = true,
}: IBoxTitleProps) {
   return (
      <ContainerContent
         id={id}
         className={className}
         classNameContainer={classNames('', {
            [background]: true,
         })}
      >
         <div
            className={classNames(
               'flex items-end justify-between text-black-main',
               {
                  ['pb-[14px] ']: underlineTitle,
                  ['border-b border-gray-primary']: border,
                  ['pb-[48px]']: !underlineTitle,
                  [mbUnderline]: true,
                  [mt]: true,
               },
            )}
         >
            <h2
               className={classNames('  ', {
                  ['text-' + locationTitle]: true,
                  [fontSizeTitle]: true,
                  [fontWeigth]: true,
               })}
            >
               {title.toUpperCase()}
            </h2>

            {actions}
         </div>

         {children}
      </ContainerContent>
   );
}
