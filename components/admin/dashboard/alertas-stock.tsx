"use client"

import Link from "next/link"
import Image from "next/image"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProductoAlerta {
  id: string
  nombre: string
  imagen: string
  stock: number
  categoria: string
}

interface PropiedadesAlertasStock {
  productos: ProductoAlerta[]
}

export function AlertasStock({ productos = [] }: PropiedadesAlertasStock) {
  // Si no hay productos con alerta de stock
  if (productos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <div className="bg-green-50 rounded-full p-3 mb-4">
          <AlertCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium mb-1">¡Todo en orden!</h3>
        <p className="text-sm text-muted-foreground mb-4">No hay productos con stock bajo o agotado</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {productos.map((producto) => (
        <div key={producto.id} className="flex items-start gap-3 p-3 rounded-lg border">
          <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={producto.imagen || "/placeholder.svg"}
              alt={producto.nombre}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <Link href={`/admin/productos/${producto.id}`} className="font-medium hover:underline truncate">
                {producto.nombre}
              </Link>
              <Badge
                variant="outline"
                className={`ml-2 ${
                  producto.stock === 0
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                }`}
              >
                {producto.stock === 0 ? "Agotado" : "Bajo"}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span>{producto.categoria}</span>
              <span className="mx-1">•</span>
              <span className={producto.stock === 0 ? "text-red-500 font-medium" : "text-yellow-500 font-medium"}>
                Stock: {producto.stock}
              </span>
            </div>
          </div>
        </div>
      ))}

      <div className="pt-2">
        <Button asChild variant="outline" className="w-full">
          <Link href="/admin/productos?filtro=sin-stock">Ver todos los productos con alerta</Link>
        </Button>
      </div>
    </div>
  )
}

