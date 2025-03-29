"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, ArrowUpDown, Eye, Printer, Truck, XCircle, CheckCircle, AlertCircle } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DetallePedido } from "@/components/admin/pedidos/detalle-pedido"
import { EtiquetaEnvio } from "@/components/admin/pedidos/etiqueta-envio"
import { actualizarEstadoPedido } from "@/acciones/admin/pedidos"
import { formatearPrecio, obtenerFechaFormateada } from "@/lib/utils"
import type { Pedido } from "@/types"

interface PropiedadesTablaPedidos {
  pedidos: Pedido[]
}

export function TablaPedidos({ pedidos }: PropiedadesTablaPedidos) {
  const router = useRouter()
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null)
  const [mostrarDetalle, setMostrarDetalle] = useState(false)
  const [mostrarEtiqueta, setMostrarEtiqueta] = useState(false)
  const [ordenarPor, setOrdenarPor] = useState<string>('fecha')
  const [ordenAscendente, setOrdenAscendente] = useState<boolean>(false)
  
  // Función para ordenar pedidos
  const ordenarPedidos = (a: Pedido, b: Pedido) => {
    if (ordenarPor === 'fecha') {
      return ordenAscendente
        ? new Date(a.creado).getTime() - new Date(b.creado).getTime()
        : new Date(b.creado).getTime() - new Date(a.creado).getTime()
    } else if (ordenarPor === 'total') {
      return ordenAscendente
        ? a.total - b.total
        : b.total - a.total
    } else if (ordenarPor === 'estado') {
      return ordenAscendente
        ? a.estado.localeCompare(b.estado)
        : b.estado.localeCompare(a.estado)
    }
    return 0
  }
  
  // Función para cambiar el orden
  const cambiarOrden = (campo: string) => {
    if (ordenarPor === campo) {
      setOrdenAscendente(!ordenAscendente)
    } else {
      setOrdenarPor(campo)
      setOrdenAscendente(true)
    }
  }
  
  // Función para ver detalle del pedido
  const verDetalle = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido)
    setMostrarDetalle(true)
  }
  
  // Función para ver etiqueta de envío
  const verEtiqueta = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido)
    setMostrarEtiqueta(true)
  }
  
  // Función para imprimir etiqueta
  const imprimirEtiqueta = () => {
    window.print()
  }
  
  // Función para actualizar estado del pedido
  const actualizarEstado = async (pedidoId: string, nuevoEstado: string) => {
    await actualizarEstadoPedido(pedidoId, nuevoEstado)
    router.refresh()
  }
  
  // Obtener color de badge según estado
  const obtenerColorBadge = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'PROCESANDO':
        return 'bg-yellow-500 hover:bg-yellow-600'
      case 'ENVIADO':
        return 'bg-purple-500 hover:bg-purple-600'
      case 'ENTREGADO':
        return 'bg-green-500 hover:bg-green-600'
      case 'CANCELADO':
        return 'bg-red-500 hover:bg-red-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }
  
  // Obtener icono según estado
  const obtenerIconoEstado = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return <AlertCircle className="h-4 w-4" />
      case 'PROCESANDO':
        return <Truck className="h-4 w-4" />
      case 'ENVIADO':
        return <Truck className="h-4 w-4" />
      case 'ENTREGADO':
        return <CheckCircle className="h-4 w-4" />
      case 'CANCELADO':
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => cambiarOrden('fecha')}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Fecha
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => cambiarOrden('total')}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Total
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => cambiarOrden('estado')}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Estado
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No hay pedidos para mostrar
                </TableCell>
              </TableRow>
            ) : (
              [...pedidos].sort(ordenarPedidos).map((pedido) => (
                <TableRow key={pedido.id}>
                  => (
                <TableRow key={pedido.id}>
                  <TableCell className="font-medium">{pedido.id.slice(0, 8)}</TableCell>
                  <TableCell>{pedido.usuario?.nombre || 'Cliente'}</TableCell>
                  <TableCell>{obtenerFechaFormateada(pedido.creado)}</TableCell>
                  <TableCell>{formatearPrecio(pedido.total)}</TableCell>
                  <TableCell>
                    <Badge className={obtenerColorBadge(pedido.estado)}>
                      <span className="flex items-center gap-1">
                        {obtenerIconoEstado(pedido.estado)}
                        {pedido.estado}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => verDetalle(pedido)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => verEtiqueta(pedido)}>
                          <Printer className="mr-2 h-4 w-4" />
                          Imprimir etiqueta
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                        <DropdownMenuItem 
                          onClick={() => actualizarEstado(pedido.id, 'PROCESANDO')}
                          disabled={pedido.estado === 'PROCESANDO' || pedido.estado === 'ENVIADO' || pedido.estado === 'ENTREGADO' || pedido.estado === 'CANCELADO'}
                        >
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-yellow-500" />
                            Procesando
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => actualizarEstado(pedido.id, 'ENVIADO')}
                          disabled={pedido.estado === 'ENVIADO' || pedido.estado === 'ENTREGADO' || pedido.estado === 'CANCELADO'}
                        >
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-purple-500" />
                            Enviado
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => actualizarEstado(pedido.id, 'ENTREGADO')}
                          disabled={pedido.estado === 'ENTREGADO' || pedido.estado === 'CANCELADO'}
                        >
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            Entregado
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => actualizarEstado(pedido.id, 'CANCELADO')}
                          disabled={pedido.estado === 'ENTREGADO' || pedido.estado === 'CANCELADO'}
                        >
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            Cancelado
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Modal de detalle de pedido */}
      <Dialog open={mostrarDetalle} onOpenChange={setMostrarDetalle}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalle del Pedido #{pedidoSeleccionado?.id.slice(0, 8)}</DialogTitle>
            <DialogDescription>
              Información completa del pedido y sus productos
            </DialogDescription>
          </DialogHeader>
          {pedidoSeleccionado && <DetallePedido pedido={pedidoSeleccionado} />}
        </DialogContent>
      </Dialog>
      
      {/* Modal de etiqueta de envío */}
      <Dialog open={mostrarEtiqueta} onOpenChange={setMostrarEtiqueta}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Etiqueta de Envío</DialogTitle>
            <DialogDescription>
              Etiqueta para el envío del pedido #{pedidoSeleccionado?.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>
          {pedidoSeleccionado && (
            <div>
              <EtiquetaEnvio pedido={pedidoSeleccionado} />
              <div className="mt-4 flex justify-end">
                <Button onClick={imprimirEtiqueta} className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Imprimir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

