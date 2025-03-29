import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"

import { FormularioProducto } from "@/components/admin/productos/formulario-producto"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { obtenerProductoPorId } from "@/acciones/productos"

interface PropiedadesPagina {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PropiedadesPagina): Promise<Metadata> {
  // Si es un nuevo producto
  if (params.id === "nuevo") {
    return {
      title: "Nuevo Producto | Admin EcoCosmetics",
      description: "Crear un nuevo producto en el catálogo",
    }
  }

  // Si es un producto existente
  const producto = await obtenerProductoPorId(params.id)

  if (!producto) {
    return {
      title: "Producto no encontrado | Admin EcoCosmetics",
      description: "El producto que buscas no existe o ha sido eliminado",
    }
  }

  return {
    title: `Editar ${producto.nombre} | Admin EcoCosmetics`,
    description: `Editar información del producto ${producto.nombre}`,
  }
}

export default async function PaginaEditarProducto({ params }: PropiedadesPagina) {
  const esNuevo = params.id === "nuevo"

  // Si no es nuevo, obtener el producto
  let producto = null
  if (!esNuevo) {
    producto = await obtenerProductoPorId(params.id)

    if (!producto) {
      notFound()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/productos">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {esNuevo ? "Nuevo Producto" : `Editar: ${producto?.nombre}`}
          </h1>
        </div>
      </div>

      <FormularioProducto producto={producto} />
    </div>
  )
}

