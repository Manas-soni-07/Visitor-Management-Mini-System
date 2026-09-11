import axios from 'axios'
import type { Visitor, VisitorInput, VisitorStatus } from '../types'

const api = axios.create({ baseURL: '/api', timeout: 10000 })

api.defaults.adapter = async (config) => ({ data: null, status: 200, statusText: 'OK', headers: {}, config })
const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms))

let visitors: Visitor[] = [
  { id: 'v-101', name: 'Arjun Mehta', phone: '+91 98765 43210', unit: 'A-302', visitDate: '2026-09-12', status: 'Pending' },
  { id: 'v-102', name: 'Priya Sharma', phone: '+91 98111 22445', unit: 'B-108', visitDate: '2026-09-12', status: 'Approved' },
  { id: 'v-103', name: 'Rohan Kapoor', phone: '+91 99001 88442', unit: 'C-504', visitDate: '2026-09-13', status: 'Pending' },
  { id: 'v-104', name: 'Neha Verma', phone: '+91 97654 32109', unit: 'A-201', visitDate: '2026-09-14', status: 'Rejected' },
  { id: 'v-105', name: 'Kabir Singh', phone: '+91 99887 76655', unit: 'D-310', visitDate: '2026-09-14', status: 'Approved' },
]


export const visitorApi = {
  async login(email: string, password: string) {
    await delay(); await api.post('/auth/login', { email, password })
    if (password !== 'visitor123') throw new Error('Invalid email or password. Try password: visitor123')
    return { name: 'Hariom ', email, token: 'mock-access-token' }
  },
  async getAll() { await delay(); await api.get('/visitors'); return [...visitors] },
  async create(input: VisitorInput) {
    await delay(); await api.post('/visitors', input)
    const visitor: Visitor = { ...input, id: `v-${Date.now()}`, status: 'Pending' }
    visitors = [visitor, ...visitors]; return visitor
  },
  async updateStatus(id: string, status: VisitorStatus) {
    await delay(); await api.patch(`/visitors/${id}/${status.toLowerCase()}`)
    const found = visitors.find((v) => v.id === id); if (!found) throw new Error('Visitor not found')
    const visitor = { ...found, status }; visitors = visitors.map((v) => v.id === id ? visitor : v); return visitor
  },
  async remove(id: string) { await delay(); await api.delete(`/visitors/${id}`); visitors = visitors.filter((v) => v.id !== id) },
}
