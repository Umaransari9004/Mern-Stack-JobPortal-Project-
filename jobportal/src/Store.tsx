import { combineReducers, configureStore } from "@reduxjs/toolkit";
import Userslice from "./Slices/Userslice.tsx";
import Companieslice from "./Slices/Companieslice.tsx";
import Jobslice from "./Slices/Jobslice.tsx";

import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import Applicationslice from "./Slices/Applicationslice.tsx";
import Filterslice from "./Slices/Filterslice.tsx";


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth', 'job']
};
const rootReducer = combineReducers({
    auth:Userslice,
    job:Jobslice,
    company:Companieslice,
    application:Applicationslice,
    filter:Filterslice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export default store;


