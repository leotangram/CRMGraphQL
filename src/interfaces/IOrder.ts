export interface IOrderProduct {
  id?: string
  quantity: number
}

export interface IOrder {
  id?: string
  order: [IOrderProduct]
  total: number
  client: string
  seller?: string
  state: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  created?: Date
}
