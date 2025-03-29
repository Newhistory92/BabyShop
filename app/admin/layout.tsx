import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth/opcionesAutenticacion"
import { BarraLateralAdmin } from "@/components/admin/barra-lateral-admin"
import { BarraSuperiorAdmin } from "@/components/admin/barra-superior-admin"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Verificar autenticación y permisos de administrador
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.user.esAdmin) {
    redirect("/auth/iniciar-sesion?redirect=/admin")
  }

  return (
    <div className="min-h-screen bg-[#E1DBFF] dark:bg-[#2A2E2A]/95">
      <div className="flex h-screen overflow-hidden">
        {/* Barra lateral */}
        <BarraLateralAdmin />

        {/* Contenido principal */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <BarraSuperiorAdmin usuario={session.user} />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

