"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/useDebounce"
import { useProductos } from "@/hooks/useProductos"

interface PropiedadesBuscador {
  placeholder?: string
  className?: string
  autoFocus?: boolean
  onSearch?: (termino: string) => void
}

export function Buscador({
  placeholder = "Buscar productos...",
  className = "",
  autoFocus = false,
  onSearch,
}: PropiedadesBuscador) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  // Obtener el término de búsqueda de la URL
  const terminoInicial = searchParams.get("busqueda") || ""
  const [termino, setTermino] = useState(terminoInicial)
  const terminoDebounced = useDebounce(termino, 300)

  // Obtener sugerencias de búsqueda
  const { productos, cargando } = useProductos()
  const [sugerencias, setSugerencias] = useState<string[]>([])
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)

  // Actualizar sugerencias cuando cambia el término
  useEffect(() => {
    if (terminoDebounced.length < 2) {
      setSugerencias([])
      return
    }

    // Filtrar productos que coincidan con el término
    const productosFiltrados = productos
      .filter(
        (p) =>
          p.nombre.toLowerCase().includes(terminoDebounced.toLowerCase()) ||
          p.descripcion?.toLowerCase().includes(terminoDebounced.toLowerCase()),
      )
      .slice(0, 5)

    // Extraer nombres de productos como sugerencias
    setSugerencias(productosFiltrados.map((p) => p.nombre))
  }, [terminoDebounced, productos])

  // Manejar cambios en el input
  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermino(e.target.value)
    if (e.target.value.length >= 2) {
      setMostrarSugerencias(true)
    } else {
      setMostrarSugerencias(false)
    }
  }

  // Manejar envío del formulario
  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault()
    realizarBusqueda(termino)
  }

  // Manejar clic en sugerencia
  const manejarSeleccionSugerencia = (sugerencia: string) => {
    setTermino(sugerencia)
    realizarBusqueda(sugerencia)
    setMostrarSugerencias(false)
  }

  // Realizar búsqueda
  const realizarBusqueda = (terminoBusqueda: string) => {
    if (terminoBusqueda.trim()) {
      // Construir URL con parámetros de búsqueda
      const params = new URLSearchParams(searchParams.toString())
      params.set("busqueda", terminoBusqueda.trim())
      params.set("pagina", "1") // Resetear paginación

      // Navegar a la página de resultados
      router.push(`/productos?${params.toString()}`)

      // Llamar al callback si existe
      if (onSearch) {
        onSearch(terminoBusqueda.trim())
      }
    }
  }

  // Limpiar búsqueda
  const limpiarBusqueda = () => {
    setTermino("")
    setMostrarSugerencias(false)

    // Si hay un término en la URL, eliminarlo
    if (searchParams.has("busqueda")) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("busqueda")
      router.push(`/productos?${params.toString()}`)
    }

    // Enfocar el input
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const manejarClickFuera = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setMostrarSugerencias(false)
      }
    }

    document.addEventListener("mousedown", manejarClickFuera)

    return () => {
      document.removeEventListener("mousedown", manejarClickFuera)
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={manejarEnvio} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={termino}
            onChange={manejarCambio}
            className="pl-10 pr-10"
            autoFocus={autoFocus}
            onFocus={() => {
              if (termino.length >= 2) {
                setMostrarSugerencias(true)
              }
            }}
          />
          {termino && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={limpiarBusqueda}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Limpiar búsqueda</span>
            </button>
          )}
        </div>
        <button type="submit" className="sr-only">
          Buscar
        </button>
      </form>

      {/* Sugerencias */}
      <AnimatePresence>
        {mostrarSugerencias && sugerencias.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border"
          >
            <ul className="py-1">
              {sugerencias.map((sugerencia, index) => (
                <li key={index}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                    onClick={() => manejarSeleccionSugerencia(sugerencia)}
                  >
                    <Search className="h-3.5 w-3.5 mr-2 text-gray-400" />
                    {sugerencia}
                  </button>
                </li>
              ))}
              <li className="border-t mt-1 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-left px-4 py-2 text-sm text-green-700 hover:text-green-800 hover:bg-green-50"
                  onClick={() => realizarBusqueda(termino)}
                >
                  Buscar "{termino}"
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

