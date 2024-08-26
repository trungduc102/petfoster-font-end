import { ICart, IInitAppStoreState, IUser } from '@/configs/interface';
import { RootState } from '@/configs/types';
import { addCartTolocal, addPaymetnTolocal, getPaymentFromLocal, getStoreFromLocal } from '@/utils/localStorege';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { pushNoty } from './appSlice';
import { createCartUser, getCartUser } from '@/apis/user';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';
import { capitalize } from '@mui/material';

export const getPayment = createAsyncThunk('cart/getPayment', (_, thunkApi) => {
    const { userReducer } = thunkApi.getState() as RootState;

    const username = userReducer.user?.username;
    if (!username || username === '') return [];

    const store = getPaymentFromLocal(username);

    if (!store) return [];

    return store.payment as ICart[];
});

export const getCart = createAsyncThunk('cart/getCartUser', async (_, thunkApi) => {
    const { userReducer } = thunkApi.getState() as RootState;

    const username = userReducer.user?.username;
    if (!username || username === '')
        return {
            data: [],
            username,
        };

    try {
        const response = await getCartUser();

        // if call failure
        if (!response)
            return {
                data: [],
                username,
            };

        // if call failure
        if (response.status !== 200)
            return {
                data: [],
                username,
            };

        const modifyResponse = response.data.map((item) => {
            return {
                ...item,
                checked: false,
            };
        });

        return {
            data: modifyResponse as ICart[],
            username,
        };
    } catch (error) {
        return {
            data: [],
            username,
        };
    }
});
export const getCheckedAllCart = createAsyncThunk('cart/getCheckedAllCart', async (_, thunkApi) => {
    const { userReducer } = thunkApi.getState() as RootState;

    const username = userReducer.user?.username;

    if (!username || username === '') return false;

    const store = getStoreFromLocal(username);

    const arrCart = (store.cart as ICart[]) || [];
    const checkAll = arrCart.every((item) => {
        return item.checked;
    });
    return checkAll;
});

export const addPaymentFromCard = createAsyncThunk('cart/addPaymentFromCard', (_, thunkApi) => {
    const { userReducer, cartReducer } = thunkApi.getState() as RootState;
    const username = userReducer.user?.username;
    if (!username || username === '') return { paymentItems: [], cartItems: [], username: '' };

    const paymentItems = cartReducer.cartUser.filter((item) => {
        return item.checked;
    });

    const cartItems = cartReducer.cartUser.filter((item) => {
        return !item.checked;
    });

    return {
        paymentItems,
        cartItems,
        username,
    };
});

export const clearAllPayment = createAsyncThunk('cart/clearAllPayment', (_, thunkApi) => {
    const { userReducer, cartReducer } = thunkApi.getState() as RootState;
    const username = userReducer.user?.username;
    if (!username || username === '') return { paymentItems: [], cartItems: [], username: '' };

    addPaymetnTolocal({ cart: cartReducer.cartUser, payment: [] }, username);
});

export const addPayment = createAsyncThunk('cart/addPayment', (data: ICart, thunkApi) => {
    const { userReducer } = thunkApi.getState() as RootState;
    const username = userReducer.user?.username;
    if (!username || username === '') return undefined;

    return {
        username,
        data,
    };
});

export const deletePayment = createAsyncThunk('cart/deletePayment', (index: number, thunkApi) => {
    const { userReducer } = thunkApi.getState() as RootState;
    const username = userReducer.user?.username;
    if (!username || username === '') return undefined;

    return {
        username,
        index,
    };
});

export const addCart = createAsyncThunk('cart/addCartUser', async (data: ICart, thunkApi) => {
    const { userReducer } = thunkApi.getState() as RootState;
    const username = userReducer.user?.username;
    if (!username || username === '') return undefined;

    try {
        const response = await createCartUser(data);

        if (!response) {
            toast.warn(contants.messages.errors.handle);

            return {
                data,
                username,
            };
        }

        if (response.status != 200) {
            toast.error(capitalize(response.message));

            return {
                data,
                username,
            };
        }

        return {
            data,
            username,
        };
    } catch (error) {
        return {
            data,
            username,
        };
    }
});

export const removeCart = createAsyncThunk('cart/removeCartUser', (data: { data: ICart; index: number }, thunkApi) => {
    const { userReducer } = thunkApi.getState() as RootState;
    const username = userReducer.user?.username;
    if (!username || username === '') return undefined;

    return {
        data,
        username,
    };
});

export const modifyQuantity = createAsyncThunk('cart/modifyQuantity', (data: ICart, thunkApi) => {
    const { userReducer } = thunkApi.getState() as RootState;
    const username = userReducer.user?.username;
    if (!username || username === '') return undefined;

    return {
        data,
        username,
    };
});

export const modifyChecked = createAsyncThunk('cart/modifyChecked', (data: { data: ICart; checked: boolean }, thunkApi) => {
    const { userReducer } = thunkApi.getState() as RootState;
    const username = userReducer.user?.username;
    if (!username || username === '') return undefined;

    return {
        data,
        username,
    };
});

export const checkedAll = createAsyncThunk('cart/checkedAll', (data: boolean, thunkApi) => {
    const { userReducer } = thunkApi.getState() as RootState;
    const username = userReducer.user?.username;
    if (!username || username === '') return undefined;

    return {
        data,
        username,
    };
});

// init a store for app
const initState: { cartUser: ICart[]; checkAll: boolean; payment: ICart[] } = {
    cartUser: [],
    checkAll: false,
    payment: [],
};

export const cart = createSlice({
    name: 'cart',
    initialState: initState,
    reducers: {
        setCheckedAllCartItem: (state, action: PayloadAction<boolean>) => {
            state.checkAll = action.payload;
        },

        updateDataCartWhenMount: (state, action: PayloadAction<ICart[]>) => {
            const newStateCartUser = [...state.cartUser];
            newStateCartUser.sort();
            action.payload.sort();
            const newCartUser = newStateCartUser.map((item, index) => {
                return {
                    ...item,
                    repo: action.payload[index].repo,
                };
            });
            // addCartTolocal(newCartUser);
            return {
                ...state,
                cartUser: [...newCartUser],
            };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getPayment.pending, (state, action) => {}),
            builder.addCase(getPayment.fulfilled, (state, action) => {
                state.payment = action.payload;
            }),
            builder.addCase(getPayment.rejected, (state, action) => {}),
            builder.addCase(addPaymentFromCard.fulfilled, (state, action) => {
                if (!action.payload?.username || action.payload.paymentItems.length <= 0) {
                    return;
                }

                const data = {
                    cart: action.payload.cartItems,
                    payment: action.payload.paymentItems,
                };

                // addCartTolocal(data.cart);
                addPaymetnTolocal({ ...data }, action.payload.username);

                return {
                    ...state,
                    cartUser: [...data.cart],
                    payment: [...data.payment],
                };
            });
        builder.addCase(addPayment.fulfilled, (state, action) => {
            if (!action.payload?.username || !action.payload.data) {
                return;
            }

            const item = state.payment.find((item) => item.id === action.payload?.data.id && item.size === action.payload.data.size);

            if (item) {
                // handle when double key
                const newQuantity = action.payload.data.quantity + item.quantity;
                if (newQuantity > item.repo) {
                    item.quantity = item.repo;
                } else {
                    item.quantity = newQuantity;
                }
                addPaymetnTolocal({ cart: state.cartUser, payment: state.payment }, action.payload.username);

                return;
            }

            // add
            addPaymetnTolocal({ cart: state.cartUser, payment: [...state.payment, action.payload.data] }, action.payload.username);
            state.payment = [...state.payment, action.payload.data];
        });
        builder.addCase(deletePayment.fulfilled, (state, action) => {
            if (!action.payload?.username) {
                return;
            }

            // delete payment
            state.payment.splice(action.payload.index, 1);
            addPaymetnTolocal({ cart: state.cartUser, payment: state.payment }, action.payload.username);
        }),
            builder.addCase(clearAllPayment.fulfilled, (state, action) => {
                return {
                    ...state,
                    payment: [],
                };
            }),
            //cart
            builder.addCase(getCart.fulfilled, (state, action) => {
                if (!action.payload.username) return;
                addCartTolocal({ payment: state.payment, cart: action.payload.data }, action.payload.username);
                return {
                    ...state,
                    cartUser: action.payload.data,
                };
            }),
            builder.addCase(modifyQuantity.fulfilled, (state, action) => {
                if (!action.payload) return;

                const item = state.cartUser.find((i) => i.id === action.payload?.data.id && i.size === action.payload.data.size);

                if (item) {
                    item.quantity = action.payload?.data.quantity;
                    addCartTolocal({ payment: state.payment, cart: state.cartUser }, action.payload.username);
                    return;
                }
            }),
            builder.addCase(removeCart.fulfilled, (state, action) => {
                if (!action.payload) return;

                state.cartUser.splice(action.payload?.data.index, 1);
                addCartTolocal({ payment: state.payment, cart: state.cartUser }, action.payload.username);
            }),
            builder.addCase(checkedAll.fulfilled, (state, action) => {
                if (!action.payload) return;

                const newCartUser = state.cartUser.map((item) => {
                    return {
                        ...item,
                        checked: item.repo > 0 ? action.payload?.data : false,
                    };
                });

                addCartTolocal({ payment: state.payment, cart: newCartUser }, action.payload.username);
                return {
                    ...state,
                    cartUser: [...newCartUser],
                };
            }),
            builder.addCase(modifyChecked.fulfilled, (state, action) => {
                if (!action.payload) return;

                const item = state.cartUser.find((i) => i.id === action.payload?.data.data.id && i.size === action.payload.data.data.size);

                if (item) {
                    item.checked = action.payload.data.checked;
                    addCartTolocal({ payment: state.payment, cart: state.cartUser }, action.payload.username);

                    const checkAll = state.cartUser.every((item) => {
                        return item.checked;
                    });

                    state.checkAll = checkAll;
                    return;
                }
            }),
            builder.addCase(getCheckedAllCart.fulfilled, (state, action) => {
                return {
                    ...state,
                    checkAll: action.payload,
                };
            }),
            builder.addCase(addCart.fulfilled, (state, action) => {
                if (!action.payload) return;

                const item = state.cartUser.find((i) => i.id === action.payload?.data.id && i.size === action.payload.data.size);

                if (item) {
                    item.quantity = action.payload?.data.quantity + item.quantity;
                    addCartTolocal({ payment: state.payment, cart: state.cartUser }, action.payload.username);

                    return;
                }

                addCartTolocal({ payment: state.payment, cart: [...state.cartUser, action.payload.data] }, action.payload.username);

                state.cartUser = [...state.cartUser, action.payload.data];
            });
    },
});

export const { setCheckedAllCartItem, updateDataCartWhenMount } = cart.actions;
export default cart.reducer;
