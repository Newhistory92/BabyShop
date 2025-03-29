import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ElementoCarrito, EstadoCarrito } from "@/types"

const estadoInicial: EstadoCarrito = {
  elementos: [],
  estaAbierto: false,
}

export const carritoSlice = createSlice({
  name: "carrito",
  initialState: estadoInicial,
  reducers: {
    agregarElemento: (state, action: PayloadAction<ElementoCarrito>) => {
      const elementoExistente = state.elementos.find(
        (elemento) => elemento.id === action.payload.id && elemento.variante === action.payload.variante,
      )

      if (elementoExistente) {
        elementoExistente.cantidad += action.payload.cantidad
      } else {
        state.elementos.push(action.payload)
      }
    },
    eliminarElemento: (state, action: PayloadAction<{ id: string; variante?: string }>) => {
      state.elementos = state.elementos.filter(
        (elemento) => !(elemento.id === action.payload.id && elemento.variante === action.payload.variante),
      )
    },
    actualizarCantidad: (state, action: PayloadAction<{ id: string; variante?: string; cantidad: number }>) => {
      const elemento = state.elementos.find(
        (elemento) => elemento.id === action.payload.id && elemento.variante === action.payload.variante,
      )

      if (elemento) {
        elemento.cantidad = action.payload.cantidad
      }
    },
    limpiarCarrito: (state) => {
      state.elementos = []
    },
    alternarCarrito: (state) => {
      state.estaAbierto = !state.estaAbierto
    },
    cerrarCarrito: (state) => {
      state.estaAbierto = false
    },
    abrirCarrito: (state) => {
      state.estaAbierto = true
    },
  },
})

export const {
  agregarElemento,
  eliminarElemento,
  actualizarCantidad,
  limpiarCarrito,
  alternarCarrito,
  cerrarCarrito,
  abrirCarrito,
} = carritoSlice.actions

export default carritoSlice.reducer

