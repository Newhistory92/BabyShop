"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Search, User, LogOut, Settings, HelpCircle, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { signOut } from "next-auth/react"

interface PropiedadesBarraSuperior {
  usuario: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function BarraSuperiorAdmin({ usuario }: PropiedadesBarraSuperior) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [busqueda, setBusqueda] = useState("")

  // Manejar búsqueda
  const manejarBusqueda = (e: React.FormEvent) => {
    e.preventDefault()
    if (busqueda.trim()) {
      router.push(`/admin/buscar?q=${encodeURIComponent(busqueda)}`)
    }
  }

  // Manejar cierre de sesión
  const manejarCierreSesion = async () => {
    await signOut({ redirect: true, callbackUrl: "/" })
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-white dark:bg-[#2A2E2A] border-b border-[#E1DBFF] dark:border-[#3A3E3A] px-4 md:px-6">
      {/* Búsqueda */}
      <form onSubmit={manejarBusqueda} className="hidden md:flex-1 md:flex max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#7F6CFF]" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full pl-8 border-[#E1DBFF] dark:border-[#3A3E3A] focus:border-[#7F6CFF] focus:ring-[#7F6CFF]"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </form>

      <div className="flex items-center gap-2 ml-auto">
        {/* Botón de tema */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-[#7F6CFF] hover:bg-[#E1DBFF] hover:text-[#7F6CFF] dark:hover:bg-[#3A3E3A]"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Cambiar tema</span>
        </Button>

        {/* Notificaciones */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-[#7F6CFF] hover:bg-[#E1DBFF] hover:text-[#7F6CFF] dark:hover:bg-[#3A3E3A]"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#A1F044]" />
              <span className="sr-only">Notificaciones</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 bg-white dark:bg-[#2A2E2A] border-[#E1DBFF] dark:border-[#3A3E3A]"
          >
            <DropdownMenuLabel className="text-[#7F6CFF]">Notificaciones</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E1DBFF] dark:bg-[#3A3E3A]" />
            <div className="max-h-96 overflow-y-auto">
              <div className="flex flex-col gap-2 p-2">
                <div className="flex items-start gap-4 rounded-lg p-2 hover:bg-[#E1DBFF] dark:hover:bg-[#3A3E3A]">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nuevo pedido recibido</p>
                    <p className="text-xs text-[#7F6CFF]">Pedido #12345 - hace 5 minutos</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg p-2 hover:bg-[#E1DBFF] dark:hover:bg-[#3A3E3A]">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Stock bajo en Pijama Osito</p>
                    <p className="text-xs text-[#7F6CFF]">Quedan 3 unidades - hace 1 hora</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg p-2 hover:bg-[#E1DBFF] dark:hover:bg-[#3A3E3A]">
                  <div className="flex-1">
                    <p className="text-sm font-medium">5 nuevos usuarios registrados</p>
                    <p className="text-xs text-[#7F6CFF]">En las últimas 24 horas</p>
                  </div>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-[#E1DBFF] dark:bg-[#3A3E3A]" />
            <DropdownMenuItem asChild className="focus:bg-[#E1DBFF] dark:focus:bg-[#3A3E3A] focus:text-[#7F6CFF]">
              <Link href="/admin/notificaciones" className="w-full cursor-pointer justify-center text-[#7F6CFF]">
                Ver todas
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Ayuda */}
        <Button
          variant="ghost"
          size="icon"
          className="text-[#7F6CFF] hover:bg-[#E1DBFF] hover:text-[#7F6CFF] dark:hover:bg-[#3A3E3A]"
        >
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Ayuda</span>
        </Button>

        {/* Perfil de usuario */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              {usuario.image ? (
                <img
                  src={usuario.image || "/placeholder.svg"}
                  alt={usuario.name || "Avatar"}
                  className="h-8 w-8 rounded-full object-cover border-2 border-[#A1F044]"
                />
              ) : (
                <User className="h-5 w-5 text-[#7F6CFF]" />
              )}
              <span className="sr-only">Perfil</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white dark:bg-[#2A2E2A] border-[#E1DBFF] dark:border-[#3A3E3A]"
          >
            <DropdownMenuLabel className="text-[#7F6CFF]">Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E1DBFF] dark:bg-[#3A3E3A]" />
            <DropdownMenuItem className="focus:bg-[#E1DBFF] dark:focus:bg-[#3A3E3A] focus:text-[#7F6CFF]">
              <User className="mr-2 h-4 w-4 text-[#7F6CFF]" />
              <span>{usuario.name || "Usuario"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="focus:bg-[#E1DBFF] dark:focus:bg-[#3A3E3A] focus:text-[#7F6CFF]">
              <Link href="/admin/configuracion">
                <Settings className="mr-2 h-4 w-4 text-[#7F6CFF]" />
                <span>Configuración</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#E1DBFF] dark:bg-[#3A3E3A]" />
            <DropdownMenuItem
              onClick={manejarCierreSesion}
              className="focus:bg-[#E1DBFF] dark:focus:bg-[#3A3E3A] focus:text-[#7F6CFF]"
            >
              <LogOut className="mr-2 h-4 w-4 text-[#7F6CFF]" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

