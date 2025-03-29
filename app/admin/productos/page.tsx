import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"

import { TablaProductos } from "@/components/admin/productos/tabla-productos"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, FileDown, FileUp } from "lucide-react"
import { obtenerProductosAdmin } from "@/acciones/admin/productos"

export const metadata: Metadata = {
  title: "Gestión de Productos | Admin EcoCosmetics",
  description: "Administración de productos, stock, precios y promociones",
}

export default function PaginaProductosAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Productos</h1>
          <p className="text-muted-foreground">Administra productos, stock, precios y promociones</p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/admin/productos/nuevo" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Producto
            </Link>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            Importar
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-6 w-20" />}>
              <TotalProductos />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-6 w-20" />}>
              <ValorInventario />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Productos Sin Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-6 w-20" />}>
              <ProductosSinStock />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Productos en Oferta</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-6 w-20" />}>
              <ProductosEnOferta />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="todos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="activos">Activos</TabsTrigger>
          <TabsTrigger value="sin-stock">Sin Stock</TabsTrigger>
          <TabsTrigger value="ofertas">En Oferta</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <ListaProductos filtro="todos" />
          </Suspense>
        </TabsContent>

        <TabsContent value="activos">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <ListaProductos filtro="activos" />
          </Suspense>
        </TabsContent>

        <TabsContent value="sin-stock">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <ListaProductos filtro="sin-stock" />
          </Suspense>
        </TabsContent>

        <TabsContent value="ofertas">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <ListaProductos filtro="ofertas" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Componente para mostrar el total de productos
async function TotalProductos() {
  const resumen = await obtenerProductosAdmin("resumen")

  return <div className="text-2xl font-bold">{resumen.total}</div>
}

// Componente para mostrar el valor del inventario
async function ValorInventario() {
  const resumen = await obtenerProductosAdmin("resumen")

  return <div className="text-2xl font-bold">${resumen.valorInventario.toLocaleString()}</div>
}

// Componente para mostrar los productos sin stock
async function ProductosSinStock() {
  const resumen = await obtenerProductosAdmin("resumen")

  return <div className="text-2xl font-bold">{resumen.sinStock}</div>
}

// Componente para mostrar los productos en oferta
async function ProductosEnOferta() {
  const resumen = await obtenerProductosAdmin("resumen")

  return <div className="text-2xl font-bold">{resumen.enOferta}</div>
}

// Componente para mostrar la lista de productos según el filtro
async function ListaProductos({ filtro }: { filtro: string }) {
  const productos = await obtenerProductosAdmin(filtro)

  return <TablaProductos productos={productos} />
}

