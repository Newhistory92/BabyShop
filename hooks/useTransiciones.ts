"use client"

import { useState, useTransition } from "react"

// Hook para manejar transiciones de página con el nuevo efecto visual de Next.js 15
export function useTransiciones() {
  const [isPending, startTransition] = useTransition()
  const [cargando, setCargando] = useState(false)

  // Función para navegar con transición
  const navegarConTransicion = (callback: () => void) => {
    setCargando(true)
    startTransition(() => {
      callback()
      // Simular un pequeño retraso para que la transición sea visible
      setTimeout(() => setCargando(false), 300)
    })
  }

  return {
    isPending,
    cargando,
    navegarConTransicion,
  }
}

