import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"

import cartReducer from "./features/cartSlice"
import wishlistReducer from "./features/wishlistSlice"
import { apiSlice } from "./api/apiSlice"
import carritoReducer from "@/dominio/carrito/slice"
import favoritosReducer from "@/dominio/favoritos/slice"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    carrito: carritoReducer, // Mantener para compatibilidad
    wishlist: wishlistReducer,
    favoritos: favoritosReducer, // Añadido el reducer de favoritos
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


