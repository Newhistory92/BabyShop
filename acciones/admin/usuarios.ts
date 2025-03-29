"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/opcionesAutenticacion"
import { resend } from "@/lib/resend"
import { AccountStatusEmail } from "@/emails/account-status"

// Función para obtener usuarios
export async function obtenerUsuariosAdmin(filtro: string) {
  try {
    // Verificar autenticación y permisos de administrador
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.esAdmin) {
      throw new Error("No autorizado")
    }

    // Si se solicita el resumen
    if (filtro === "resumen") {
      const total = await prisma.usuario.count()

      // Usuarios nuevos en los últimos 30 días
      const fechaHace30Dias = new Date()
      fechaHace30Dias.setDate(fechaHace30Dias.getDate() - 30)

      const nuevos = await prisma.usuario.count({
        where: {
          creado: { gte: fechaHace30Dias },
        },
      })

      const activos = await prisma.usuario.count({
        where: {
          estado: "ACTIVO",
        },
      })

      const pausados = await prisma.usuario.count({
        where: {
          estado: "PAUSADO",
        },
      })

      return {
        total,
        nuevos,
        activos,
        pausados,
      }
    }

    // Construir la consulta según el filtro
    let where = {}

    switch (filtro) {
      case "activos":
        where = { estado: "ACTIVO" }
        break
      case "pausados":
        where = { estado: "PAUSADO" }
        break
      case "administradores":
        where = { esAdmin: true }
        break
      default:
        where = {}
    }

    // Consultar usuarios
    const usuarios = await prisma.usuario.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        email: true,
        imagen: true,
        creado: true,
        actualizado: true,
        esAdmin: true,
        estado: true,
        ultimoAcceso: true,
        _count: {
          select: {
            pedidos: true,
          },
        },
      },
      orderBy: {
        creado: "desc",
      },
    })

    // Transformar los datos para la respuesta
    const usuariosFormateados = usuarios.map((usuario) => ({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      imagen: usuario.imagen || "/placeholder.svg",
      creado: usuario.creado.toISOString(),
      actualizado: usuario.actualizado.toISOString(),
      esAdmin: usuario.esAdmin,
      estado: usuario.estado,
      totalPedidos: usuario._count.pedidos,
      ultimoAcceso: usuario.ultimoAcceso ? usuario.ultimoAcceso.toISOString() : null,
    }))

    return usuariosFormateados
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    throw new Error("Error al obtener usuarios")
  }
}

// Función para pausar un usuario
export async function pausarUsuario(id: string) {
  try {
    // Verificar autenticación y permisos de administrador
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.esAdmin) {
      throw new Error("No autorizado")
    }

    // Obtener el usuario
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    })

    if (!usuario) {
      throw new Error("Usuario no encontrado")
    }

    // No permitir pausar administradores
    if (usuario.esAdmin) {
      throw new Error("No se puede pausar una cuenta de administrador")
    }

    // Actualizar el estado del usuario
    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: {
        estado: "PAUSADO",
        actualizado: new Date(),
      },
    })

    // Enviar email de notificación
    if (usuario.email) {
      await resend.emails.send({
        from: "EcoCosmetics <no-reply@ecocosmetics.com>",
        to: usuario.email,
        subject: "Tu cuenta ha sido pausada",
        react: AccountStatusEmail({
          userName: usuario.nombre || "Usuario",
          status: "PAUSADO",
          message: "Tu cuenta ha sido pausada temporalmente. Si crees que esto es un error, por favor contáctanos.",
        }),
      })
    }

    // Revalidar rutas
    revalidatePath("/admin/usuarios")

    return usuarioActualizado
  } catch (error) {
    console.error("Error al pausar usuario:", error)
    throw new Error("Error al pausar usuario")
  }
}

// Función para activar un usuario
export async function activarUsuario(id: string) {
  try {
    // Verificar autenticación y permisos de administrador
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.esAdmin) {
      throw new Error("No autorizado")
    }

    // Obtener el usuario
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    })

    if (!usuario) {
      throw new Error("Usuario no encontrado")
    }

    // Actualizar el estado del usuario
    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: {
        estado: "ACTIVO",
        actualizado: new Date(),
      },
    })

    // Enviar email de notificación
    if (usuario.email) {
      await resend.emails.send({
        from: "EcoCosmetics <no-reply@ecocosmetics.com>",
        to: usuario.email,
        subject: "Tu cuenta ha sido activada",
        react: AccountStatusEmail({
          userName: usuario.nombre || "Usuario",
          status: "ACTIVO",
          message:
            "¡Buenas noticias! Tu cuenta ha sido activada y ya puedes acceder a todos los servicios de EcoCosmetics.",
        }),
      })
    }

    // Revalidar rutas
    revalidatePath("/admin/usuarios")

    return usuarioActualizado
  } catch (error) {
    console.error("Error al activar usuario:", error)
    throw new Error("Error al activar usuario")
  }
}

// Función para eliminar un usuario
export async function eliminarUsuario(id: string) {
  try {
    // Verificar autenticación y permisos de administrador
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.esAdmin) {
      throw new Error("No autorizado")
    }

    // Obtener el usuario
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    })

    if (!usuario) {
      throw new Error("Usuario no encontrado")
    }

    // No permitir eliminar administradores
    if (usuario.esAdmin) {
      throw new Error("No se puede eliminar una cuenta de administrador")
    }

    // Eliminar el usuario y todos sus datos asociados
    await prisma.usuario.delete({
      where: { id },
    })

    // Revalidar rutas
    revalidatePath("/admin/usuarios")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    throw new Error("Error al eliminar usuario")
  }
}

