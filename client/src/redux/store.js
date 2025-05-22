import { combineReducers, configureStore } from '@reduxjs/toolkit'
// import { useReducer } from 'react'
// we have used export default so we can change its name here
import userReducer from './user/userSlice'
import persistReducer from 'redux-persist/es/persistReducer'
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/es/persistStore'

const rootReducer  = combineReducers({user:userReducer})

const persistConfig = {
    key: 'root',
    storage,
    version:1,
}

const persistedReducer = persistReducer(persistConfig,rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({
    serializableCheck:false,
  }),
})

export const persistor =  persistStore(store)