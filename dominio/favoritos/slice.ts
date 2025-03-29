import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ElementoFavorito } from "@/types"

interface EstadoFavoritos {
  elementos: Omit<ElementoFavorito, "usuarioId" | "creado">[]
}

const estadoInicial: EstadoFavoritos = {
  elementos: [],
}

export const favoritosSlice = createSlice({
  name: "favoritos",
  initialState: estadoInicial,
  reducers: {
    agregarFavorito: (state, action: PayloadAction<Omit<ElementoFavorito, "usuarioId" | "creado">>) => {
      if (!state.elementos.some((elemento) => elemento.id === action.payload.id)) {
        state.elementos.push(action.payload)
      }
    },
    eliminarFavorito: (state, action: PayloadAction<string>) => {
      state.elementos = state.elementos.filter((elemento) => elemento.id !== action.payload)
    },
    establecerFavoritos: (state, action: PayloadAction<Omit<ElementoFavorito, "usuarioId" | "creado">[]>) => {
      state.elementos = action.payload
    },
    limpiarFavoritos: (state) => {
      state.elementos = []
    },
  },
})

export const { agregarFavorito, eliminarFavorito, establecerFavoritos, limpiarFavoritos } = favoritosSlice.actions

export default favoritosSlice.reducer

