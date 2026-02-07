import { configureStore } from '@reduxjs/toolkit';
import productReducer from './features/productSlice';
import chatReducer from './features/chatSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            products: productReducer,
            chat: chatReducer,
        },
    });
};
