"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { agregarFavorito, eliminarFavorito, establecerFavoritos, limpiarFavoritos } from "@/dominio/favoritos/slice"
import type { ElementoFavorito } from "@/types"
import { useAutenticacion } from "./useAutenticacion"

export function useFavoritos() {
  const dispatch = useDispatch()
  const { elementos: favoritos } = useSelector((state: RootState) => state.favoritos)
  const { sesion, usuario } = useAutenticacion()
  const [cargando, setCargando] = useState(false)

  // Cargar favoritos del usuario al iniciar
  useEffect(() => {
    const cargarFavoritos = async () => {
      if (sesion && usuario) {
        setCargando(true)
        try {
          const response = await fetch("/api/favoritos")
          if (response.ok) {
            const data = await response.json()
            dispatch(establecerFavoritos(data))
          }
        } catch (error) {
          console.error("Error al cargar favoritos:", error)
        } finally {
          setCargando(false)
        }
      } else {
        // Cargar favoritos de localStorage para usuarios no autenticados
        const favoritosGuardados = localStorage.getItem("favoritos")
        if (favoritosGuardados) {
          dispatch(establecerFavoritos(JSON.parse(favoritosGuardados)))
        }
      }
    }

    cargarFavoritos()
  }, [dispatch, sesion, usuario])

  // Guardar favoritos en localStorage para usuarios no autenticados
  useEffect(() => {
    if (!sesion) {
      localStorage.setItem("favoritos", JSON.stringify(favoritos))
    }
  }, [favoritos, sesion])

  // Función para agregar un producto a favoritos
  const agregarAFavoritos = async (favorito: Omit<ElementoFavorito, "usuarioId" | "creado">) => {
    dispatch(agregarFavorito(favorito))

    if (sesion && usuario) {
      try {
        await fetch("/api/favoritos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productoId: favorito.productoId }),
        })
      } catch (error) {
        console.error("Error al agregar favorito:", error)
      }
    }
  }

  // Función para eliminar un producto de favoritos
  const eliminarDeFavoritos = async (id: string) => {
    dispatch(eliminarFavorito(id))

    if (sesion && usuario) {
      try {
        await fetch(`/api/favoritos/${id}`, {
          method: "DELETE",
        })
      } catch (error) {
        console.error("Error al eliminar favorito:", error)
      }
    }
  }

  // Función para verificar si un producto está en favoritos
  const esFavorito = (productoId: string) => {
    return favoritos.some((favorito) => favorito.productoId === productoId)
  }

  // Función para vaciar favoritos
  const vaciarFavoritos = async () => {
    dispatch(limpiarFavoritos())

    if (sesion && usuario) {
      try {
        await fetch("/api/favoritos", {
          method: "DELETE",
        })
      } catch (error) {
        console.error("Error al vaciar favoritos:", error)
      }
    }
  }

  return {
    favoritos,
    cargando,
    agregarFavorito: agregarAFavoritos,
    eliminarFavorito: eliminarDeFavoritos,
    esFavorito,
    vaciarFavoritos,
  }
}

