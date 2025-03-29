"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/opcionesAutenticacion"

// Función para obtener productos según el filtro
export async function obtenerProductosAdmin(filtro: string) {
  try {
    // Verificar autenticación y permisos de administrador
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.esAdmin) {
      throw new Error("No autorizado")
    }

    // Si se solicita el resumen
    if (filtro === "resumen") {
      const total = await prisma.producto.count()
      const sinStock = await prisma.producto.count({ where: { stock: 0 } })
      const enOferta = await prisma.producto.count({
        where: {
          NOT: { precioOriginal: null },
          precioOriginal: { gt: 0 },
        },
      })

      // Calcular valor del inventario
      const productos = await prisma.producto.findMany({
        select: {
          precio: true,
          stock: true,
        },
      })

      const valorInventario = productos.reduce((total, producto) => {
        return total + producto.precio * producto.stock
      }, 0)

      return {
        total,
        sinStock,
        enOferta,
        valorInventario,
      }
    }

    // Construir la consulta según el filtro
    let where = {}

    switch (filtro) {
      case "activos":
        where = { stock: { gt: 0 } }
        break
      case "sin-stock":
        where = { stock: 0 }
        break
      case "ofertas":
        where = {
          NOT: { precioOriginal: null },
          precioOriginal: { gt: 0 },
        }
        break
      default:
        where = {}
    }

    // Consultar productos
    const productos = await prisma.producto.findMany({
      where,
      include: {
        categoria: true,
        variantes: true,
        etiquetasEco: {
          include: {
            etiquetaEco: true,
          },
        },
      },
      orderBy: {
        creado: "desc",
      },
    })

    // Transformar los datos para la respuesta
    const productosFormateados = productos.map((producto) => ({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      precioOriginal: producto.precioOriginal,
      precioCompra: producto.precioCompra,
      imagenes: producto.imagenes,
      categoria: producto.categoria,
      esNuevo: producto.esNuevo,
      calificacion: producto.calificacion,
      stock: producto.stock,
      etiquetasEco: producto.etiquetasEco.map((el) => el.etiquetaEco.nombre),
      variantes: producto.variantes,
      modoUso: producto.modoUso,
      ingredientes: producto.ingredientes,
      beneficios: producto.beneficios,
    }))

    return productosFormateados
  } catch (error) {
    console.error("Error al obtener productos:", error)
    throw new Error("Error al obtener productos")
  }
}

// Función para guardar un producto (crear o actualizar)
export async function guardarProducto(datos: any) {
  try {
    // Verificar autenticación y permisos de administrador
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.esAdmin) {
      throw new Error("No autorizado")
    }

    const {
      id,
      nombre,
      descripcion,
      precio,
      precioOriginal,
      precioCompra,
      stock,
      categoriaId,
      esNuevo,
      etiquetasEco,
      imagenes,
      variantes,
      modoUso,
      ingredientes,
      beneficios,
    } = datos

    // Crear o actualizar el producto
    let producto

    if (id) {
      // Actualizar producto existente
      producto = await prisma.producto.update({
        where: { id },
        data: {
          nombre,
          descripcion,
          precio,
          precioOriginal,
          precioCompra,
          stock,
          categoriaId,
          esNuevo,
          imagenes,
          modoUso,
          ingredientes,
          beneficios,
          actualizado: new Date(),
        },
      })

      // Actualizar etiquetas eco
      // Primero eliminar las existentes
      await prisma.productoEtiquetaEco.deleteMany({
        where: { productoId: id },
      })

      // Luego crear las nuevas
      if (etiquetasEco && etiquetasEco.length > 0) {
        for (const etiqueta of etiquetasEco) {
          // Buscar o crear la etiqueta
          const etiquetaEco = await prisma.etiquetaEco.upsert({
            where: { nombre: etiqueta },
            update: {},
            create: { nombre: etiqueta },
          })

          // Asociar la etiqueta al producto
          await prisma.productoEtiquetaEco.create({
            data: {
              productoId: id,
              etiquetaEcoId: etiquetaEco.id,
            },
          })
        }
      }

      // Actualizar variantes
      // Primero eliminar las que no están en la lista nueva
      const variantesIds = variantes.map((v: any) => v.id).filter((id: string) => id.startsWith("temp-") === false)

      await prisma.varianteProducto.deleteMany({
        where: {
          productoId: id,
          id: { notIn: variantesIds },
        },
      })

      // Luego actualizar o crear las variantes
      for (const variante of variantes) {
        if (variante.id.startsWith("temp-")) {
          // Crear nueva variante
          await prisma.varianteProducto.create({
            data: {
              nombre: variante.nombre,
              precio: variante.precio,
              stock: variante.stock,
              productoId: id,
            },
          })
        } else {
          // Actualizar variante existente
          await prisma.varianteProducto.update({
            where: { id: variante.id },
            data: {
              nombre: variante.nombre,
              precio: variante.precio,
              stock: variante.stock,
            },
          })
        }
      }
    } else {
      // Crear nuevo producto
      producto = await prisma.producto.create({
        data: {
          nombre,
          descripcion,
          precio,
          precioOriginal,
          precioCompra,
          stock,
          categoriaId,
          esNuevo,
          imagenes,
          modoUso,
          ingredientes,
          beneficios,
        },
      })

      // Crear etiquetas eco
      if (etiquetasEco && etiquetasEco.length > 0) {
        for (const etiqueta of etiquetasEco) {
          // Buscar o crear la etiqueta
          const etiquetaEco = await prisma.etiquetaEco.upsert({
            where: { nombre: etiqueta },
            update: {},
            create: { nombre: etiqueta },
          })

          // Asociar la etiqueta al producto
          await prisma.productoEtiquetaEco.create({
            data: {
              productoId: producto.id,
              etiquetaEcoId: etiquetaEco.id,
            },
          })
        }
      }

      // Crear variantes
      if (variantes && variantes.length > 0) {
        for (const variante of variantes) {
          await prisma.varianteProducto.create({
            data: {
              nombre: variante.nombre,
              precio: variante.precio,
              stock: variante.stock,
              productoId: producto.id,
            },
          })
        }
      }
    }

    // Revalidar rutas
    revalidatePath("/admin/productos")
    revalidatePath("/productos")
    if (id) {
      revalidatePath(`/productos/${id}`)
    }

    return producto
  } catch (error) {
    console.error("Error al guardar producto:", error)
    throw new Error("Error al guardar producto")
  }
}

// Función para eliminar un producto
export async function eliminarProducto(id: string) {
  try {
    // Verificar autenticación y permisos de administrador
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.esAdmin) {
      throw new Error("No autorizado")
    }

    // Eliminar etiquetas eco asociadas
    await prisma.productoEtiquetaEco.deleteMany({
      where: { productoId: id },
    })

    // Eliminar variantes
    await prisma.varianteProducto.deleteMany({
      where: { productoId: id },
    })

    // Eliminar el producto
    await prisma.producto.delete({
      where: { id },
    })

    // Revalidar rutas
    revalidatePath("/admin/productos")
    revalidatePath("/productos")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar producto:", error)
    throw new Error("Error al eliminar producto")
  }
}

// Función para actualizar el stock de un producto
export async function actualizarStockProducto(id: string, nuevoStock: number) {
  try {
    // Verificar autenticación y permisos de administrador
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.esAdmin) {
      throw new Error("No autorizado")
    }

    // Actualizar el stock del producto
    const producto = await prisma.producto.update({
      where: { id },
      data: {
        stock: nuevoStock,
        actualizado: new Date(),
      },
    })

    // Revalidar rutas
    revalidatePath("/admin/productos")
    revalidatePath("/productos")
    revalidatePath(`/productos/${id}`)

    return producto
  } catch (error) {
    console.error("Error al actualizar stock:", error)
    throw new Error("Error al actualizar stock")
  }
}

