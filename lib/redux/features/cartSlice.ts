import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  variant?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

const initialState: CartState = {
  items: [],
  isOpen: false,
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id && item.variant === action.payload.variant,
      )

      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
    },
    removeItem: (state, action: PayloadAction<{ id: number; variant?: string }>) => {
      state.items = state.items.filter(
        (item) => !(item.id === action.payload.id && item.variant === action.payload.variant),
      )
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; variant?: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id && item.variant === action.payload.variant)

      if (item) {
        item.quantity = action.payload.quantity
      }
    },
    clearCart: (state) => {
      state.items = []
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
    closeCart: (state) => {
      state.isOpen = false
    },
    openCart: (state) => {
      state.isOpen = true
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart, toggleCart, closeCart, openCart } = cartSlice.actions

export default cartSlice.reducer

