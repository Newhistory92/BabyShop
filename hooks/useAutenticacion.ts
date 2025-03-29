"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { servicioAutenticacion } from "@/dominio/autenticacion/servicio"
import type { Usuario, SesionUsuario } from "@/types"

export function useAutenticacion() {
  const router = useRouter()
  const [cargando, setCargando] = useState(true)

  // Obtener la sesión actual
  const {
    data: sesion,
    error,
    mutate: actualizarSesion,
  } = useSWR<SesionUsuario | null>("/api/auth/session", async () => {
    try {
      return await servicioAutenticacion.obtenerSesionActual()
    } catch (error) {
      console.error("Error al obtener la sesión:", error)
      return null
    }
  })

  // Obtener el usuario actual si hay una sesión
  const { data: usuario, mutate: actualizarUsuario } = useSWR<Usuario | null>(
    sesion ? `/api/usuarios/${sesion.usuario.id}` : null,
  )

  // Función para iniciar sesión
  const iniciarSesion = async (email: string, password: string) => {
    setCargando(true)
    try {
      await servicioAutenticacion.iniciarSesion(email, password)
      await actualizarSesion()
      router.push("/")
      return true
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      return false
    } finally {
      setCargando(false)
    }
  }

  // Función para iniciar sesión con Google
  const iniciarSesionConGoogle = async () => {
    setCargando(true)
    try {
      await servicioAutenticacion.iniciarSesionConGoogle()
      return true
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error)
      return false
    } finally {
      setCargando(false)
    }
  }

  // Función para registrar un nuevo usuario
  const registrarUsuario = async (nombre: string, email: string, password: string) => {
    setCargando(true)
    try {
      await servicioAutenticacion.registrarUsuario(nombre, email, password)
      await iniciarSesion(email, password)
      return true
    } catch (error) {
      console.error("Error al registrar usuario:", error)
      return false
    } finally {
      setCargando(false)
    }
  }

  // Función para cerrar sesión
  const cerrarSesion = async () => {
    setCargando(true)
    try {
      await servicioAutenticacion.cerrarSesion()
      await actualizarSesion(null, false)
      router.push("/")
      return true
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      return false
    } finally {
      setCargando(false)
    }
  }

  // Actualizar el estado de carga cuando cambia la sesión
  useEffect(() => {
    if (sesion !== undefined) {
      setCargando(false)
    }
  }, [sesion])

  return {
    usuario,
    sesion,
    cargando,
    error,
    iniciarSesion,
    iniciarSesionConGoogle,
    registrarUsuario,
    cerrarSesion,
    actualizarUsuario,
  }
}

