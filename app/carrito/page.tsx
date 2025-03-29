"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb } from "@/components/breadcrumb"

export default function CartPage() {
  // Datos de ejemplo para el carrito
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Crema Hidratante Facial",
      price: 2499,
      image: "/placeholder.svg?height=100&width=100",
      quantity: 1,
      variant: "50ml",
    },
    {
      id: 3,
      name: "Shampoo Sólido de Coco",
      price: 1299,
      image: "/placeholder.svg?height=100&width=100",
      quantity: 2,
      variant: "Normal",
    },
  ])

  // Estado para código de descuento
  const [discountCode, setDiscountCode] = useState("")
  const [discountApplied, setDiscountApplied] = useState(false)

  // Función para actualizar cantidad
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  // Función para eliminar item
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  // Función para aplicar descuento
  const applyDiscount = () => {
    if (discountCode.toLowerCase() === "eco20") {
      setDiscountApplied(true)
    } else {
      alert("Código de descuento inválido")
    }
  }

  // Calcular subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  // Calcular descuento
  const discount = discountApplied ? Math.round(subtotal * 0.2) : 0

  // Calcular envío
  const shipping = subtotal > 5000 ? 0 : 499

  // Calcular total
  const total = subtotal - discount + shipping

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Carrito", href: "/carrito", active: true },
        ]}
      />

      <h1 className="text-3xl font-bold mt-6 mb-8">Tu Carrito</h1>

      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">
                            <Link href={`/productos/${item.id}`} className="hover:text-green-700">
                              {item.name}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-500">{item.variant}</p>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-gray-600">
                          <X className="h-5 w-5" />
                          <span className="sr-only">Eliminar</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-600 hover:text-gray-900"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-2 py-1 text-center w-8">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:text-gray-900"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="font-medium">${(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between text-green-700">
                    <span>Descuento (20%)</span>
                    <span>-${discount.toLocaleString()}</span>
                  </div>
                )}

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
                <div className="flex gap-2">
                  <Input
                    placeholder="Código de descuento"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    disabled={discountApplied}
                  />
                  <Button variant="outline" onClick={applyDiscount} disabled={discountApplied || !discountCode}>
                    Aplicar
                  </Button>
                </div>

                <Button className="w-full bg-green-700 hover:bg-green-800">
                  Proceder al pago
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="text-center">
                  <Link href="/productos" className="text-sm text-green-700 hover:underline">
                    Continuar comprando
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-8">Parece que aún no has agregado productos a tu carrito</p>
            <Button asChild className="bg-green-700 hover:bg-green-800">
              <Link href="/productos">Explorar productos</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

