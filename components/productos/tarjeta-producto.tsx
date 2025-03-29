"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Star } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCarrito } from "@/hooks/useCarrito"
import { useFavoritos } from "@/hooks/useFavoritos"
import { useTransiciones } from "@/hooks/useTransiciones"
import type { Producto, VarianteColor } from "@/types"
import { formatearPrecio } from "@/lib/utils"

interface PropiedadesTarjetaProducto {
  producto: Producto
  mostrarEtiquetas?: boolean
  tamano?: "pequeno" | "normal" | "grande"
}

export function TarjetaProducto({ producto, mostrarEtiquetas = true, tamano = "normal" }: PropiedadesTarjetaProducto) {
  const [cargando, setCargando] = useState(false)
  const [colorSeleccionado, setColorSeleccionado] = useState<string | null>(
    producto.variantesColor && producto.variantesColor.length > 0 ? producto.variantesColor[0].codigo : null,
  )
  const [imagenActual, setImagenActual] = useState<string>(
    producto.variantesColor && producto.variantesColor.length > 0 && producto.variantesColor[0].imagen
      ? producto.variantesColor[0].imagen
      : producto.imagenes[0] || "/placeholder.svg",
  )

  const { agregarAlCarrito } = useCarrito()
  const { agregarFavorito, eliminarFavorito, esFavorito } = useFavoritos()
  const { navegarConTransicion } = useTransiciones()

  const estaEnFavoritos = esFavorito(producto.id)

  // Calcular si tiene descuento
  const tieneDescuento = producto.precioOriginal && producto.precioOriginal > producto.precio
  const porcentajeDescuento = tieneDescuento
    ? Math.round(((producto.precioOriginal! - producto.precio) / producto.precioOriginal!) * 100)
    : 0

  // Determinar clases según el tamaño
  const clasesTamano = {
    pequeno: {
      contenedor: "group",
      imagen: "aspect-square",
      titulo: "text-xs md:text-sm",
      precio: "text-xs md:text-sm",
      boton: "text-xs h-8",
      colorCirculo: "h-4 w-4",
    },
    normal: {
      contenedor: "group",
      imagen: "aspect-square",
      titulo: "text-sm md:text-base",
      precio: "text-sm md:text-base",
      boton: "text-xs h-9",
      colorCirculo: "h-5 w-5",
    },
    grande: {
      contenedor: "group",
      imagen: "aspect-square",
      titulo: "text-base md:text-lg",
      precio: "text-base md:text-lg",
      boton: "text-sm h-10",
      colorCirculo: "h-6 w-6",
    },
  }

  const clases = clasesTamano[tamano]

  // Manejar clic en agregar al carrito
  const manejarAgregarAlCarrito = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setCargando(true)

    // Simular un pequeño retraso para mostrar el estado de carga
    setTimeout(() => {
      agregarAlCarrito(producto, 1, colorSeleccionado || undefined)
      setCargando(false)
    }, 300)
  }

  // Manejar clic en favorito
  const manejarFavorito = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (estaEnFavoritos) {
      eliminarFavorito(producto.id)
    } else {
      agregarFavorito({
        id: producto.id,
        productoId: producto.id,
        producto: producto,
      })
    }
  }

  // Manejar cambio de color
  const manejarCambioColor = (variante: VarianteColor) => {
    setColorSeleccionado(variante.codigo)
    if (variante.imagen) {
      setImagenActual(variante.imagen)
    }
  }

  return (
    <motion.div
      className={clases.contenedor}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-90 transition-opacity">
        <Link
          href={`/productos/${producto.id}`}
          onClick={(e) => {
            e.preventDefault()
            navegarConTransicion(() => (window.location.href = `/productos/${producto.id}`))
          }}
        >
          <div className={clases.imagen}>
            <Image
              src={imagenActual || "/placeholder.svg"}
              alt={producto.nombre}
              fill
              className="object-cover object-center transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>

          {/* Etiquetas */}
          {mostrarEtiquetas && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {producto.esNuevo && <Badge className="bg-green-700 hover:bg-green-800">Nuevo</Badge>}
              {tieneDescuento && <Badge className="bg-red-600 hover:bg-red-700">-{porcentajeDescuento}%</Badge>}
            </div>
          )}

          {/* Botón de favorito */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" className="rounded-full h-8 w-8" onClick={manejarFavorito}>
              <Heart className={`h-4 w-4 ${estaEnFavoritos ? "fill-red-500 text-red-500" : ""}`} />
              <span className="sr-only">{estaEnFavoritos ? "Quitar de favoritos" : "Agregar a favoritos"}</span>
            </Button>
          </div>
        </Link>
      </div>

      {/* Selector de colores */}
      {producto.variantesColor && producto.variantesColor.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5 items-center">
          {producto.variantesColor.map((variante) => (
            <button
              key={variante.codigo}
              className={`rounded-full border-2 transition-all ${
                colorSeleccionado === variante.codigo
                  ? "border-gray-800 scale-110"
                  : "border-transparent hover:border-gray-300"
              } ${clases.colorCirculo}`}
              style={{ backgroundColor: variante.codigo }}
              onClick={(e) => {
                e.preventDefault()
                manejarCambioColor(variante)
              }}
              aria-label={`Color ${variante.nombre}`}
              title={variante.nombre}
            />
          ))}
        </div>
      )}

      <div className="mt-2 flex flex-col">
        {/* Etiquetas ecológicas */}
        {mostrarEtiquetas && producto.etiquetasEco && producto.etiquetasEco.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mb-1">
            {producto.etiquetasEco.slice(0, 2).map((etiqueta) => (
              <span key={etiqueta} className="text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded-sm">
                {etiqueta}
              </span>
            ))}
          </div>
        )}

        {/* Nombre del producto */}
        <h3 className={`font-medium text-gray-900 ${clases.titulo}`}>
          <Link
            href={`/productos/${producto.id}`}
            onClick={(e) => {
              e.preventDefault()
              navegarConTransicion(() => (window.location.href = `/productos/${producto.id}`))
            }}
          >
            <span aria-hidden="true" className="absolute inset-0" />
            {producto.nombre}
          </Link>
        </h3>

        {/* Precio y calificación */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1">
            <p className={`font-medium text-gray-900 ${clases.precio}`}>{formatearPrecio(producto.precio)}</p>
            {tieneDescuento && (
              <p className="text-sm text-gray-500 line-through">{formatearPrecio(producto.precioOriginal!)}</p>
            )}
          </div>

          {producto.calificacion && (
            <div className="flex items-center">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-xs text-gray-600">{producto.calificacion.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Botón de agregar al carrito */}
      <div className="mt-3">
        <Button
          className={`w-full bg-green-700 hover:bg-green-800 ${clases.boton}`}
          size="sm"
          onClick={manejarAgregarAlCarrito}
          disabled={cargando}
        >
          {cargando ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <ShoppingBag className="h-3.5 w-3.5 mr-1" />
              Agregar al carrito
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}


