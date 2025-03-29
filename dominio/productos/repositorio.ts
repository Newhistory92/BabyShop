import type { Producto, FiltrosProducto, RespuestaPaginada, Categoria, Resena } from "@/types"

// Interfaz del repositorio siguiendo el patrón Repository
export interface RepositorioProductos {
  obtenerProductos(filtros: FiltrosProducto): Promise<RespuestaPaginada<Producto>>
  obtenerProductoPorId(id: string): Promise<Producto | null>
  obtenerProductosDestacados(): Promise<Producto[]>
  obtenerCategorias(): Promise<Categoria[]>
  obtenerEtiquetasEco(): Promise<string[]>
  agregarResena(productoId: string, resena: Omit<Resena, "id" | "creado">): Promise<Resena>
}

// Implementación del repositorio para la API
class RepositorioProductosAPI implements RepositorioProductos {
  async obtenerProductos(filtros: FiltrosProducto): Promise<RespuestaPaginada<Producto>> {
    const params = new URLSearchParams()

    if (filtros.categoria) params.append("categoria", filtros.categoria)
    if (filtros.etiquetaEco) {
      filtros.etiquetaEco.forEach((etiqueta) => params.append("etiquetaEco", etiqueta))
    }
    if (filtros.precioMin !== undefined) params.append("precioMin", filtros.precioMin.toString())
    if (filtros.precioMax !== undefined) params.append("precioMax", filtros.precioMax.toString())
    if (filtros.busqueda) params.append("busqueda", filtros.busqueda)
    params.append("pagina", filtros.pagina.toString())
    params.append("limite", filtros.limite.toString())
    params.append("ordenar", filtros.ordenar)

    const response = await fetch(`/api/productos?${params.toString()}`)

    if (!response.ok) {
      throw new Error("Error al obtener productos")
    }

    return response.json()
  }

  async obtenerProductoPorId(id: string): Promise<Producto | null> {
    const response = await fetch(`/api/productos/${id}`)

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error("Error al obtener el producto")
    }

    return response.json()
  }

  async obtenerProductosDestacados(): Promise<Producto[]> {
    const response = await fetch("/api/productos/destacados")

    if (!response.ok) {
      throw new Error("Error al obtener productos destacados")
    }

    return response.json()
  }

  async obtenerCategorias(): Promise<Categoria[]> {
    const response = await fetch("/api/categorias")

    if (!response.ok) {
      throw new Error("Error al obtener categorías")
    }

    return response.json()
  }

  async obtenerEtiquetasEco(): Promise<string[]> {
    const response = await fetch("/api/etiquetas-eco")

    if (!response.ok) {
      throw new Error("Error al obtener etiquetas ecológicas")
    }

    return response.json()
  }

  async agregarResena(productoId: string, resena: Omit<Resena, "id" | "creado">): Promise<Resena> {
    const response = await fetch(`/api/productos/${productoId}/resenas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resena),
    })

    if (!response.ok) {
      throw new Error("Error al agregar reseña")
    }

    return response.json()
  }
}

// Exportar una instancia del repositorio
export const repositorioProductos = new RepositorioProductosAPI()

