import { IMessage } from '@/configs/interface';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

// init a store for app
interface IInitChatStoreState {
    location: IMessage['location'] | null;
    address: IMessage['address'] | null;
    avatar: string | null;
    username: string | null;
}

const initState: IInitChatStoreState = {
    location: null,
    address: null,
    avatar: null,
    username: null,
};

export const chat = createSlice({
    name: 'chat',
    initialState: initState,
    reducers: {
        setDataMap: (state, action: PayloadAction<{ location: IMessage['location']; address: IMessage['address']; avatar: string | null; username: string }>) => {
            return {
                ...state,
                ...action.payload,
            };
        },
        clearDataMap: (state) => {
            return {
                ...state,
                location: null,
                address: null,
                avatar: null,
                username: null,
            };
        },
    },
});

export const { setDataMap, clearDataMap } = chat.actions;
export default chat.reducer;
