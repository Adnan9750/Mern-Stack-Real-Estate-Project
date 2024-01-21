import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userAuthApi } from '../services/userAuthApi'
import userSlice from './user/userSlice'
import {persistReducer,persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

//we use (redux-persist) because when page is refresh our data is remove from redux 
// so by using (redux-persist) we overcome this problem. we can use this by below method. 
const rootReducer = combineReducers({user:userSlice})

const persistConfig = {
  key: 'root',
  storage,
  version:1
}

const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
  reducer: {
    [userAuthApi.reducerPath]: userAuthApi.reducer,
    persistedReducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAuthApi.middleware),
})

setupListeners(store.dispatch)

// export our persister
export const persister = persistStore(store)