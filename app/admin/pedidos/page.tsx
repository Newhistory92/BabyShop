import { Suspense } from "react"
import type { Metadata } from "next"

import { TablaPedidos } from "@/components/admin/pedidos/tabla-pedidos"
import { EscanerCodigoBarras } from "@/components/admin/pedidos/escaner-codigo-barras"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Printer, BarChart } from "lucide-react"
import { obtenerPedidosAdmin } from "@/acciones/admin/pedidos"

export const metadata: Metadata = {
  title: "Gestión de Pedidos | Admin EcoCosmetics",
  description: "Administración de pedidos, impresión de etiquetas y seguimiento de envíos",
}

export default function PaginaPedidosAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">Administra pedidos, imprime etiquetas y realiza seguimiento de envíos</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Imprimir Pendientes
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Exportar Datos
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Escanear Código de Barras</CardTitle>
            <CardDescription>Escanea el código de barras de un pedido para actualizarlo</CardDescription>
          </CardHeader>
          <CardContent>
            <EscanerCodigoBarras />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen de Pedidos</CardTitle>
            <CardDescription>Estado actual de los pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
              <ResumenPedidos />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pendientes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="procesando">Procesando</TabsTrigger>
          <TabsTrigger value="enviados">Enviados</TabsTrigger>
          <TabsTrigger value="entregados">Entregados</TabsTrigger>
          <TabsTrigger value="cancelados">Cancelados</TabsTrigger>
        </TabsList>

        <TabsContent value="pendientes">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <ListaPedidos estado="PENDIENTE" />
          </Suspense>
        </TabsContent>

        <TabsContent value="procesando">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <ListaPedidos estado="PROCESANDO" />
          </Suspense>
        </TabsContent>

        <TabsContent value="enviados">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <ListaPedidos estado="ENVIADO" />
          </Suspense>
        </TabsContent>

        <TabsContent value="entregados">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <ListaPedidos estado="ENTREGADO" />
          </Suspense>
        </TabsContent>

        <TabsContent value="cancelados">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <ListaPedidos estado="CANCELADO" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Componente para mostrar el resumen de pedidos
async function ResumenPedidos() {
  const resumen = await obtenerPedidosAdmin("resumen")

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-700 font-medium">Pendientes</p>
          <p className="text-2xl font-bold text-blue-800">{resumen.pendientes}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <p className="text-sm text-yellow-700 font-medium">Procesando</p>
          <p className="text-2xl font-bold text-yellow-800">{resumen.procesando}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <p className="text-sm text-purple-700 font-medium">Enviados</p>
          <p className="text-2xl font-bold text-purple-800">{resumen.enviados}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-sm text-green-700 font-medium">Entregados</p>
          <p className="text-2xl font-bold text-green-800">{resumen.entregados}</p>
        </div>
      </div>
      <div className="bg-red-50 rounded-lg p-4 text-center">
        <p className="text-sm text-red-700 font-medium">Cancelados</p>
        <p className="text-2xl font-bold text-red-800">{resumen.cancelados}</p>
      </div>
    </div>
  )
}

// Componente para mostrar la lista de pedidos según el estado
async function ListaPedidos({ estado }: { estado: string }) {
  const pedidos = await obtenerPedidosAdmin(estado)

  return <TablaPedidos pedidos={pedidos} />
}

