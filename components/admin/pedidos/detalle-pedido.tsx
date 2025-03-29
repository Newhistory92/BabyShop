"use client"

import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatearPrecio, obtenerFechaFormateada } from "@/lib/utils"
import type { Pedido } from "@/types"

interface PropiedadesDetallePedido {
  pedido: Pedido
}

export function DetallePedido({ pedido }: PropiedadesDetallePedido) {
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
    <Tabs defaultValue="productos" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="productos">Productos</TabsTrigger>
        <TabsTrigger value="cliente">Cliente</TabsTrigger>
        <TabsTrigger value="envio">Envío</TabsTrigger>
      </TabsList>

      <TabsContent value="productos" className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Productos del Pedido</h3>
            <p className="text-sm text-muted-foreground">
              {pedido.elementosPedido.length} {pedido.elementosPedido.length === 1 ? "producto" : "productos"}
            </p>
          </div>
          <Badge className={obtenerColorBadge(pedido.estado)}>{pedido.estado}</Badge>
        </div>

        <Separator />

        <div className="space-y-4">
          {pedido.elementosPedido.map((elemento) => (
            <div key={elemento.id} className="flex items-center gap-4">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                <Image
                  src={elemento.producto?.imagenes[0] || "/placeholder.svg"}
                  alt={elemento.producto?.nombre || "Producto"}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium">{elemento.producto?.nombre}</h4>
                {elemento.varianteProducto && (
                  <p className="text-xs text-muted-foreground">{elemento.varianteProducto.nombre}</p>
                )}
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <span>{formatearPrecio(elemento.precio)}</span>
                  <span className="text-muted-foreground">x {elemento.cantidad}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatearPrecio(elemento.precio * elemento.cantidad)}</p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatearPrecio(pedido.total - pedido.costoEnvio + pedido.descuento)}</span>
          </div>
          {pedido.descuento > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Descuento</span>
              <span className="text-green-600">-{formatearPrecio(pedido.descuento)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Envío</span>
            <span>{formatearPrecio(pedido.costoEnvio)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatearPrecio(pedido.total)}</span>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="cliente" className="space-y-4 pt-4">
        <h3 className="text-lg font-medium">Información del Cliente</h3>
        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium">Datos personales</h4>
            <div className="mt-2 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Nombre:</span> {pedido.usuario?.nombre || "No disponible"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {pedido.usuario?.email || "No disponible"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Teléfono:</span> {pedido.direccion?.telefono || "No disponible"}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium">Historial de compras</h4>
            <div className="mt-2">
              <p className="text-sm">
                <span className="font-medium">Cliente desde:</span>{" "}
                {pedido.usuario?.creado ? obtenerFechaFormateada(pedido.usuario.creado) : "No disponible"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Pedidos totales:</span> 3
              </p>
              <p className="text-sm">
                <span className="font-medium">Valor total:</span> $15,750
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-medium">Notas</h4>
          <p className="mt-2 text-sm text-muted-foreground">No hay notas para este cliente.</p>
        </div>
      </TabsContent>

      <TabsContent value="envio" className="space-y-4 pt-4">
        <h3 className="text-lg font-medium">Información de Envío</h3>
        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium">Dirección de envío</h4>
            <div className="mt-2 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Destinatario:</span> {pedido.direccion?.nombre || "No disponible"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Dirección:</span>{" "}
                {pedido.direccion ? (
                  <>
                    {pedido.direccion.calle} {pedido.direccion.numero}
                    {pedido.direccion.departamento ? `, ${pedido.direccion.departamento}` : ""}
                  </>
                ) : (
                  "No disponible"
                )}
              </p>
              <p className="text-sm">
                <span className="font-medium">Ciudad:</span> {pedido.direccion?.ciudad || "No disponible"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Provincia:</span> {pedido.direccion?.provincia || "No disponible"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Código Postal:</span> {pedido.direccion?.codigoPostal || "No disponible"}
              </p>
              <p className="text-sm">
                <span className="font-medium">País:</span> {pedido.direccion?.pais || "No disponible"}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium">Detalles del envío</h4>
            <div className="mt-2 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Método:</span> Estándar
              </p>
              <p className="text-sm">
                <span className="font-medium">Costo:</span> {formatearPrecio(pedido.costoEnvio)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Número de seguimiento:</span> {pedido.idPago || "No disponible"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Estado:</span>{" "}
                <Badge className={obtenerColorBadge(pedido.estado)}>{pedido.estado}</Badge>
              </p>
              <p className="text-sm">
                <span className="font-medium">Fecha estimada de entrega:</span>{" "}
                {pedido.estado === "ENVIADO"
                  ? obtenerFechaFormateada(new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000))
                  : "No disponible"}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-medium">Historial de seguimiento</h4>
          <div className="mt-2 space-y-4">
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-medium">Pedido recibido</p>
                <p className="text-xs text-muted-foreground">{obtenerFechaFormateada(pedido.creado)}</p>
              </div>
            </div>

            {pedido.estado !== "PENDIENTE" && (
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 mt-1.5 rounded-full bg-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Pedido en procesamiento</p>
                  <p className="text-xs text-muted-foreground">
                    {obtenerFechaFormateada(new Date(new Date(pedido.creado).getTime() + 1 * 24 * 60 * 60 * 1000))}
                  </p>
                </div>
              </div>
            )}

            {(pedido.estado === "ENVIADO" || pedido.estado === "ENTREGADO") && (
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 mt-1.5 rounded-full bg-purple-500" />
                <div>
                  <p className="text-sm font-medium">Pedido enviado</p>
                  <p className="text-xs text-muted-foreground">
                    {obtenerFechaFormateada(new Date(new Date(pedido.creado).getTime() + 2 * 24 * 60 * 60 * 1000))}
                  </p>
                </div>
              </div>
            )}

            {pedido.estado === "ENTREGADO" && (
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 mt-1.5 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium">Pedido entregado</p>
                  <p className="text-xs text-muted-foreground">
                    {obtenerFechaFormateada(new Date(new Date(pedido.creado).getTime() + 5 * 24 * 60 * 60 * 1000))}
                  </p>
                </div>
              </div>
            )}

            {pedido.estado === "CANCELADO" && (
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 mt-1.5 rounded-full bg-red-500" />
                <div>
                  <p className="text-sm font-medium">Pedido cancelado</p>
                  <p className="text-xs text-muted-foreground">{obtenerFechaFormateada(pedido.actualizado)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

