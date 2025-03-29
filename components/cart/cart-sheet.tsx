"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { closeCart, removeItem, updateQuantity } from "@/lib/redux/features/cartSlice"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

export function CartSheet() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { items, isOpen } = useSelector((state: RootState) => state.cart)

  // Calcular subtotal
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  // Calcular envío
  const shipping = subtotal > 5000 ? 0 : 499

  // Calcular total
  const total = subtotal + shipping

  // Función para cerrar el carrito
  const handleClose = () => {
    dispatch(closeCart())
  }

  // Función para eliminar un item
  const handleRemoveItem = (id: number, variant?: string) => {
    dispatch(removeItem({ id, variant }))
  }

  // Función para actualizar la cantidad
  const handleUpdateQuantity = (id: number, quantity: number, variant?: string) => {
    if (quantity < 1) return
    dispatch(updateQuantity({ id, quantity, variant }))
  }

  // Función para ir al checkout
  const handleCheckout = () => {
    dispatch(closeCart())
    router.push("/checkout")
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="px-1">
          <SheetTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Tu Carrito
          </SheetTitle>
        </SheetHeader>

        {items.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto py-6">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.variant || ""}`} className="flex gap-4">
                    <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">
                            <Link href={`/productos/${item.id}`} className="hover:text-green-700" onClick={handleClose}>
                              {item.name}
                            </Link>
                          </h3>
                          {item.variant && <p className="text-sm text-gray-500">{item.variant}</p>}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id, item.variant)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-5 w-5" />
                          <span className="sr-only">Eliminar</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.variant)}
                            className="px-2 py-1 text-gray-600 hover:text-gray-900"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 py-1 text-center w-8 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.variant)}
                            className="px-2 py-1 text-gray-600 hover:text-gray-900"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="font-medium">${(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span>{shipping === 0 ? "Gratis" : `$${shipping.toLocaleString()}`}</span>
                </div>

                <Separator className="my-3" />

                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>

                {subtotal < 5000 && (
                  <div className="text-xs text-green-700 mt-2">
                    Te faltan ${(5000 - subtotal).toLocaleString()} para obtener envío gratis
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <Button className="w-full bg-green-700 hover:bg-green-800" onClick={handleCheckout}>
                  Proceder al pago
                </Button>

                <div className="text-center">
                  <Link href="/productos" className="text-sm text-green-700 hover:underline" onClick={handleClose}>
                    Continuar comprando
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
              <p className="text-gray-500 mb-8">Parece que aún no has agregado productos a tu carrito</p>
              <Button asChild className="bg-green-700 hover:bg-green-800" onClick={handleClose}>
                <Link href="/productos">Explorar productos</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

