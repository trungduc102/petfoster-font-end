/* eslint-disable @next/next/no-img-element */
import {DivAnitmation} from '@/components';
import {aboutComData} from '@/datas/component-data';
import classNames from 'classnames';
import React from 'react';

export interface IAboutComProps {
   hideTitle?: boolean;
}

export default function AboutCom({hideTitle = true}: IAboutComProps) {
   return (
      <section className='px-10'>
         {!hideTitle && (
            <h2
               className={classNames(
                  'text-black-main mt-24 pb-[48px] text-4xl font-semibold uppercase text-center',
               )}
            >
               ABOUT US
            </h2>
         )}
         <div className='bg-white w-full flex flex-col md:flex-row gap-10 lg:gap-[88px] items-center lg:w-main max-w-[100%] m-auto'>
            <DivAnitmation className='md:w-[40%] w-full'>
               <img
                  className='w-full h-full'
                  src={`/images/${aboutComData.image}`}
                  alt='about-com-img'
               />
            </DivAnitmation>

            <DivAnitmation delay={0.2} className='flex-1'>
               <p className='text-black-main text-[18px] text-justify tracking-wider leading-9'>
                  <span className='font-semibold uppercase text-[#65a30d] text-[18px]'>
                     PetFoster Can Tho
                  </span>
                  {aboutComData.contents}
               </p>
            </DivAnitmation>
         </div>
      </section>
   );
}
