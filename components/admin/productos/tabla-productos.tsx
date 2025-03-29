"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MoreHorizontal, ArrowUpDown, Edit, Trash, Copy, Eye, Tag } from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { formatearPrecio } from "@/lib/utils"
import type { Producto } from "@/types"
import { eliminarProducto, actualizarStockProducto } from "@/acciones/admin/productos"

interface PropiedadesTablaProductos {
  productos: Producto[]
}

export function TablaProductos({ productos }: PropiedadesTablaProductos) {
  const router = useRouter()
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null)
  const [mostrarDialogoEliminar, setMostrarDialogoEliminar] = useState(false)
  const [mostrarDialogoStock, setMostrarDialogoStock] = useState(false)
  const [nuevoStock, setNuevoStock] = useState<number>(0)
  const [ordenarPor, setOrdenarPor] = useState<string>("nombre")
  const [ordenAscendente, setOrdenAscendente] = useState<boolean>(true)
  const [cargando, setCargando] = useState(false)

  // Función para ordenar productos
  const ordenarProductos = (a: Producto, b: Producto) => {
    if (ordenarPor === "nombre") {
      return ordenAscendente ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)
    } else if (ordenarPor === "precio") {
      return ordenAscendente ? a.precio - b.precio : b.precio - a.precio
    } else if (ordenarPor === "stock") {
      return ordenAscendente ? a.stock - b.stock : b.stock - a.stock
    } else if (ordenarPor === "categoria") {
      return ordenAscendente
        ? a.categoria.nombre.localeCompare(b.categoria.nombre)
        : b.categoria.nombre.localeCompare(a.categoria.nombre)
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

  // Función para editar un producto
  const editarProducto = (producto: Producto) => {
    router.push(`/admin/productos/${producto.id}`)
  }

  // Función para eliminar un producto
  const confirmarEliminarProducto = (producto: Producto) => {
    setProductoSeleccionado(producto)
    setMostrarDialogoEliminar(true)
  }

  const eliminarProductoSeleccionado = async () => {
    if (!productoSeleccionado) return

    setCargando(true)

    try {
      await eliminarProducto(productoSeleccionado.id)
      setMostrarDialogoEliminar(false)
      router.refresh()
    } catch (error) {
      console.error("Error al eliminar producto:", error)
    } finally {
      setCargando(false)
    }
  }

  // Función para actualizar stock
  const abrirDialogoStock = (producto: Producto) => {
    setProductoSeleccionado(producto)
    setNuevoStock(producto.stock)
    setMostrarDialogoStock(true)
  }

  const actualizarStock = async () => {
    if (!productoSeleccionado) return

    setCargando(true)

    try {
      await actualizarStockProducto(productoSeleccionado.id, nuevoStock)
      setMostrarDialogoStock(false)
      router.refresh()
    } catch (error) {
      console.error("Error al actualizar stock:", error)
    } finally {
      setCargando(false)
    }
  }

  // Función para duplicar un producto
  const duplicarProducto = (producto: Producto) => {
    router.push(`/admin/productos/nuevo?duplicar=${producto.id}`)
  }

  // Función para crear una promoción
  const crearPromocion = (producto: Producto) => {
    router.push(`/admin/promociones/nueva?producto=${producto.id}`)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagen</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => cambiarOrden("nombre")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Nombre
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => cambiarOrden("categoria")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Categoría
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => cambiarOrden("precio")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Precio
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => cambiarOrden("stock")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Stock
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No hay productos para mostrar
                </TableCell>
              </TableRow>
            ) : (
              [...productos].sort(ordenarProductos).map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-md overflow-hidden">
                      <Image
                        src={producto.imagenes[0] || "/placeholder.svg"}
                        alt={producto.nombre}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{producto.nombre}</span>
                      {producto.esNuevo && (
                        <Badge variant="outline" className="w-fit text-xs mt-1">
                          Nuevo
                        </Badge>
                      )}
                      {producto.precioOriginal && producto.precioOriginal > producto.precio && (
                        <Badge variant="outline" className="w-fit text-xs mt-1 bg-red-50 text-red-700 border-red-200">
                          Oferta
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{producto.categoria.nombre}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{formatearPrecio(producto.precio)}</span>
                      {producto.precioOriginal && producto.precioOriginal > producto.precio && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatearPrecio(producto.precioOriginal)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={producto.stock === 0 ? "text-red-500 font-medium" : ""}>{producto.stock}</span>
                      {producto.stock === 0 && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Agotado
                        </Badge>
                      )}
                      {producto.stock > 0 && producto.stock <= 5 && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Bajo
                        </Badge>
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
                        <DropdownMenuItem onClick={() => editarProducto(producto)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => abrirDialogoStock(producto)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Actualizar stock
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicarProducto(producto)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => crearPromocion(producto)}>
                          <Tag className="mr-2 h-4 w-4" />
                          Crear promoción
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => confirmarEliminarProducto(producto)} className="text-red-600">
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

      {/* Diálogo de confirmación para eliminar producto */}
      <Dialog open={mostrarDialogoEliminar} onOpenChange={setMostrarDialogoEliminar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el producto{" "}
              <span className="font-medium">{productoSeleccionado?.nombre}</span> y todos sus datos asociados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarDialogoEliminar(false)} disabled={cargando}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={eliminarProductoSeleccionado} disabled={cargando}>
              {cargando ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para actualizar stock */}
      <Dialog open={mostrarDialogoStock} onOpenChange={setMostrarDialogoStock}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Stock</DialogTitle>
            <DialogDescription>
              Actualiza el stock disponible para el producto{" "}
              <span className="font-medium">{productoSeleccionado?.nombre}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Stock Actual</label>
                  <Input value={productoSeleccionado?.stock || 0} disabled className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Nuevo Stock</label>
                  <Input
                    type="number"
                    min="0"
                    value={nuevoStock}
                    onChange={(e) => setNuevoStock(Number.parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarDialogoStock(false)} disabled={cargando}>
              Cancelar
            </Button>
            <Button onClick={actualizarStock} disabled={cargando || nuevoStock === productoSeleccionado?.stock}>
              {cargando ? "Actualizando..." : "Actualizar Stock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

