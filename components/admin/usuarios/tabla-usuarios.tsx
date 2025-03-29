"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MoreHorizontal, ArrowUpDown, Trash, Eye, Ban, CheckCircle } from "lucide-react"

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
import { obtenerFechaFormateada, calcularTiempoTranscurrido } from "@/lib/utils"
import { pausarUsuario, activarUsuario, eliminarUsuario } from "@/acciones/admin/usuarios"

interface Usuario {
  id: string
  nombre: string
  email: string
  imagen: string
  creado: string
  actualizado: string
  esAdmin: boolean
  estado: "ACTIVO" | "PAUSADO"
  totalPedidos: number
  ultimoAcceso: string
}

interface PropiedadesTablaUsuarios {
  usuarios: Usuario[]
}

export function TablaUsuarios({ usuarios }: PropiedadesTablaUsuarios) {
  const router = useRouter()
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null)
  const [mostrarDialogoEliminar, setMostrarDialogoEliminar] = useState(false)
  const [mostrarDialogoPausar, setMostrarDialogoPausar] = useState(false)
  const [mostrarDialogoActivar, setMostrarDialogoActivar] = useState(false)
  const [ordenarPor, setOrdenarPor] = useState<string>("nombre")
  const [ordenAscendente, setOrdenAscendente] = useState<boolean>(true)
  const [cargando, setCargando] = useState(false)

  // Función para ordenar usuarios
  const ordenarUsuarios = (a: Usuario, b: Usuario) => {
    if (ordenarPor === "nombre") {
      return ordenAscendente ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)
    } else if (ordenarPor === "email") {
      return ordenAscendente ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email)
    } else if (ordenarPor === "creado") {
      return ordenAscendente
        ? new Date(a.creado).getTime() - new Date(b.creado).getTime()
        : new Date(b.creado).getTime() - new Date(a.creado).getTime()
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

  // Función para ver detalles de un usuario
  const verDetallesUsuario = (usuario: Usuario) => {
    router.push(`/admin/usuarios/${usuario.id}`)
  }

  // Función para pausar un usuario
  const confirmarPausarUsuario = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario)
    setMostrarDialogoPausar(true)
  }

  const pausarUsuarioSeleccionado = async () => {
    if (!usuarioSeleccionado) return

    setCargando(true)

    try {
      await pausarUsuario(usuarioSeleccionado.id)
      setMostrarDialogoPausar(false)
      router.refresh()
    } catch (error) {
      console.error("Error al pausar usuario:", error)
    } finally {
      setCargando(false)
    }
  }

  // Función para activar un usuario
  const confirmarActivarUsuario = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario)
    setMostrarDialogoActivar(true)
  }

  const activarUsuarioSeleccionado = async () => {
    if (!usuarioSeleccionado) return

    setCargando(true)

    try {
      await activarUsuario(usuarioSeleccionado.id)
      setMostrarDialogoActivar(false)
      router.refresh()
    } catch (error) {
      console.error("Error al activar usuario:", error)
    } finally {
      setCargando(false)
    }
  }

  // Función para eliminar un usuario
  const confirmarEliminarUsuario = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario)
    setMostrarDialogoEliminar(true)
  }

  const eliminarUsuarioSeleccionado = async () => {
    if (!usuarioSeleccionado) return

    setCargando(true)

    try {
      await eliminarUsuario(usuarioSeleccionado.id)
      setMostrarDialogoEliminar(false)
      router.refresh()
    } catch (error) {
      console.error("Error al eliminar usuario:", error)
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Avatar</TableHead>
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
                  onClick={() => cambiarOrden("email")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Email
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => cambiarOrden("creado")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Registro
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
              <TableHead>Pedidos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No hay usuarios para mostrar
                </TableCell>
              </TableRow>
            ) : (
              [...usuarios].sort(ordenarUsuarios).map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <Image
                        src={usuario.imagen || "/placeholder.svg"}
                        alt={usuario.nombre || "Avatar"}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{usuario.nombre || "Usuario"}</span>
                      {usuario.esAdmin && (
                        <Badge variant="outline" className="w-fit text-xs mt-1">
                          Admin
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{obtenerFechaFormateada(usuario.creado)}</span>
                      <span className="text-xs text-muted-foreground">
                        {calcularTiempoTranscurrido(usuario.creado)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        usuario.estado === "ACTIVO" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                      }
                    >
                      {usuario.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{usuario.totalPedidos} pedidos</span>
                      {usuario.ultimoAcceso && (
                        <span className="text-xs text-muted-foreground">
                          Último acceso: {calcularTiempoTranscurrido(usuario.ultimoAcceso)}
                        </span>
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
                        <DropdownMenuItem onClick={() => verDetallesUsuario(usuario)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        {usuario.estado === "ACTIVO" ? (
                          <DropdownMenuItem onClick={() => confirmarPausarUsuario(usuario)}>
                            <Ban className="mr-2 h-4 w-4" />
                            Pausar cuenta
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => confirmarActivarUsuario(usuario)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activar cuenta
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => confirmarEliminarUsuario(usuario)} className="text-red-600">
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

      {/* Diálogo de confirmación para pausar usuario */}
      <Dialog open={mostrarDialogoPausar} onOpenChange={setMostrarDialogoPausar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pausar cuenta de usuario</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas pausar la cuenta de{" "}
              <span className="font-medium">{usuarioSeleccionado?.nombre || usuarioSeleccionado?.email}</span>?
              <br />
              <br />
              El usuario no podrá iniciar sesión ni realizar compras mientras su cuenta esté pausada.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarDialogoPausar(false)} disabled={cargando}>
              Cancelar
            </Button>
            <Button variant="default" onClick={pausarUsuarioSeleccionado} disabled={cargando}>
              {cargando ? "Procesando..." : "Pausar cuenta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para activar usuario */}
      <Dialog open={mostrarDialogoActivar} onOpenChange={setMostrarDialogoActivar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activar cuenta de usuario</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas activar la cuenta de{" "}
              <span className="font-medium">{usuarioSeleccionado?.nombre || usuarioSeleccionado?.email}</span>?
              <br />
              <br />
              El usuario podrá iniciar sesión y realizar compras nuevamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarDialogoActivar(false)} disabled={cargando}>
              Cancelar
            </Button>
            <Button variant="default" onClick={activarUsuarioSeleccionado} disabled={cargando}>
              {cargando ? "Procesando..." : "Activar cuenta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar usuario */}
      <Dialog open={mostrarDialogoEliminar} onOpenChange={setMostrarDialogoEliminar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la cuenta de{" "}
              <span className="font-medium">{usuarioSeleccionado?.nombre || usuarioSeleccionado?.email}</span> y todos
              sus datos asociados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarDialogoEliminar(false)} disabled={cargando}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={eliminarUsuarioSeleccionado} disabled={cargando}>
              {cargando ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

