import * as React from 'react';
import { AboutCom, ContainerContent } from '../common';
import { BoxTitle, Feedback, MissionVison } from '..';

export interface IAboutPageProps {}

export default function AboutPage(props: IAboutPageProps) {
    return (
        <>
            <AboutCom hideTitle={false} />
            <MissionVison />
            <Feedback />
        </>
    );
}
