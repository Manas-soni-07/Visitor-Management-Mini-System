export type VisitorStatus = 'Pending' | 'Approved' | 'Rejected'

export interface Visitor {
  id: string
  name: string
  phone: string
  unit: string
  visitDate: string
  status: VisitorStatus
}

export type VisitorInput = Omit<Visitor, 'id' | 'status'>

export interface User { name: string; email: string; token: string }
