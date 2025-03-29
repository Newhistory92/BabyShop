"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface PropiedadesGaleriaProducto {
  imagenes: string[]
  nombre: string
  esNuevo?: boolean
  tieneDescuento?: boolean
  porcentajeDescuento?: number
}

export function GaleriaProducto({
  imagenes,
  nombre,
  esNuevo = false,
  tieneDescuento = false,
  porcentajeDescuento = 0,
}: PropiedadesGaleriaProducto) {
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0)
  const [imagenZoom, setImagenZoom] = useState<string | null>(null)

  // Función para cambiar a la imagen anterior
  const anteriorImagen = () => {
    setImagenSeleccionada((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1))
  }

  // Función para cambiar a la siguiente imagen
  const siguienteImagen = () => {
    setImagenSeleccionada((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-square overflow-hidden rounded-lg border bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={imagenSeleccionada}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <Image
              src={imagenes[imagenSeleccionada] || "/placeholder.svg"}
              alt={`${nombre} - Imagen ${imagenSeleccionada + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Etiquetas */}
        <div className="absolute top-4 left-4 flex flex-col gap-1">
          {esNuevo && <Badge className="bg-green-700 hover:bg-green-800">Nuevo</Badge>}
          {tieneDescuento && <Badge className="bg-red-600 hover:bg-red-700">-{porcentajeDescuento}%</Badge>}
        </div>

        {/* Botón de zoom */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-4 right-4 rounded-full bg-white/80 hover:bg-white"
              onClick={() => setImagenZoom(imagenes[imagenSeleccionada])}
            >
              <ZoomIn className="h-4 w-4" />
              <span className="sr-only">Ampliar imagen</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
            <div className="relative aspect-square w-full max-h-[80vh]">
              <Image
                src={imagenZoom || imagenes[imagenSeleccionada]}
                alt={`${nombre} - Ampliada`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Controles de navegación */}
        {imagenes.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
              onClick={anteriorImagen}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Imagen anterior</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
              onClick={siguienteImagen}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Siguiente imagen</span>
            </Button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {imagenes.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {imagenes.map((imagen, index) => (
            <button
              key={index}
              className={`relative aspect-square overflow-hidden rounded-md border transition-all ${
                imagenSeleccionada === index
                  ? "ring-2 ring-green-700 scale-105"
                  : "hover:ring-1 hover:ring-green-700/50"
              }`}
              onClick={() => setImagenSeleccionada(index)}
            >
              <Image
                src={imagen || "/placeholder.svg"}
                alt={`${nombre} - Miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 10vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

