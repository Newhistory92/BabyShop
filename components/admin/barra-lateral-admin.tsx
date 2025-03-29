"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tag,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart,
  Truck,
  Palette,
  MessageSquare,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ElementoMenu {
  titulo: string
  href: string
  icono: React.ReactNode
  submenu?: ElementoMenu[]
}

export function BarraLateralAdmin() {
  const pathname = usePathname()
  const [contraida, setContraida] = useState(false)
  const [submenuAbierto, setSubmenuAbierto] = useState<string | null>(null)

  // Elementos del menú
  const elementosMenu: ElementoMenu[] = [
    {
      titulo: "Dashboard",
      href: "/admin",
      icono: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      titulo: "Pedidos",
      href: "/admin/pedidos",
      icono: <ShoppingCart className="h-5 w-5" />,
      submenu: [
        {
          titulo: "Todos los Pedidos",
          href: "/admin/pedidos",
          icono: <ShoppingCart className="h-4 w-4" />,
        },
        {
          titulo: "Envíos",
          href: "/admin/pedidos/envios",
          icono: <Truck className="h-4 w-4" />,
        },
        {
          titulo: "Devoluciones",
          href: "/admin/pedidos/devoluciones",
          icono: <ChevronRight className="h-4 w-4" />,
        },
      ],
    },
    {
      titulo: "Productos",
      href: "/admin/productos",
      icono: <Package className="h-5 w-5" />,
      submenu: [
        {
          titulo: "Todos los Productos",
          href: "/admin/productos",
          icono: <Package className="h-4 w-4" />,
        },
        {
          titulo: "Categorías",
          href: "/admin/productos/categorias",
          icono: <Palette className="h-4 w-4" />,
        },
        {
          titulo: "Inventario",
          href: "/admin/productos/inventario",
          icono: <ChevronRight className="h-4 w-4" />,
        },
      ],
    },
    {
      titulo: "Promociones",
      href: "/admin/promociones",
      icono: <Tag className="h-5 w-5" />,
    },
    {
      titulo: "Usuarios",
      href: "/admin/usuarios",
      icono: <Users className="h-5 w-5" />,
    },
    {
      titulo: "Estadísticas",
      href: "/admin/estadisticas",
      icono: <BarChart className="h-5 w-5" />,
    },
    {
      titulo: "Mensajes",
      href: "/admin/mensajes",
      icono: <MessageSquare className="h-5 w-5" />,
    },
    {
      titulo: "Configuración",
      href: "/admin/configuracion",
      icono: <Settings className="h-5 w-5" />,
    },
  ]

  // Alternar el estado de la barra lateral
  const alternarBarra = () => {
    setContraida(!contraida)
    if (!contraida) {
      setSubmenuAbierto(null)
    }
  }

  // Alternar el estado del submenú
  const alternarSubmenu = (titulo: string) => {
    setSubmenuAbierto(submenuAbierto === titulo ? null : titulo)
  }

  // Verificar si un elemento está activo
  const esActivo = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-[#2A2E2A] border-r border-[#3A3E3A] transition-all duration-300",
        contraida ? "w-[70px]" : "w-[250px]",
      )}
    >
      {/* Logo y botón de contraer */}
      <div className="flex h-16 items-center justify-between px-4 py-4">
        {!contraida && (
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-bold text-xl text-[#A1F044]">BabyAdmin</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={alternarBarra}
          className={cn("ml-auto text-[#A1F044] hover:bg-[#3A3E3A] hover:text-[#A1F044]", contraida && "mx-auto")}
        >
          {contraida ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Menú principal */}
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 px-2 py-2">
          {elementosMenu.map((elemento) => (
            <div key={elemento.titulo}>
              {elemento.submenu ? (
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center justify-between px-3 py-2 text-[#E1DBFF] hover:bg-[#3A3E3A] hover:text-[#A1F044]",
                      esActivo(elemento.href) && "bg-[#3A3E3A] text-[#A1F044]",
                      contraida && "px-2 py-2 justify-center",
                    )}
                    onClick={() => !contraida && alternarSubmenu(elemento.titulo)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#A1F044]">{elemento.icono}</span>
                      {!contraida && <span>{elemento.titulo}</span>}
                    </div>
                    {!contraida && elemento.submenu && (
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform text-[#A1F044]",
                          submenuAbierto === elemento.titulo && "rotate-90",
                        )}
                      />
                    )}
                  </Button>

                  {/* Submenú */}
                  {!contraida && submenuAbierto === elemento.titulo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-6 mt-1 flex flex-col gap-1"
                    >
                      {elemento.submenu.map((subElemento) => (
                        <Button
                          key={subElemento.titulo}
                          variant="ghost"
                          asChild
                          className={cn(
                            "justify-start px-3 py-1.5 text-sm text-[#E1DBFF] hover:bg-[#3A3E3A] hover:text-[#A1F044]",
                            esActivo(subElemento.href) && "bg-[#3A3E3A] text-[#A1F044]",
                          )}
                        >
                          <Link href={subElemento.href} className="flex items-center gap-3">
                            <span className="text-[#7F6CFF]">{subElemento.icono}</span>
                            <span>{subElemento.titulo}</span>
                          </Link>
                        </Button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    "flex items-center justify-start px-3 py-2 text-[#E1DBFF] hover:bg-[#3A3E3A] hover:text-[#A1F044]",
                    esActivo(elemento.href) && "bg-[#3A3E3A] text-[#A1F044]",
                    contraida && "px-2 py-2 justify-center",
                  )}
                >
                  <Link href={elemento.href} className="flex items-center gap-3">
                    <span className="text-[#A1F044]">{elemento.icono}</span>
                    {!contraida && <span>{elemento.titulo}</span>}
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}

