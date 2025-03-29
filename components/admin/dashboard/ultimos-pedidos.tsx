"use client"

import Link from "next/link"
import { CheckCircle, Clock, Package, Truck, XCircle, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatearPrecio, obtenerFechaFormateada } from "@/lib/utils"

interface PedidoReciente {
  id: string
  cliente: string
  fecha: string
  total: number
  estado: string
}

interface PropiedadesUltimosPedidos {
  pedidos: PedidoReciente[]
}

export function UltimosPedidos({ pedidos = [] }: PropiedadesUltimosPedidos) {
  // Si no hay pedidos recientes
  if (pedidos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <div className="bg-blue-50 rounded-full p-3 mb-4">
          <Package className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium mb-1">No hay pedidos recientes</h3>
        <p className="text-sm text-muted-foreground mb-4">Los pedidos nuevos aparecerán aquí</p>
      </div>
    )
  }

  // Obtener icono según estado
  const obtenerIconoEstado = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return <Clock className="h-4 w-4" />
      case "PROCESANDO":
        return <Package className="h-4 w-4" />
      case "ENVIADO":
        return <Truck className="h-4 w-4" />
      case "ENTREGADO":
        return <CheckCircle className="h-4 w-4" />
      case "CANCELADO":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Obtener color de badge según estado
  const obtenerColorBadge = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return "bg-blue-500 hover:bg-blue-600"
      case "PROCESANDO":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "ENVIADO":
        return "bg-purple-500 hover:bg-purple-600"
      case "ENTREGADO":
        return "bg-green-500 hover:bg-green-600"
      case "CANCELADO":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="space-y-4">
      {pedidos.map((pedido) => (
        <div key={pedido.id} className="flex items-start gap-3 p-3 rounded-lg border">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <Link href={`/admin/pedidos?id=${pedido.id}`} className="font-medium hover:underline">
                Pedido #{pedido.id.slice(0, 8)}
              </Link>
              <Badge className={obtenerColorBadge(pedido.estado)}>
                <span className="flex items-center gap-1">
                  {obtenerIconoEstado(pedido.estado)}
                  {pedido.estado}
                </span>
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span>{pedido.cliente}</span>
              <span className="mx-1">•</span>
              <span>{obtenerFechaFormateada(pedido.fecha)}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="font-medium">{formatearPrecio(pedido.total)}</span>
              <Button variant="ghost" size="sm" asChild className="h-8 gap-1">
                <Link href={`/admin/pedidos?id=${pedido.id}`}>
                  Ver detalles
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="pt-2">
        <Button asChild variant="outline" className="w-full">
          <Link href="/admin/pedidos">Ver todos los pedidos</Link>
        </Button>
      </div>
    </div>
  )
}

