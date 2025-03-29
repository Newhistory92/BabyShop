"use client"

import useSWR from "swr"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import type { Producto, FiltrosProducto, RespuestaPaginada, Categoria } from "@/types"

// Hook para obtener productos con filtros y paginación
export function useProductos() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  // Extraer filtros de los parámetros de búsqueda
  const categoria = searchParams.get("categoria") || undefined
  const etiquetasEco = searchParams.getAll("etiquetaEco") || undefined
  const precioMin = searchParams.get("precioMin") ? Number.parseInt(searchParams.get("precioMin")!) : undefined
  const precioMax = searchParams.get("precioMax") ? Number.parseInt(searchParams.get("precioMax")!) : undefined
  const busqueda = searchParams.get("busqueda") || undefined
  const pagina = searchParams.get("pagina") ? Number.parseInt(searchParams.get("pagina")!) : 1
  const limite = searchParams.get("limite") ? Number.parseInt(searchParams.get("limite")!) : 12
  const ordenar = (searchParams.get("ordenar") as any) || "destacados"

  // Construir la URL para la petición
  const filtros: FiltrosProducto = {
    categoria,
    etiquetaEco: etiquetasEco,
    precioMin,
    precioMax,
    busqueda,
    pagina,
    limite,
    ordenar,
  }

  // Construir la URL para SWR
  const params = new URLSearchParams()
  if (categoria) params.append("categoria", categoria)
  if (etiquetasEco) etiquetasEco.forEach((etiqueta) => params.append("etiquetaEco", etiqueta))
  if (precioMin !== undefined) params.append("precioMin", precioMin.toString())
  if (precioMax !== undefined) params.append("precioMax", precioMax.toString())
  if (busqueda) params.append("busqueda", busqueda)
  params.append("pagina", pagina.toString())
  params.append("limite", limite.toString())
  params.append("ordenar", ordenar)

  // Usar SWR para obtener los datos
  const { data, error, isLoading, isValidating, mutate } = useSWR<RespuestaPaginada<Producto>>(
    `/api/productos?${params.toString()}`,
  )

  // Función para actualizar los filtros
  const actualizarFiltros = (nuevosFiltros: Partial<FiltrosProducto>) => {
    const params = new URLSearchParams(searchParams.toString())

    // Actualizar los parámetros con los nuevos filtros
    Object.entries(nuevosFiltros).forEach(([clave, valor]) => {
      if (valor === undefined || valor === null) {
        params.delete(clave)
      } else if (Array.isArray(valor)) {
        params.delete(clave)
        valor.forEach((v) => params.append(clave, v))
      } else {
        params.set(clave, valor.toString())
      }
    })

    // Resetear la página si cambian los filtros (excepto si el cambio es de página)
    if (!nuevosFiltros.hasOwnProperty("pagina")) {
      params.set("pagina", "1")
    }

    // Actualizar la URL con los nuevos parámetros
    router.push(`${pathname}?${params.toString()}`)
  }

  return {
    productos: data?.datos || [],
    paginacion: data?.paginacion,
    error,
    cargando: isLoading,
    validando: isValidating,
    recargar: mutate,
    filtros,
    actualizarFiltros,
  }
}

// Hook para obtener un producto por ID
export function useProducto(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Producto>(id ? `/api/productos/${id}` : null)

  return {
    producto: data,
    error,
    cargando: isLoading,
    recargar: mutate,
  }
}

// Hook para obtener productos destacados
export function useProductosDestacados() {
  const { data, error, isLoading } = useSWR<Producto[]>("/api/productos/destacados")

  return {
    productosDestacados: data || [],
    error,
    cargando: isLoading,
  }
}

// Hook para obtener categorías
export function useCategorias() {
  const { data, error, isLoading } = useSWR<Categoria[]>("/api/categorias")

  return {
    categorias: data || [],
    error,
    cargando: isLoading,
  }
}

// Hook para obtener etiquetas ecológicas
export function useEtiquetasEco() {
  const { data, error, isLoading } = useSWR<string[]>("/api/etiquetas-eco")

  return {
    etiquetasEco: data || [],
    error,
    cargando: isLoading,
  }
}

