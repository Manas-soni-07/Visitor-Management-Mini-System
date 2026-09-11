import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { visitorApi } from '../api/client'
import type { User } from '../types'

export const login = createAsyncThunk('auth/login', async ({ email, password }: {email: string; password: string}) => visitorApi.login(email, password))
const authSlice = createSlice({ name: 'auth', initialState: { user: null as User | null, loading: false, error: '' }, reducers: { logout: (state) => { state.user = null; state.error = '' } }, extraReducers: (builder) => builder
  .addCase(login.pending, (state) => { state.loading = true; state.error = '' })
  .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload })
  .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Unable to sign in' }),
})
export const { logout } = authSlice.actions
export default authSlice.reducer
