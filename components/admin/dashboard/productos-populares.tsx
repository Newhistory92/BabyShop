"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { formatearPrecio } from "@/lib/utils"

interface ProductoPopular {
  id: string
  nombre: string
  imagen: string
  precio: number
  cantidadVendida: number
  ingresos: number
}

interface PropiedadesProductosPopulares {
  productos: ProductoPopular[]
}

export function ProductosPopulares({ productos }: PropiedadesProductosPopulares) {
  return (
    <div className="space-y-6">
      {productos.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">No hay datos disponibles</p>
      ) : (
        productos.map((producto, index) => (
          <div key={producto.id} className="flex items-center gap-4">
            <div className="flex-shrink-0 font-medium text-muted-foreground w-6 text-center">#{index + 1}</div>
            <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={producto.imagen || "/placeholder.svg"}
                alt={producto.nombre}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/admin/productos/${producto.id}`} className="font-medium hover:underline truncate block">
                {producto.nombre}
              </Link>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{formatearPrecio(producto.precio)}</span>
                <span className="mx-1">•</span>
                <span>{producto.cantidadVendida} vendidos</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatearPrecio(producto.ingresos)}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {Math.round((producto.ingresos / productos.reduce((acc, p) => acc + p.ingresos, 0)) * 100)}%
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

