import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { Migas } from "@/components/ui/migas"
import { DetalleProducto } from "@/components/productos/detalle-producto"
import { CarruselProductos } from "@/components/productos/carrusel-productos"
import { FichaTecnica } from "@/components/productos/ficha-tecnica"
import { SeccionResenas } from "@/components/productos/seccion-resenas"
import { SeccionFAQ } from "@/components/productos/seccion-faq"
import { Skeleton } from "@/components/ui/skeleton"
import { obtenerProductoPorId, obtenerProductosRelacionados } from "@/acciones/productos"

interface PropiedadesPagina {
  params: {
    id: string
  }
}

// Generar metadatos dinámicos
export async function generateMetadata({ params }: PropiedadesPagina): Promise<Metadata> {
  const producto = await obtenerProductoPorId(params.id)

  if (!producto) {
    return {
      title: "Producto no encontrado",
      description: "El producto que buscas no existe o ha sido eliminado.",
    }
  }

  return {
    title: producto.nombre,
    description: producto.descripcion?.slice(0, 160) || "Producto de cosmética natural y eco-friendly",
    openGraph: {
      images: [producto.imagenes[0]],
    },
  }
}

export default async function PaginaProducto({ params }: PropiedadesPagina) {
  const producto = await obtenerProductoPorId(params.id)

  if (!producto) {
    notFound()
  }

  // Calcular si tiene descuento
  const tieneDescuento = producto.precioOriginal && producto.precioOriginal > producto.precio
  const porcentajeDescuento = tieneDescuento
    ? Math.round(((producto.precioOriginal! - producto.precio) / producto.precioOriginal!) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Migas de pan */}
      <Migas
        items={[
          { label: "Inicio", href: "/" },
          { label: "Productos", href: "/productos" },
          { label: producto.nombre, href: `/productos/${producto.id}`, activo: true },
        ]}
      />

      <div className="mt-8 grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Detalle del producto */}
        <DetalleProducto
          producto={producto}
          tieneDescuento={tieneDescuento}
          porcentajeDescuento={porcentajeDescuento}
        />
      </div>

      {/* Ficha técnica */}
      <div className="mt-12">
        <FichaTecnica producto={producto} />
      </div>

      {/* Reseñas */}
      <div className="mt-12">
        <SeccionResenas
          productoId={producto.id}
          resenas={producto.resenas || []}
          calificacion={producto.calificacion || 0}
          cantidadResenas={producto.cantidadResenas}
        />
      </div>

      {/* Preguntas frecuentes */}
      <div className="mt-12">
        <SeccionFAQ productoId={producto.id} />
      </div>

      {/* Productos relacionados */}
      <div className="mt-12">
        <Suspense fallback={<SkeletonCarruselProductos />}>
          <ProductosRelacionados productoId={producto.id} categoriaId={producto.categoriaId} />
        </Suspense>
      </div>
    </div>
  )
}

// Componente para cargar productos relacionados
async function ProductosRelacionados({ productoId, categoriaId }: { productoId: string; categoriaId: string }) {
  const productosRelacionados = await obtenerProductosRelacionados(productoId, categoriaId)

  return (
    <CarruselProductos
      titulo="También te puede interesar"
      productos={productosRelacionados}
      verTodosUrl={`/productos?categoria=${categoriaId}`}
    />
  )
}

// Skeleton para el carrusel de productos
function SkeletonCarruselProductos() {
  return (
    <div>
      <Skeleton className="h-10 w-64 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
      </div>
    </div>
  )
}

