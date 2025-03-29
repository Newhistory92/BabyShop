"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/opcionesAutenticacion"

// Función para obtener promociones
export async function obtenerPromocionesAdmin(filtro: string) {
  try {
    // Verificar autenticación y permisos de administrador
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.esAdmin) {
      throw new Error("No autorizado")
    }

    // Si se solicita el resumen
    if (filtro === "resumen") {
      const fechaActual = new Date()

      const activas = await prisma.promocion.count({
        where: {
          fechaInicio: { lte: fechaActual },
          fechaFin: { gte: fechaActual },
        },
      })

      const programadas = await prisma.promocion.count({
        where: {
          fechaInicio: { gt: fechaActual },
        },
      })

      // Calcular descuento promedio
      const promociones = await prisma.promocion.findMany({
        where: {
          fechaInicio: { lte: fechaActual },
          fechaFin: { gte: fechaActual },
        },
        select: {
          descuento: true,
          tipo: true,
        },
      })

      let descuentoPromedio = 0

      if (promociones.length > 0) {
        // Solo considerar promociones de tipo PORCENTAJE para el promedio
        const promocionesConPorcentaje = promociones.filter((p) => p.tipo === "PORCENTAJE")

        if (promocionesConPorcentaje.length > 0) {
          descuentoPromedio = Math.round(
            promocionesConPorcentaje.reduce((sum, p) => sum + p.descuento, 0) / promocionesConPorcentaje.length,
          )
        }
      }

      return {
        activas,
        programadas,
        descuentoPromedio,
      }
    }

    // Consultar todas las promociones
    const promociones = await prisma.promocion.findMany({
      include: {
        productosPromocion: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                imagenes: true,
              },
            },
          },
        },
      },
      orderBy: {
        creado: "desc",
      },
    })

    // Transformar los datos para la respuesta
    const promocionesFormateadas = promociones.map((promocion) => {
      // Determinar el estado de la promoción
      const fechaActual = new Date()
      let estado: "ACTIVA" | "PROGRAMADA" | "FINALIZADA"

      if (fechaActual < new Date(promocion.fechaInicio)) {
        estado = "PROGRAMADA"
      } else if (fechaActual > new Date(promocion.fechaFin)) {
        estado = "FINALIZADA"
      } else {
        estado = "ACTIVA"
      }

      return {
        id: promocion.id,
        titulo: promocion.titulo,
        descripcion: promocion.descripcion,
        descuento: promocion.descuento,
        tipo: promocion.tipo,
        fechaInicio: promocion.fechaInicio.toISOString(),
        fechaFin: promocion.fechaFin.toISOString(),
        estado,
        productos: promocion.productosPromocion.map((pp) => ({
          id: pp.producto.id,
          nombre: pp.producto.nombre,
          imagen: pp.producto.imagenes[0] || "/placeholder.svg",
        })),
      }
    })

    return promocionesFormateadas
  } catch (error) {
    console.error("Error al obtener promociones:", error)
    throw new Error("Error al obtener promociones")
  }
}

// Función para guardar una promoción (crear o actualizar)
export async function guardarPromocion(datos: any) {
  try {
    // Verificar autenticación y permisos de administrador
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.esAdmin) {
      throw new Error("No autorizado")
    }

    const { id, titulo, descripcion, descuento, tipo, fechaInicio, fechaFin, productosIds } = datos

    // Crear o actualizar la promoción
    let promocion

    if (id) {
      // Actualizar promoción existente
      promocion = await prisma.promocion.update({
        where: { id },
        data: {
          titulo,
          descripcion,
          descuento,
          tipo,
          fechaInicio: new Date(fechaInicio),
          fechaFin: new Date(fechaFin),
          actualizado: new Date(),
        },
      })

      // Actualizar productos asociados
      // Primero eliminar los existentes
      await prisma.productoPromocion.deleteMany({
        where: { promocionId: id },
      })

      // Luego crear los nuevos
      if (productosIds && productosIds.length > 0) {
        for (const productoId of productosIds) {
          await prisma.productoPromocion.create({
            data: {
              promocionId: id,
              productoId,
            },
          })

          // Si la promoción es de tipo PORCENTAJE, actualizar el precio original del producto
          if (tipo === "PORCENTAJE") {
            const producto = await prisma.producto.findUnique({
              where: { id: productoId },
            })

            if (producto) {
              // Si el producto no tiene precio original, establecerlo
              if (!producto.precioOriginal) {
                await prisma.producto.update({
                  where: { id: productoId },
                  data: {
                    precioOriginal: producto.precio,
                    precio: Math.round(producto.precio * (1 - descuento / 100)),
                  },
                })
              }
            }
          }
        }
      }
    } else {
      // Crear nueva promoción
      promocion = await prisma.promocion.create({
        data: {
          titulo,
          descripcion,
          descuento,
          tipo,
          fechaInicio: new Date(fechaInicio),
          fechaFin: new Date(fechaFin),
        },
      })

      // Asociar productos
      if (productosIds && productosIds.length > 0) {
        for (const productoId of productosIds) {
          await prisma.productoPromocion.create({
            data: {
              promocionId: promocion.id,
              productoId,
            },
          })

          // Si la promoción es de tipo PORCENTAJE, actualizar el precio original del producto
          if (tipo === "PORCENTAJE") {
            const producto = await prisma.producto.findUnique({
              where: { id: productoId },
            })

            if (producto) {
              // Si el producto no tiene precio original, establecerlo
              if (!producto.precioOriginal) {
                await prisma.producto.update({
                  where: { id: productoId },
                  data: {
                    precioOriginal: producto.precio,
                    precio: Math.round(producto.precio * (1 - descuento / 100)),
                  },
                })
              }
            }
          }
        }
      }
    }

    // Revalidar rutas
    revalidatePath("/admin/promociones")
    revalidatePath("/productos")

    return promocion
  } catch (error) {
    console.error("Error al guardar promoción:", error)
    throw new Error("Error al guardar promoción")
  }
}

// Función para eliminar una promoción
export async function eliminarPromocion(id: string) {
  try {
    // Verificar autenticación y permisos de administrador
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.esAdmin) {
      throw new Error("No autorizado")
    }

    // Obtener productos asociados a la promoción
    const productosPromocion = await prisma.productoPromocion.findMany({
      where: { promocionId: id },
      include: {
        producto: true,
      },
    })

    // Eliminar asociaciones de productos
    await prisma.productoPromocion.deleteMany({
      where: { promocionId: id },
    })

    // Restaurar precios originales de los productos
    for (const pp of productosPromocion) {
      if (pp.producto.precioOriginal) {
        await prisma.producto.update({
          where: { id: pp.productoId },
          data: {
            precio: pp.producto.precioOriginal,
            precioOriginal: null,
          },
        })
      }
    }

    // Eliminar la promoción
    await prisma.promocion.delete({
      where: { id },
    })

    // Revalidar rutas
    revalidatePath("/admin/promociones")
    revalidatePath("/productos")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar promoción:", error)
    throw new Error("Error al eliminar promoción")
  }
}

