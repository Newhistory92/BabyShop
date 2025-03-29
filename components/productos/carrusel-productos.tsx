"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { TarjetaProducto } from "@/components/productos/tarjeta-producto"
import type { Producto } from "@/types"

interface PropiedadesCarruselProductos {
  titulo: string
  productos: Producto[]
  verTodosUrl?: string
  tamanoTarjeta?: "pequeno" | "normal" | "grande"
}

export function CarruselProductos({
  titulo,
  productos,
  verTodosUrl,
  tamanoTarjeta = "normal",
}: PropiedadesCarruselProductos) {
  const carruselRef = useRef<HTMLDivElement>(null)
  const [puedeDesplazarIzquierda, setPuedeDesplazarIzquierda] = useState(false)
  const [puedeDesplazarDerecha, setPuedeDesplazarDerecha] = useState(true)
  const [elementosPorPagina, setElementosPorPagina] = useState(4)

  // Determinar cuántos elementos mostrar por página según el ancho de la pantalla
  useEffect(() => {
    const actualizarElementosPorPagina = () => {
      if (window.innerWidth < 640) {
        setElementosPorPagina(2)
      } else if (window.innerWidth < 1024) {
        setElementosPorPagina(3)
      } else {
        setElementosPorPagina(4)
      }
    }

    actualizarElementosPorPagina()
    window.addEventListener("resize", actualizarElementosPorPagina)

    return () => {
      window.removeEventListener("resize", actualizarElementosPorPagina)
    }
  }, [])

  // Función para desplazar a la izquierda
  const desplazarIzquierda = () => {
    if (!carruselRef.current) return

    const scrollAmount = carruselRef.current.clientWidth
    carruselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
  }

  // Función para desplazar a la derecha
  const desplazarDerecha = () => {
    if (!carruselRef.current) return

    const scrollAmount = carruselRef.current.clientWidth
    carruselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  // Actualizar estados de los botones de navegación
  const actualizarEstadoBotones = () => {
    if (!carruselRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = carruselRef.current
    setPuedeDesplazarIzquierda(scrollLeft > 0)
    setPuedeDesplazarDerecha(scrollLeft + clientWidth < scrollWidth - 10) // Margen de error
  }

  // Escuchar eventos de scroll
  useEffect(() => {
    const carrusel = carruselRef.current
    if (!carrusel) return

    carrusel.addEventListener("scroll", actualizarEstadoBotones)

    // Verificar inicialmente
    actualizarEstadoBotones()

    return () => {
      carrusel.removeEventListener("scroll", actualizarEstadoBotones)
    }
  }, [productos])

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <motion.h2
          className="text-2xl md:text-3xl font-bold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {titulo}
        </motion.h2>

        {verTodosUrl && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Button variant="link" className="text-green-700 hover:text-green-800 flex items-center" asChild>
              <a href={verTodosUrl}>
                Ver todos
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </Button>
          </motion.div>
        )}
      </div>

      <div className="relative group">
        {/* Botón izquierdo */}
        <Button
          variant="outline"
          size="icon"
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white border-gray-200 -ml-4 opacity-0 group-hover:opacity-100 transition-opacity ${
            puedeDesplazarIzquierda ? "block" : "hidden"
          }`}
          onClick={desplazarIzquierda}
          aria-label="Desplazar a la izquierda"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {/* Carrusel */}
        <div
          ref={carruselRef}
          className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex space-x-4 md:space-x-6 pb-2">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="flex-none snap-start"
                style={{ width: `calc(100% / ${elementosPorPagina})` }}
              >
                <TarjetaProducto producto={producto} tamano={tamanoTarjeta} />
              </div>
            ))}
          </div>
        </div>

        {/* Botón derecho */}
        <Button
          variant="outline"
          size="icon"
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white border-gray-200 -mr-4 opacity-0 group-hover:opacity-100 transition-opacity ${
            puedeDesplazarDerecha ? "block" : "hidden"
          }`}
          onClick={desplazarDerecha}
          aria-label="Desplazar a la derecha"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}


