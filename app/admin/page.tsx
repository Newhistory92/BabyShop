import { Suspense } from "react"
import type { Metadata } from "next"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResumenVentas } from "@/components/admin/dashboard/resumen-ventas"
import { GraficoVentas } from "@/components/admin/dashboard/grafico-ventas"
import { ProductosPopulares } from "@/components/admin/dashboard/productos-populares"
import { AlertasStock } from "@/components/admin/dashboard/alertas-stock"
import { UltimosPedidos } from "@/components/admin/dashboard/ultimos-pedidos"
import { Skeleton } from "@/components/ui/skeleton"
import { obtenerEstadisticasAdmin } from "@/acciones/admin/estadisticas"

export const metadata: Metadata = {
  title: "Panel de Administración | BabyDream",
  description: "Panel de administración para gestionar productos, pedidos y usuarios de BabyDream",
}

export default async function PaginaAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#2A2E2A] dark:text-white">Dashboard</h1>
          <p className="text-[#7F6CFF]">Bienvenido al panel de administración de BabyDream</p>
        </div>
      </div>

      <Tabs defaultValue="diario" className="space-y-6">
        <TabsList className="bg-[#E1DBFF] dark:bg-[#3A3E3A]">
          <TabsTrigger value="diario" className="data-[state=active]:bg-[#7F6CFF] data-[state=active]:text-white">
            Diario
          </TabsTrigger>
          <TabsTrigger value="semanal" className="data-[state=active]:bg-[#7F6CFF] data-[state=active]:text-white">
            Semanal
          </TabsTrigger>
          <TabsTrigger value="mensual" className="data-[state=active]:bg-[#7F6CFF] data-[state=active]:text-white">
            Mensual
          </TabsTrigger>
          <TabsTrigger value="anual" className="data-[state=active]:bg-[#7F6CFF] data-[state=active]:text-white">
            Anual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diario" className="space-y-6">
          <Suspense fallback={<SkeletonEstadisticas />}>
            <EstadisticasPeriodo periodo="diario" />
          </Suspense>
        </TabsContent>

        <TabsContent value="semanal" className="space-y-6">
          <Suspense fallback={<SkeletonEstadisticas />}>
            <EstadisticasPeriodo periodo="semanal" />
          </Suspense>
        </TabsContent>

        <TabsContent value="mensual" className="space-y-6">
          <Suspense fallback={<SkeletonEstadisticas />}>
            <EstadisticasPeriodo periodo="mensual" />
          </Suspense>
        </TabsContent>

        <TabsContent value="anual" className="space-y-6">
          <Suspense fallback={<SkeletonEstadisticas />}>
            <EstadisticasPeriodo periodo="anual" />
          </Suspense>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-white dark:bg-[#2A2E2A] border-[#E1DBFF] dark:border-[#3A3E3A]">
          <CardHeader>
            <CardTitle className="text-[#7F6CFF]">Últimos Pedidos</CardTitle>
            <CardDescription>Los pedidos más recientes que requieren atención</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[400px] w-full bg-[#E1DBFF] dark:bg-[#3A3E3A]" />}>
              <UltimosPedidos />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-white dark:bg-[#2A2E2A] border-[#E1DBFF] dark:border-[#3A3E3A]">
          <CardHeader>
            <CardTitle className="text-[#7F6CFF]">Alertas de Stock</CardTitle>
            <CardDescription>Productos con stock bajo o agotado</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[400px] w-full bg-[#E1DBFF] dark:bg-[#3A3E3A]" />}>
              <AlertasStock />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Componente para mostrar estadísticas según el período
async function EstadisticasPeriodo({ periodo }: { periodo: "diario" | "semanal" | "mensual" | "anual" }) {
  const estadisticas = await obtenerEstadisticasAdmin(periodo)

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ResumenVentas
          titulo="Total Ventas"
          valor={estadisticas.totalVentas}
          porcentajeCambio={estadisticas.porcentajeCambioVentas}
          icono="dollar-sign"
        />
        <ResumenVentas
          titulo="Pedidos"
          valor={estadisticas.totalPedidos.toString()}
          porcentajeCambio={estadisticas.porcentajeCambioPedidos}
          icono="shopping-cart"
        />
        <ResumenVentas
          titulo="Clientes Nuevos"
          valor={estadisticas.clientesNuevos.toString()}
          porcentajeCambio={estadisticas.porcentajeCambioClientes}
          icono="users"
        />
        <ResumenVentas
          titulo="Ganancia"
          valor={estadisticas.ganancia}
          porcentajeCambio={estadisticas.porcentajeCambioGanancia}
          icono="trending-up"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-white dark:bg-[#2A2E2A] border-[#E1DBFF] dark:border-[#3A3E3A]">
          <CardHeader>
            <CardTitle className="text-[#7F6CFF]">Ventas {obtenerTituloPeriodo(periodo)}</CardTitle>
            <CardDescription>Evolución de ventas en el período</CardDescription>
          </CardHeader>
          <CardContent>
            <GraficoVentas datos={estadisticas.datosGrafico} />
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-white dark:bg-[#2A2E2A] border-[#E1DBFF] dark:border-[#3A3E3A]">
          <CardHeader>
            <CardTitle className="text-[#7F6CFF]">Productos Más Vendidos</CardTitle>
            <CardDescription>Top productos por ventas en el período</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductosPopulares productos={estadisticas.productosMasVendidos} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// Función para obtener el título según el período
function obtenerTituloPeriodo(periodo: string): string {
  switch (periodo) {
    case "diario":
      return "del Día"
    case "semanal":
      return "de la Semana"
    case "mensual":
      return "del Mes"
    case "anual":
      return "del Año"
    default:
      return ""
  }
}

// Skeleton para las estadísticas
function SkeletonEstadisticas() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full bg-[#E1DBFF] dark:bg-[#3A3E3A]" />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="col-span-4 h-[400px] w-full bg-[#E1DBFF] dark:bg-[#3A3E3A]" />
        <Skeleton className="col-span-3 h-[400px] w-full bg-[#E1DBFF] dark:bg-[#3A3E3A]" />
      </div>
    </>
  )
}

