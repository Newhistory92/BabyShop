"use client"

import type React from "react"

import { createContext, useContext, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { addItem, removeItem, updateQuantity, clearCart } from "@/lib/redux/features/cartSlice"
import { CartSheet } from "./cart-sheet"

type CartContextType = {
  addToCart: (product: any, quantity?: number, variant?: string) => void
  removeFromCart: (id: number, variant?: string) => void
  updateItemQuantity: (id: number, quantity: number, variant?: string) => void
  clearCartItems: () => void
  cartItems: any[]
  cartCount: number
  cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const { items: cartItems } = useSelector((state: RootState) => state.cart)

  // Calcular el total de items en el carrito
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Calcular el total del carrito
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  // Función para agregar un producto al carrito
  const addToCart = (product: any, quantity = 1, variant?: string) => {
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || product.images?.[0] || "/placeholder.svg",
        quantity,
        variant,
      }),
    )
  }

  // Función para eliminar un producto del carrito
  const removeFromCart = (id: number, variant?: string) => {
    dispatch(removeItem({ id, variant }))
  }

  // Función para actualizar la cantidad de un producto
  const updateItemQuantity = (id: number, quantity: number, variant?: string) => {
    dispatch(updateQuantity({ id, quantity, variant }))
  }

  // Función para vaciar el carrito
  const clearCartItems = () => {
    dispatch(clearCart())
  }

  // Sincronizar el carrito con localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      parsedCart.items.forEach((item: any) => {
        dispatch(addItem(item))
      })
    }
  }, [dispatch])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify({ items: cartItems }))
  }, [cartItems])

  return (
    <CartContext.Provider
      value={{
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCartItems,
        cartItems,
        cartCount,
        cartTotal,
      }}
    >
      {children}
      <CartSheet />
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

