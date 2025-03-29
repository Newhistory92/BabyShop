"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp, ShoppingBag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import type { ElementoCarrito } from "@/types"
import { formatearPrecio } from "@/lib/utils"

interface PropiedadesResumenPedido {
  elementos: ElementoCarrito[]
  subtotal: number
  descuento: number
  costoEnvio: number
  total: number
  codigoDescuento: string
  setCodigoDescuento: (codigo: string) => void
  aplicarDescuento: () => void
  cargandoDescuento: boolean
  mensajeDescuento?: string
  errorDescuento?: string
}

export function ResumenPedido({
  elementos,
  subtotal,
  descuento,
  costoEnvio,
  total,
  codigoDescuento,
  setCodigoDescuento,
  aplicarDescuento,
  cargandoDescuento,
  mensajeDescuento,
  errorDescuento,
}: PropiedadesResumenPedido) {
  const [mostrarDetalles, setMostrarDetalles] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>

      {/* Botón para mostrar/ocultar detalles en móvil */}
      <Button
        variant="outline"
        className="w-full flex items-center justify-between md:hidden mb-4"
        onClick={() => setMostrarDetalles(!mostrarDetalles)}
      >
        <span className="flex items-center">
          <ShoppingBag className="h-4 w-4 mr-2" />
          {elementos.length} {elementos.length === 1 ? "producto" : "productos"}
        </span>
        {mostrarDetalles ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {/* Detalles del pedido */}
      <AnimatePresence>
        {(mostrarDetalles || window.innerWidth >= 768) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 mb-6">
              {elementos.map((elemento) => (
                <div key={`${elemento.id}-${elemento.variante || ""}`} className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-md border overflow-hidden flex-shrink-0">
                    <Image
                      src={elemento.imagen || "/placeholder.svg"}
                      alt={elemento.nombre}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                    <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs px-1 rounded-bl">
                      {elemento.cantidad}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">{elemento.nombre}</h3>
                    {elemento.variante && <p className="text-xs text-gray-500">{elemento.variante}</p>}
                    <p className="text-sm font-medium mt-1">{formatearPrecio(elemento.precio * elemento.cantidad)}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Código de descuento */}
      <div className="mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Código de descuento"
            value={codigoDescuento}
            onChange={(e) => setCodigoDescuento(e.target.value)}
            disabled={cargandoDescuento || descuento > 0}
          />
          <Button
            variant="outline"
            onClick={aplicarDescuento}
            disabled={cargandoDescuento || !codigoDescuento || descuento > 0}
          >
            {cargandoDescuento ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-700 border-t-transparent" />
            ) : (
              "Aplicar"
            )}
          </Button>
        </div>

        {mensajeDescuento && <p className="text-xs text-green-700 mt-1">{mensajeDescuento}</p>}

        {errorDescuento && <p className="text-xs text-red-500 mt-1">{errorDescuento}</p>}
      </div>

      {/* Totales */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatearPrecio(subtotal)}</span>
        </div>

        {descuento > 0 && (
          <div className="flex justify-between text-green-700">
            <span>Descuento</span>
            <span>-{formatearPrecio(descuento)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-600">Envío</span>
          <span>{costoEnvio === 0 ? "Gratis" : formatearPrecio(costoEnvio)}</span>
        </div>

        <Separator className="my-3" />

        <div className="flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>{formatearPrecio(total)}</span>
        </div>

        {subtotal < 5000 && costoEnvio > 0 && (
          <div className="text-xs text-green-700 mt-2">
            Te faltan {formatearPrecio(5000 - subtotal)} para obtener envío gratis
          </div>
        )}
      </div>
    </div>
  )
}

