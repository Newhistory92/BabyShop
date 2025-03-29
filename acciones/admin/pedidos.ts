"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/opcionesAutenticacion"
import { resend } from "@/lib/resend"
import { OrderStatusEmail } from "@/emails/order-status"

// Función para obtener pedidos según el estado
export async function obtenerPedidosAdmin(estado: string) {
  try {
    // Verificar autenticación y permisos de administrador
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.esAdmin) {
      throw new Error("No autorizado")
    }

    // Si se solicita el resumen
    if (estado === "resumen") {
      const pendientes = await prisma.pedido.count({ where: { estado: "PENDIENTE" } })
      const procesando = await prisma.pedido.count({ where: { estado: "PROCESANDO" } })
      const enviados = await prisma.pedido.count({ where: { estado: "ENVIADO" } })
      const entregados = await prisma.pedido.count({ where: { estado: "ENTREGADO" } })
      const cancelados = await prisma.pedido.count({ where: { estado: "CANCELADO" } })

      return {
        pendientes,
        procesando,
        enviados,
        entregados,
        cancelados,
      }
    }

    // Consultar pedidos según el estado
    const pedidos = await prisma.pedido.findMany({
      where: estado !== "todos" ? { estado: estado as any } : {},
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            imagen: true,
          },
        },
        direccion: true,
        elementosPedido: {
          include: {
            producto: true,
            varianteProducto: true,
          },
        },
      },
      orderBy: {
        creado: "desc",
      },
    })

    return pedidos
  } catch (error) {
    console.error("Error al obtener pedidos:", error)
    throw new Error("Error al obtener pedidos")
  }
}

// Función para actualizar el estado de un pedido
export async function actualizarEstadoPedido(pedidoId: string, nuevoEstado: string) {
  try {
    // Verificar autenticación y permisos de administrador
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.esAdmin) {
      throw new Error("No autorizado")
    }

    // Obtener el pedido actual
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        usuario: true,
        direccion: true,
      },
    })

    if (!pedido) {
      throw new Error("Pedido no encontrado")
    }

    // Actualizar el estado del pedido
    const pedidoActualizado = await prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        estado: nuevoEstado as any,
        actualizado: new Date(),
      },
    })

    // Enviar email de notificación al cliente
    if (pedido.usuario?.email) {
      await resend.emails.send({
        from: "EcoCosmetics <no-reply@ecocosmetics.com>",
        to: pedido.usuario.email,
        subject: `Actualización de tu pedido #${pedidoId.slice(0, 8)}`,
        react: OrderStatusEmail({
          orderNumber: pedido.id,
          userName: pedido.usuario.nombre || "Cliente",
          orderStatus: nuevoEstado,
          orderDate: new Date(pedido.creado).toLocaleDateString(),
          shippingAddress: pedido.direccion
            ? `${pedido.direccion.calle} ${pedido.direccion.numero}, ${pedido.direccion.ciudad}, ${pedido.direccion.provincia}`
            : "No disponible",
          total: (pedido.total / 100).toFixed(2),
        }),
      })
    }

    // Revalidar rutas
    revalidatePath("/admin/pedidos")
    revalidatePath(`/cuenta/pedidos/${pedidoId}`)

    return pedidoActualizado
  } catch (error) {
    console.error("Error al actualizar estado del pedido:", error)
    throw new Error("Error al actualizar estado del pedido")
  }
}

// Función para imprimir etiqueta de envío
export async function imprimirEtiquetaEnvio(pedidoId: string) {
  try {
    // Verificar autenticación y permisos de administrador
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.esAdmin) {
      throw new Error("No autorizado")
    }

    // Obtener el pedido
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        usuario: true,
        direccion: true,
        elementosPedido: true,
      },
    })

    if (!pedido) {
      throw new Error("Pedido no encontrado")
    }

    // Aquí iría la lógica para enviar la etiqueta a la impresora
    // En un entorno real, esto podría conectarse a una API de impresión
    console.log(`Imprimiendo etiqueta para el pedido ${pedidoId}`)

    // Actualizar el estado del pedido a PROCESANDO si está PENDIENTE
    if (pedido.estado === "PENDIENTE") {
      await prisma.pedido.update({
        where: { id: pedidoId },
        data: {
          estado: "PROCESANDO",
          actualizado: new Date(),
        },
      })

      // Revalidar rutas
      revalidatePath("/admin/pedidos")
      revalidatePath(`/cuenta/pedidos/${pedidoId}`)
    }

    return { success: true, message: "Etiqueta enviada a impresión" }
  } catch (error) {
    console.error("Error al imprimir etiqueta:", error)
    throw new Error("Error al imprimir etiqueta")
  }
}

