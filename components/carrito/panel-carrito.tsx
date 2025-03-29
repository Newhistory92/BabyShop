"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useCarrito } from "@/hooks/useCarrito"
import { useTransiciones } from "@/hooks/useTransiciones"
import { formatearPrecio } from "@/lib/utils"

export function PanelCarrito() {
  const {
    elementosCarrito,
    eliminarDelCarrito,
    actualizarCantidadElemento,
    estaAbierto,
    cerrarPanelCarrito,
    totalCarrito,
  } = useCarrito()
  const { navegarConTransicion } = useTransiciones()

  // Calcular envío
  const costoEnvio = totalCarrito > 5000 ? 0 : 499

  // Calcular total
  const total = totalCarrito + costoEnvio

  // Cerrar el panel al presionar Escape
  useEffect(() => {
    const manejarTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape" && estaAbierto) {
        cerrarPanelCarrito()
      }
    }

    window.addEventListener("keydown", manejarTecla)

    return () => {
      window.removeEventListener("keydown", manejarTecla)
    }
  }, [estaAbierto, cerrarPanelCarrito])

  // Función para ir al checkout
  const irAlCheckout = () => {
    cerrarPanelCarrito()
    navegarConTransicion(() => (window.location.href = "/checkout"))
  }

  return (
    <Sheet open={estaAbierto} onOpenChange={cerrarPanelCarrito}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="px-1">
          <SheetTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Tu Carrito
          </SheetTitle>
        </SheetHeader>

        <AnimatePresence mode="wait">
          {elementosCarrito.length > 0 ? (
            <motion.div
              key="carrito-con-items"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full"
            >
              <div className="flex-1 overflow-y-auto py-6">
                <div className="space-y-6">
                  <AnimatePresence>
                    {elementosCarrito.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.variante || ""}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-4"
                      >
                        <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border">
                          <Image
                            src={item.imagen || "/placeholder.svg"}
                            alt={item.nombre}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">
                                <Link
                                  href={`/productos/${item.id}`}
                                  className="hover:text-green-700"
                                  onClick={() => {
                                    cerrarPanelCarrito()
                                    navegarConTransicion(() => (window.location.href = `/productos/${item.id}`))
                                  }}
                                >
                                  {item.nombre}
                                </Link>
                              </h3>
                              {item.variante && <p className="text-sm text-gray-500">{item.variante}</p>}
                            </div>
                            <button
                              onClick={() => eliminarDelCarrito(item.id, item.variante)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              aria-label={`Eliminar ${item.nombre} del carrito`}
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center border rounded-md">
                              <button
                                onClick={() => actualizarCantidadElemento(item.id, item.cantidad - 1, item.variante)}
                                className="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:text-gray-300"
                                disabled={item.cantidad <= 1}
                                aria-label="Disminuir cantidad"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-2 py-1 text-center w-8 text-sm">{item.cantidad}</span>
                              <button
                                onClick={() => actualizarCantidadElemento(item.id, item.cantidad + 1, item.variante)}
                                className="px-2 py-1 text-gray-600 hover:text-gray-900"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="font-medium">{formatearPrecio(item.precio * item.cantidad)}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatearPrecio(totalCarrito)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span>{costoEnvio === 0 ? "Gratis" : formatearPrecio(costoEnvio)}</span>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>{formatearPrecio(total)}</span>
                  </div>

                  {totalCarrito < 5000 && (
                    <div className="text-xs text-green-700 mt-2">
                      Te faltan {formatearPrecio(5000 - totalCarrito)} para obtener envío gratis
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  <Button className="w-full bg-green-700 hover:bg-green-800" onClick={irAlCheckout}>
                    Proceder al pago
                  </Button>

                  <div className="text-center">
                    <Button
                      variant="link"
                      className="text-sm text-green-700 hover:text-green-800"
                      onClick={() => {
                        cerrarPanelCarrito()
                        navegarConTransicion(() => (window.location.href = "/productos"))
                      }}
                    >
                      Continuar comprando
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="carrito-vacio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
                <p className="text-gray-500 mb-8">Parece que aún no has agregado productos a tu carrito</p>
                <Button
                  asChild
                  className="bg-green-700 hover:bg-green-800"
                  onClick={() => {
                    cerrarPanelCarrito()
                    navegarConTransicion(() => (window.location.href = "/productos"))
                  }}
                >
                  <Link href="/productos">Explorar productos</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  )
}

