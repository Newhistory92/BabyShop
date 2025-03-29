import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"

import { TablaPromociones } from "@/components/admin/promociones/tabla-promociones"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Calendar } from "lucide-react"
import { obtenerPromocionesAdmin } from "@/acciones/admin/promociones"

export const metadata: Metadata = {
  title: "Gestión de Promociones | Admin EcoCosmetics",
  description: "Administración de promociones, descuentos y ofertas especiales",
}

export default function PaginaPromocionesAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Promociones</h1>
          <p className="text-muted-foreground">Administra promociones, descuentos y ofertas especiales</p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/admin/promociones/nueva" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Promoción
            </Link>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Programar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Promociones Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-6 w-20" />}>
              <PromocionesActivas />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Promociones Programadas</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-6 w-20" />}>
              <PromocionesProgramadas />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Descuento Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-6 w-20" />}>
              <DescuentoPromedio />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Promociones</CardTitle>
          <CardDescription>Gestiona todas las promociones y ofertas especiales</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <ListaPromociones />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para mostrar las promociones activas
async function PromocionesActivas() {
  const resumen = await obtenerPromocionesAdmin("resumen")

  return <div className="text-2xl font-bold">{resumen.activas}</div>
}

// Componente para mostrar las promociones programadas
async function PromocionesProgramadas() {
  const resumen = await obtenerPromocionesAdmin("resumen")

  return <div className="text-2xl font-bold">{resumen.programadas}</div>
}

// Componente para mostrar el descuento promedio
async function DescuentoPromedio() {
  const resumen = await obtenerPromocionesAdmin("resumen")

  return <div className="text-2xl font-bold">{resumen.descuentoPromedio}%</div>
}

// Componente para mostrar la lista de promociones
async function ListaPromociones() {
  const promociones = await obtenerPromocionesAdmin("todas")

  return <TablaPromociones promociones={promociones} />
}

