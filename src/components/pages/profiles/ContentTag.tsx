import { DivTextfield, MainButton } from '@/components';
import { PagesProfileType } from '@/configs/types';
import React, { FormEvent } from 'react';

export interface IContentTagProps {
    state: PagesProfileType;
}

export default function ContentTag({ state }: IContentTagProps) {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };
    const content = (() => {
        switch (state) {
            case 'me': {
                return (
                    <form onSubmit={handleSubmit} className="px-14 py-[60px] w-full h-full bg-[#f2f2f2] rounded">
                        <div className="flex flex-col justify-between gap-[22px]">
                            <DivTextfield
                                propsInput={{
                                    name: 'fullname',
                                }}
                                label="Full name"
                            />

                            <div className="flex items-center gap-[22px] lg:gap-12 flex-col md:flex-row">
                                <div className="flex items-center flex-col w-full gap-[22px]">
                                    <DivTextfield
                                        propsInput={{
                                            name: 'email',
                                            type: 'email',
                                        }}
                                        label="Email"
                                    />
                                    <DivTextfield
                                        propsInput={{
                                            name: 'genther',
                                        }}
                                        label="Gender"
                                    />
                                </div>
                                <div className="flex items-center flex-col w-full gap-[22px]">
                                    <DivTextfield
                                        propsInput={{
                                            name: 'phoneNumber',
                                        }}
                                        label="Phone number"
                                    />
                                    <DivTextfield
                                        propsInput={{
                                            name: 'birthday',
                                            type: 'date',
                                        }}
                                        label="Birthday"
                                    />
                                </div>
                            </div>

                            <DivTextfield
                                propsInput={{
                                    name: 'address',
                                }}
                                label="Address"
                            />
                            <DivTextfield
                                propsInput={{
                                    name: 'password',
                                    type: 'password',
                                }}
                                label="Current Password (Skip if you don’t want to change the password)"
                            />
                            <DivTextfield
                                propsInput={{
                                    name: 'confir-password',
                                    type: 'password',
                                }}
                                label="Confirm new password"
                            />
                        </div>

                        <div className="flex items-center justify-center w-full">
                            <MainButton width={'208px'} title="update" className="mt-8" />
                        </div>
                    </form>
                );
            }
            case 'history': {
                return <span>This is history tag</span>;
            }
            case 'logout': {
                return <span>This is logout method</span>;
            }
        }
    })();

    return content;
}
