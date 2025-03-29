import { Suspense } from "react"
import type { Metadata } from "next"

import { TablaUsuarios } from "@/components/admin/usuarios/tabla-usuarios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FileDown, Mail } from "lucide-react"
import { obtenerUsuariosAdmin } from "@/acciones/admin/usuarios"

export const metadata: Metadata = {
  title: "Gestión de Usuarios | Admin EcoCosmetics",
  description: "Administración de usuarios, cuentas y permisos",
}

export default function PaginaUsuariosAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra usuarios, cuentas y permisos</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Enviar Newsletter
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
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-6 w-20" />}>
              <TotalUsuarios />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Nuevos (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-6 w-20" />}>
              <UsuariosNuevos />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-6 w-20" />}>
              <UsuariosActivos />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Pausados</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-6 w-20" />}>
              <UsuariosPausados />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="todos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="activos">Activos</TabsTrigger>
          <TabsTrigger value="pausados">Pausados</TabsTrigger>
          <TabsTrigger value="administradores">Administradores</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <ListaUsuarios filtro="todos" />
          </Suspense>
        </TabsContent>

        <TabsContent value="activos">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <ListaUsuarios filtro="activos" />
          </Suspense>
        </TabsContent>

        <TabsContent value="pausados">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <ListaUsuarios filtro="pausados" />
          </Suspense>
        </TabsContent>

        <TabsContent value="administradores">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <ListaUsuarios filtro="administradores" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Componente para mostrar el total de usuarios
async function TotalUsuarios() {
  const resumen = await obtenerUsuariosAdmin("resumen")

  return <div className="text-2xl font-bold">{resumen.total}</div>
}

// Componente para mostrar los usuarios nuevos
async function UsuariosNuevos() {
  const resumen = await obtenerUsuariosAdmin("resumen")

  return <div className="text-2xl font-bold">{resumen.nuevos}</div>
}

// Componente para mostrar los usuarios activos
async function UsuariosActivos() {
  const resumen = await obtenerUsuariosAdmin("resumen")

  return <div className="text-2xl font-bold">{resumen.activos}</div>
}

// Componente para mostrar los usuarios pausados
async function UsuariosPausados() {
  const resumen = await obtenerUsuariosAdmin("resumen")

  return <div className="text-2xl font-bold">{resumen.pausados}</div>
}

// Componente para mostrar la lista de usuarios según el filtro
async function ListaUsuarios({ filtro }: { filtro: string }) {
  const usuarios = await obtenerUsuariosAdmin(filtro)

  return <TablaUsuarios usuarios={usuarios} />
}

