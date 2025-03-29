"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Heart, User, Search, Menu, X, Baby } from "lucide-react"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCarrito } from "@/hooks/useCarrito"
import { useFavoritos } from "@/hooks/useFavoritos"
import { ModeToggle } from "@/components/theme-toggle"

const enlaces = [
  { nombre: "Inicio", ruta: "/" },
  { nombre: "Bebés", ruta: "/bebes" },
  { nombre: "Niños", ruta: "/ninos" },
  { nombre: "Ofertas", ruta: "/ofertas" },
  { nombre: "Colecciones", ruta: "/colecciones" },
]

export function CabeceraSitio() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [busquedaAbierta, setBusquedaAbierta] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const { cantidadItems } = useCarrito()
  const { cantidadFavoritos } = useFavoritos()

  const toggleMenu = () => setMenuAbierto(!menuAbierto)
  const toggleBusqueda = () => setBusquedaAbierta(!busquedaAbierta)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-baby-white/95 backdrop-blur supports-[backdrop-filter]:bg-baby-white/60 dark:bg-baby-dark/95 dark:border-baby-dark/30">
      {/* Banner promocional */}
      <div className="baby-gradient text-baby-dark text-center py-2 text-sm font-medium">
        <p>Envío gratis en compras superiores a $15.000 🧸</p>
      </div>

      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Baby className="h-6 w-6 text-baby-mint" />
            <span className="text-xl font-bold tracking-tight">BabyDream</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {enlaces.map((enlace) => (
              <Link
                key={enlace.ruta}
                href={enlace.ruta}
                className={`text-sm font-medium transition-colors hover:text-baby-mint ${
                  pathname === enlace.ruta ? "text-baby-mint" : "text-muted-foreground"
                }`}
              >
                {enlace.nombre}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex text-baby-dark dark:text-baby-white hover:bg-baby-blue/20"
            onClick={toggleBusqueda}
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </Button>

          <ModeToggle />

          <Link href="/favoritos">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-baby-dark dark:text-baby-white hover:bg-baby-blue/20"
              aria-label="Favoritos"
            >
              <Heart className="h-5 w-5" />
              {cantidadFavoritos > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-baby-pink text-baby-dark">
                  {cantidadFavoritos}
                </Badge>
              )}
            </Button>
          </Link>

          <Link href="/carrito">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-baby-dark dark:text-baby-white hover:bg-baby-blue/20"
              aria-label="Carrito"
            >
              <ShoppingCart className="h-5 w-5" />
              {cantidadItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-baby-pink text-baby-dark">
                  {cantidadItems}
                </Badge>
              )}
            </Button>
          </Link>

          <Link href={session ? "/perfil" : "/auth/iniciar-sesion"}>
            <Button
              variant="ghost"
              size="icon"
              className="text-baby-dark dark:text-baby-white hover:bg-baby-blue/20"
              aria-label="Cuenta"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-baby-dark dark:text-baby-white hover:bg-baby-blue/20"
            onClick={toggleMenu}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          >
            {menuAbierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="md:hidden border-t p-4 bg-baby-white dark:bg-baby-dark">
          <nav className="flex flex-col space-y-4">
            {enlaces.map((enlace) => (
              <Link
                key={enlace.ruta}
                href={enlace.ruta}
                className={`text-sm font-medium transition-colors hover:text-baby-mint ${
                  pathname === enlace.ruta ? "text-baby-mint" : "text-muted-foreground"
                }`}
                onClick={() => setMenuAbierto(false)}
              >
                {enlace.nombre}
              </Link>
            ))}
            <div className="pt-2">
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="w-full rounded-full border-baby-blue focus:border-baby-mint"
              />
            </div>
          </nav>
        </div>
      )}

      {/* Barra de búsqueda */}
      {busquedaAbierta && (
        <div className="hidden md:block border-t p-4 bg-baby-white dark:bg-baby-dark">
          <div className="container flex items-center">
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="w-full rounded-full border-baby-blue focus:border-baby-mint"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleBusqueda}
              className="ml-2 text-baby-dark dark:text-baby-white hover:bg-baby-blue/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

