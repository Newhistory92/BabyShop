"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MoreHorizontal, ArrowUpDown, Edit, Trash, Eye, Calendar } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatearPrecio, obtenerFechaFormateada } from "@/lib/utils"
import { eliminarPromocion } from "@/acciones/admin/promociones"

interface Promocion {
  id: string
  titulo: string
  descripcion: string
  descuento: number
  tipo: "PORCENTAJE" | "MONTO_FIJO"
  fechaInicio: string
  fechaFin: string
  estado: "ACTIVA" | "PROGRAMADA" | "FINALIZADA"
  productos: {
    id: string
    nombre: string
    imagen: string
  }[]
}

interface PropiedadesTablaPromociones {
  promociones: Promocion[]
}

export function TablaPromociones({ promociones }: PropiedadesTablaPromociones) {
  const router = useRouter()
  const [promocionSeleccionada, setPromocionSeleccionada] = useState<Promocion | null>(null)
  const [mostrarDialogoEliminar, setMostrarDialogoEliminar] = useState(false)
  const [ordenarPor, setOrdenarPor] = useState<string>("fechaInicio")
  const [ordenAscendente, setOrdenAscendente] = useState<boolean>(false)
  const [cargando, setCargando] = useState(false)

  // Función para ordenar promociones
  const ordenarPromociones = (a: Promocion, b: Promocion) => {
    if (ordenarPor === "titulo") {
      return ordenAscendente ? a.titulo.localeCompare(b.titulo) : b.titulo.localeCompare(a.titulo)
    } else if (ordenarPor === "descuento") {
      return ordenAscendente ? a.descuento - b.descuento : b.descuento - a.descuento
    } else if (ordenarPor === "fechaInicio") {
      return ordenAscendente
        ? new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
        : new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    } else if (ordenarPor === "estado") {
      return ordenAscendente ? a.estado.localeCompare(b.estado) : b.estado.localeCompare(a.estado)
    }
    return 0
  }

  // Función para cambiar el orden
  const cambiarOrden = (campo: string) => {
    if (ordenarPor === campo) {
      setOrdenAscendente(!ordenAscendente)
    } else {
      setOrdenarPor(campo)
      setOrdenAscendente(true)
    }
  }

  // Función para editar una promoción
  const editarPromocion = (promocion: Promocion) => {
    router.push(`/admin/promociones/${promocion.id}`)
  }

  // Función para eliminar una promoción
  const confirmarEliminarPromocion = (promocion: Promocion) => {
    setPromocionSeleccionada(promocion)
    setMostrarDialogoEliminar(true)
  }

  const eliminarPromocionSeleccionada = async () => {
    if (!promocionSeleccionada) return

    setCargando(true)

    try {
      await eliminarPromocion(promocionSeleccionada.id)
      setMostrarDialogoEliminar(false)
      router.refresh()
    } catch (error) {
      console.error("Error al eliminar promoción:", error)
    } finally {
      setCargando(false)
    }
  }

  // Obtener color de badge según estado
  const obtenerColorBadge = (estado: string) => {
    switch (estado) {
      case "ACTIVA":
        return "bg-green-500 hover:bg-green-600"
      case "PROGRAMADA":
        return "bg-blue-500 hover:bg-blue-600"
      case "FINALIZADA":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => cambiarOrden("titulo")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Título
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => cambiarOrden("descuento")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Descuento
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => cambiarOrden("fechaInicio")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Vigencia
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => cambiarOrden("estado")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Estado
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Productos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promociones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No hay promociones para mostrar
                </TableCell>
              </TableRow>
            ) : (
              [...promociones].sort(ordenarPromociones).map((promocion) => (
                <TableRow key={promocion.id}>
                  <TableCell className="font-medium">{promocion.titulo}</TableCell>
                  <TableCell>
                    {promocion.tipo === "PORCENTAJE" ? (
                      <span>{promocion.descuento}%</span>
                    ) : (
                      <span>{formatearPrecio(promocion.descuento)}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>Desde: {obtenerFechaFormateada(promocion.fechaInicio)}</span>
                      <span>Hasta: {obtenerFechaFormateada(promocion.fechaFin)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={obtenerColorBadge(promocion.estado)}>{promocion.estado}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      {promocion.productos.slice(0, 3).map((producto) => (
                        <div key={producto.id} className="h-8 w-8 rounded-full border-2 border-white overflow-hidden">
                          <Image
                            src={producto.imagen || "/placeholder.svg"}
                            alt={producto.nombre}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                      {promocion.productos.length > 3 && (
                        <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                          +{promocion.productos.length - 3}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => editarPromocion(promocion)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Reprogramar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => confirmarEliminarPromocion(promocion)}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de confirmación para eliminar promoción */}
      <Dialog open={mostrarDialogoEliminar} onOpenChange={setMostrarDialogoEliminar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la promoción{" "}
              <span className="font-medium">{promocionSeleccionada?.titulo}</span> y todos sus datos asociados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarDialogoEliminar(false)} disabled={cargando}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={eliminarPromocionSeleccionada} disabled={cargando}>
              {cargando ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

