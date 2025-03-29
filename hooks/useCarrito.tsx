"use client"

import type React from "react"

import { useContext, createContext, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import {
  agregarElemento,
  eliminarElemento,
  actualizarCantidad,
  limpiarCarrito,
  abrirCarrito,
  cerrarCarrito,
  alternarCarrito,
} from "@/dominio/carrito/slice"
import type { ElementoCarrito, Producto, VarianteProducto } from "@/types"
import { color } from "framer-motion"

type ContextoCarrito = {
  agregarAlCarrito: (producto: Producto, cantidad?: number, variante?: VarianteProducto) => void
  eliminarDelCarrito: (id: string, variante?: string) => void
  actualizarCantidadElemento: (id: string, cantidad: number, variante?: string) => void
  vaciarCarrito: () => void
  abrirPanelCarrito: () => void
  cerrarPanelCarrito: () => void
  alternarPanelCarrito: () => void
  elementosCarrito: ElementoCarrito[]
  cantidadElementos: number
  totalCarrito: number
  estaAbierto: boolean
}

const ContextoCarrito = createContext<ContextoCarrito | undefined>(undefined)

export function ProveedorCarrito({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const { elementos: elementosCarrito, estaAbierto } = useSelector((state: RootState) => state.carrito)

  // Calcular el total de elementos en el carrito
  const cantidadElementos = elementosCarrito.reduce((total, elemento) => total + elemento.cantidad, 0)

  // Calcular el total del carrito
  const totalCarrito = elementosCarrito.reduce((total, elemento) => total + elemento.precio * elemento.cantidad, 0)

  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto: Producto, cantidad = 1, variante?: VarianteProducto) => {
    dispatch(
      agregarElemento({
        id: producto.id,
        nombre: producto.nombre,
        precio: variante ? variante.precio : producto.precio,
        imagen: producto.imagenes?.[0] || "/placeholder.svg",
        cantidad,
        variante: variante?.nombre,
        varianteId: variante?.id,
        color,
      }),
    )
  }

  // Función para eliminar un producto del carrito
  const eliminarDelCarrito = (id: string, variante?: string) => {
    dispatch(eliminarElemento({ id, variante }))
  }

  // Función para actualizar la cantidad de un producto
  const actualizarCantidadElemento = (id: string, cantidad: number, variante?: string) => {
    dispatch(actualizarCantidad({ id, cantidad, variante }))
  }

  // Función para vaciar el carrito
  const vaciarCarrito = () => {
    dispatch(limpiarCarrito())
  }

  // Funciones para controlar la visibilidad del panel del carrito
  const abrirPanelCarrito = () => {
    dispatch(abrirCarrito())
  }

  const cerrarPanelCarrito = () => {
    dispatch(cerrarCarrito())
  }

  const alternarPanelCarrito = () => {
    dispatch(alternarCarrito())
  }

  // Sincronizar el carrito con localStorage
  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito")
    if (carritoGuardado) {
      const carritoParseado = JSON.parse(carritoGuardado)
      carritoParseado.elementos.forEach((elemento: ElementoCarrito) => {
        dispatch(agregarElemento(elemento))
      })
    }
  }, [dispatch])

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify({ elementos: elementosCarrito }))
  }, [elementosCarrito])

  return (
    <ContextoCarrito.Provider
      value={{
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidadElemento,
        vaciarCarrito,
        abrirPanelCarrito,
        cerrarPanelCarrito,
        alternarPanelCarrito,
        elementosCarrito,
        cantidadElementos,
        totalCarrito,
        estaAbierto,
      }}
    >
      {children}
    </ContextoCarrito.Provider>
  )
}

export const useCarrito = () => {
  const contexto = useContext(ContextoCarrito)
  if (contexto === undefined) {
    throw new Error("useCarrito debe ser usado dentro de un ProveedorCarrito")
  }
  return contexto
}

