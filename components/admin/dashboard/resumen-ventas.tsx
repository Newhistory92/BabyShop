"use client"

import { DollarSign, Users, ShoppingCart, TrendingUp, TrendingDown, CreditCard, Package } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PropiedadesResumenVentas {
  titulo: string
  valor: string
  porcentajeCambio: number
  icono: string
}

export function ResumenVentas({ titulo, valor, porcentajeCambio, icono }: PropiedadesResumenVentas) {
  // Determinar si el cambio es positivo o negativo
  const esPositivo = porcentajeCambio >= 0

  // Obtener el icono correspondiente
  const obtenerIcono = () => {
    switch (icono) {
      case "dollar-sign":
        return <DollarSign className="h-5 w-5" />
      case "users":
        return <Users className="h-5 w-5" />
      case "shopping-cart":
        return <ShoppingCart className="h-5 w-5" />
      case "trending-up":
        return <TrendingUp className="h-5 w-5" />
      case "credit-card":
        return <CreditCard className="h-5 w-5" />
      case "package":
        return <Package className="h-5 w-5" />
      default:
        return <DollarSign className="h-5 w-5" />
    }
  }

  return (
    <Card className="bg-white dark:bg-[#2A2E2A] border-[#E1DBFF] dark:border-[#3A3E3A]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[#7F6CFF]">{titulo}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-[#E1DBFF] dark:bg-[#3A3E3A] flex items-center justify-center text-[#7F6CFF]">
          {obtenerIcono()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{valor}</div>
        <p className="text-xs text-muted-foreground flex items-center mt-1">
          {esPositivo ? (
            <TrendingUp className="mr-1 h-3 w-3 text-[#A1F044]" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3 text-[#D74838]" />
          )}
          <span className={esPositivo ? "text-[#A1F044]" : "text-[#D74838]"}>
            {esPositivo ? "+" : ""}
            {porcentajeCambio}%
          </span>
          <span className="ml-1">vs. período anterior</span>
        </p>
      </CardContent>
    </Card>
  )
}

