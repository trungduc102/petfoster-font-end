import * as React from 'react';
import { ContainerContent } from '../..';
import MissionVisonItem from './MissionVisonItem';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faBinoculars, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { BoxTitle } from '@/components';

export interface IMissionVisonProps {}

export default function MissionVison(props: IMissionVisonProps) {
    return (
        <BoxTitle title="MISSION & VISION" className="my-20">
            <div className="w-full grid lg:grid-cols-2 items-center justify-between gap-[42px]">
                <MissionVisonItem
                    data={{
                        icon: faCrosshairs,
                        content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit non nulla doloremque at dolorem libero ut, sequi nam explicabo iste maxime beatae, magnam facere aut fuga`,
                        title: 'Mission',
                    }}
                />
                <MissionVisonItem
                    data={{
                        icon: faBinoculars,
                        content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit non nulla doloremque at dolorem libero ut, sequi nam explicabo iste maxime beatae, magnam facere aut fuga`,
                        title: 'Vision',
                    }}
                />
            </div>
        </BoxTitle>
    );
}
