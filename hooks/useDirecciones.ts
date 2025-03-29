"use client"
import useSWR from "swr"
import { useAutenticacion } from "./useAutenticacion"
import type { Direccion } from "@/types"
import { useToast } from "@/components/ui/use-toast"

export function useDirecciones() {
  const { sesion } = useAutenticacion()
  const { toast } = useToast()

  // Obtener direcciones del usuario
  const { data, error, isLoading, mutate } = useSWR<Direccion[]>(sesion ? "/api/direcciones" : null)

  // Obtener dirección principal
  const direccionPrincipal = data?.find((dir) => dir.esPrincipal)

  // Función para agregar una dirección
  const agregarDireccion = async (direccion: Omit<Direccion, "id" | "usuarioId">) => {
    if (!sesion) return null

    try {
      const response = await fetch("/api/direcciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(direccion),
      })

      if (!response.ok) {
        throw new Error("Error al agregar dirección")
      }

      const nuevaDireccion = await response.json()
      mutate([...(data || []), nuevaDireccion])

      toast({
        title: "Dirección agregada",
        description: "La dirección ha sido agregada correctamente",
      })

      return nuevaDireccion
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al agregar dirección",
        variant: "destructive",
      })
      return null
    }
  }

  // Función para actualizar una dirección
  const actualizarDireccion = async (id: string, direccion: Partial<Direccion>) => {
    if (!sesion) return false

    try {
      const response = await fetch(`/api/direcciones/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(direccion),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar dirección")
      }

      const direccionActualizada = await response.json()

      mutate(data?.map((dir) => (dir.id === id ? { ...dir, ...direccionActualizada } : dir)) || [])

      toast({
        title: "Dirección actualizada",
        description: "La dirección ha sido actualizada correctamente",
      })

      return true
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar dirección",
        variant: "destructive",
      })
      return false
    }
  }

  // Función para eliminar una dirección
  const eliminarDireccion = async (id: string) => {
    if (!sesion) return false

    try {
      const response = await fetch(`/api/direcciones/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar dirección")
      }

      mutate(data?.filter((dir) => dir.id !== id) || [])

      toast({
        title: "Dirección eliminada",
        description: "La dirección ha sido eliminada correctamente",
      })

      return true
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar dirección",
        variant: "destructive",
      })
      return false
    }
  }

  // Función para establecer una dirección como principal
  const establecerDireccionPrincipal = async (id: string) => {
    return actualizarDireccion(id, { esPrincipal: true })
  }

  // Función para buscar direcciones por término (autocompletado)
  const buscarDireccionesPorTermino = async (termino: string): Promise<Direccion[]> => {
    if (termino.length < 3) return []

    try {
      // Simular búsqueda de direcciones (en producción, esto sería una API real)
      // Aquí usamos datos de ejemplo
      await new Promise((resolve) => setTimeout(resolve, 500))

      const direccionesEjemplo: Direccion[] = [
        {
          id: "1",
          usuarioId: "",
          nombre: "",
          calle: "Av. Corrientes",
          numero: "1234",
          departamento: "",
          ciudad: "Buenos Aires",
          provincia: "CABA",
          codigoPostal: "1043",
          pais: "Argentina",
          telefono: "",
          esPrincipal: false,
        },
        {
          id: "2",
          usuarioId: "",
          nombre: "",
          calle: "Av. Santa Fe",
          numero: "2345",
          departamento: "",
          ciudad: "Buenos Aires",
          provincia: "CABA",
          codigoPostal: "1425",
          pais: "Argentina",
          telefono: "",
          esPrincipal: false,
        },
        {
          id: "3",
          usuarioId: "",
          nombre: "",
          calle: "Av. Cabildo",
          numero: "3456",
          departamento: "",
          ciudad: "Buenos Aires",
          provincia: "CABA",
          codigoPostal: "1429",
          pais: "Argentina",
          telefono: "",
          esPrincipal: false,
        },
      ]

      return direccionesEjemplo.filter((dir) =>
        `${dir.calle} ${dir.numero}, ${dir.ciudad}`.toLowerCase().includes(termino.toLowerCase()),
      )
    } catch (error) {
      console.error("Error al buscar direcciones:", error)
      return []
    }
  }

  return {
    direcciones: data || [],
    direccionPrincipal,
    cargando: isLoading,
    error,
    agregarDireccion,
    actualizarDireccion,
    eliminarDireccion,
    establecerDireccionPrincipal,
    buscarDireccionesPorTermino,
    recargar: mutate,
  }
}

