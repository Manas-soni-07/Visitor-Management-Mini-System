import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { visitorApi } from '../api/client'
import type { VisitorInput, VisitorStatus } from '../types'

export const fetchVisitors = createAsyncThunk('visitors/fetch', visitorApi.getAll)
export const addVisitor = createAsyncThunk('visitors/add', visitorApi.create)
export const changeStatus = createAsyncThunk('visitors/status', ({ id, status }: {id: string; status: VisitorStatus}) => visitorApi.updateStatus(id, status))
export const deleteVisitor = createAsyncThunk('visitors/delete', async (id: string) => { await visitorApi.remove(id); return id })
const visitorsSlice = createSlice({ name: 'visitors', initialState: { items: [] as import('../types').Visitor[], loading: false, saving: false, error: '' }, reducers: {}, extraReducers: (builder) => builder
  .addCase(fetchVisitors.pending, (s) => { s.loading = true; s.error = '' }).addCase(fetchVisitors.fulfilled, (s, a) => { s.loading = false; s.items = a.payload }).addCase(fetchVisitors.rejected, (s) => { s.loading = false; s.error = 'Could not load visitors. Please try again.' })
  .addCase(addVisitor.pending, (s) => { s.saving = true }).addCase(addVisitor.fulfilled, (s, a) => { s.saving = false; s.items.unshift(a.payload) }).addCase(addVisitor.rejected, (s) => { s.saving = false; s.error = 'Could not add visitor.' })
  .addCase(changeStatus.fulfilled, (s, a) => { s.items = s.items.map((v) => v.id === a.payload.id ? a.payload : v) })
  .addCase(deleteVisitor.fulfilled, (s, a) => { s.items = s.items.filter((v) => v.id !== a.payload) }),
})
export default visitorsSlice.reducer
