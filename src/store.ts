import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
import visitorsReducer from './features/visitorsSlice'

export const store = configureStore({ reducer: { auth: authReducer, visitors: visitorsReducer } })
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch