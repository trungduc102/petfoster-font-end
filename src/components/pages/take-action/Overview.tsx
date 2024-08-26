import {takeActionData} from '@/datas/take-action';
import {faTruckFast} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as React from 'react';

export interface IOverviewProps {}

export default function Overview(props: IOverviewProps) {
   return (
      <div className='mt-16 border border-gray-primary grid md:grid-cols-2 lg:grid-cols-4 min-h-[100px]'>
         {takeActionData.overview.map((overview) => {
            return (
               <div
                  key={overview.title}
                  className='md:[&:nth-last-child(2)]:border-t md:last:border-t md:border-r lg:[&:nth-last-child(2)]:border-t-0 lg:last:border-t-0 md:even:border-r-0 lg:even:border-r 
                        border-r-gray-primary lg:last:border-none flex items-center justify-center gap-6 py-[46px] select-none px-[14px] border-b last:border-b-0 md:border-b-0'
               >
                  <FontAwesomeIcon
                     className='text-[54px] text-[#EF4444]'
                     icon={overview.icon}
                  />
                  <div className=''>
                     <h6 className='uppercase text-xl font-semibold'>
                        {overview.title}
                     </h6>
                     <span className='text-1xl'>{overview.des}</span>
                  </div>
               </div>
            );
         })}
      </div>
   );
}
