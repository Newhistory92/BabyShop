import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface WishlistItem {
  id: number
  name: string
  price: number
  image: string
}

interface WishlistState {
  items: WishlistItem[]
}

const initialState: WishlistState = {
  items: [],
}

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      if (!state.items.some((item) => item.id === action.payload.id)) {
        state.items.push(action.payload)
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearWishlist: (state) => {
      state.items = []
    },
  },
})

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions

export default wishlistSlice.reducer

