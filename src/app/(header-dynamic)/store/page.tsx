'use client';
import { getUsers } from '@/apis/app';
import { IUser } from '@/configs/interface';
import { Button } from '@mui/material';
import { notFound } from 'next/navigation';
import React, { useState } from 'react';

export interface IStoreProps {}

export default function Store({}: IStoreProps) {
    const [users, setUsers] = useState<IUser[] | null>(null);

    const handleGetUsers = async () => {
        try {
            const res = await getUsers();

            if (res) {
                setUsers(res);
            }
        } catch (error) {
            notFound();
        }
    };

    return (
        <div className="flex flex-col w-full justify-center items-center mt-5 gap-4">
            {/* <Button onClick={handleGetUsers} className="w-[200px]" variant="contained">
                Click to get Users
            </Button> */}
            {users ? (
                <div className="w-full flex flex-col gap-4">
                    {users.map((user) => {
                        return (
                            <div key={user.id} className="flex flex-col gap-2 px-2 py-4 rounded-md border border-gray-400 w-full">
                                <span className="font-bold">{user.username}</span>
                                <span>{user?.email}</span>
                            </div>
                        );
                    })}
                </div>
            ) : (
                ''
            )}
        </div>
    );
}
