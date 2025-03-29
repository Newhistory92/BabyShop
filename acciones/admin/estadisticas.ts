"use server"

import { prisma } from "@/lib/prisma"
import { formatearPrecio } from "@/lib/utils"

// Función para obtener estadísticas del panel de administración
export async function obtenerEstadisticasAdmin(periodo: "diario" | "semanal" | "mensual" | "anual") {
  try {
    // Definir fechas según el período
    const fechaActual = new Date()
    let fechaInicio: Date
    let fechaAnteriorInicio: Date
    let fechaAnteriorFin: Date
    let labels: string[] = []

    switch (periodo) {
      case "diario":
        // Hoy
        fechaInicio = new Date(fechaActual.setHours(0, 0, 0, 0))
        // Ayer
        fechaAnteriorInicio = new Date(fechaInicio)
        fechaAnteriorInicio.setDate(fechaAnteriorInicio.getDate() - 1)
        fechaAnteriorFin = new Date(fechaInicio)
        // Etiquetas para las horas del día
        labels = Array.from({ length: 24 }, (_, i) => `${i}:00`)
        break
      case "semanal":
        // Esta semana (últimos 7 días)
        fechaInicio = new Date(fechaActual)
        fechaInicio.setDate(fechaInicio.getDate() - 6)
        fechaInicio.setHours(0, 0, 0, 0)
        // Semana anterior
        fechaAnteriorInicio = new Date(fechaInicio)
        fechaAnteriorInicio.setDate(fechaAnteriorInicio.getDate() - 7)
        fechaAnteriorFin = new Date(fechaInicio)
        fechaAnteriorFin.setDate(fechaAnteriorFin.getDate() - 1)
        fechaAnteriorFin.setHours(23, 59, 59, 999)
        // Etiquetas para los días de la semana
        const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
        const fechaTemp = new Date(fechaInicio)
        labels = Array.from({ length: 7 }, () => {
          const dia = diasSemana[fechaTemp.getDay()]
          fechaTemp.setDate(fechaTemp.getDate() + 1)
          return dia
        })
        break
      case "mensual":
        // Este mes
        fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1)
        // Mes anterior
        fechaAnteriorInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1)
        fechaAnteriorFin = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 0, 23, 59, 59, 999)
        // Etiquetas para las semanas del mes
        labels = ["Semana 1", "Semana 2", "Semana 3", "Semana 4", "Semana 5"]
        break
      case "anual":
        // Este año
        fechaInicio = new Date(fechaActual.getFullYear(), 0, 1)
        // Año anterior
        fechaAnteriorInicio = new Date(fechaActual.getFullYear() - 1, 0, 1)
        fechaAnteriorFin = new Date(fechaActual.getFullYear() - 1, 11, 31, 23, 59, 59, 999)
        // Etiquetas para los meses del año
        labels = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ]
        break
      default:
        fechaInicio = new Date(fechaActual.setHours(0, 0, 0, 0))
        fechaAnteriorInicio = new Date(fechaInicio)
        fechaAnteriorInicio.setDate(fechaAnteriorInicio.getDate() - 1)
        fechaAnteriorFin = new Date(fechaInicio)
        labels = Array.from({ length: 24 }, (_, i) => `${i}:00`)
    }

    // Obtener pedidos del período actual
    const pedidosActuales = await prisma.pedido.findMany({
      where: {
        creado: {
          gte: fechaInicio,
        },
        estado: {
          not: "CANCELADO",
        },
      },
      include: {
        elementosPedido: true,
        usuario: true,
      },
    })

    // Obtener pedidos del período anterior
    const pedidosAnteriores = await prisma.pedido.findMany({
      where: {
        creado: {
          gte: fechaAnteriorInicio,
          lte: fechaAnteriorFin,
        },
        estado: {
          not: "CANCELADO",
        },
      },
    })

    // Calcular estadísticas
    const totalVentas = pedidosActuales.reduce((sum, pedido) => sum + pedido.total, 0)
    const totalVentasAnterior = pedidosAnteriores.reduce((sum, pedido) => sum + pedido.total, 0)

    const totalPedidos = pedidosActuales.length
    const totalPedidosAnterior = pedidosAnteriores.length

    // Obtener usuarios nuevos del período actual
    const clientesNuevos = await prisma.usuario.count({
      where: {
        creado: {
          gte: fechaInicio,
        },
      },
    })

    // Obtener usuarios nuevos del período anterior
    const clientesNuevosAnterior = await prisma.usuario.count({
      where: {
        creado: {
          gte: fechaAnteriorInicio,
          lte: fechaAnteriorFin,
        },
      },
    })

    // Calcular ganancia (asumiendo un margen del 40% sobre las ventas)
    const ganancia = totalVentas * 0.4
    const gananciaAnterior = totalVentasAnterior * 0.4

    // Calcular porcentajes de cambio
    const porcentajeCambioVentas =
      totalVentasAnterior === 0 ? 100 : Math.round(((totalVentas - totalVentasAnterior) / totalVentasAnterior) * 100)

    const porcentajeCambioPedidos =
      totalPedidosAnterior === 0
        ? 100
        : Math.round(((totalPedidos - totalPedidosAnterior) / totalPedidosAnterior) * 100)

    const porcentajeCambioClientes =
      clientesNuevosAnterior === 0
        ? 100
        : Math.round(((clientesNuevos - clientesNuevosAnterior) / clientesNuevosAnterior) * 100)

    const porcentajeCambioGanancia =
      gananciaAnterior === 0 ? 100 : Math.round(((ganancia - gananciaAnterior) / gananciaAnterior) * 100)

    // Generar datos para el gráfico
    // Simplificado para este ejemplo, en producción se generarían datos más precisos
    const datosGrafico = {
      labels,
      ventas: Array.from({ length: labels.length }, () => Math.floor(Math.random() * 10000)),
      pedidos: Array.from({ length: labels.length }, () => Math.floor(Math.random() * 10)),
    }

    // Obtener productos más vendidos
    const productoIds = pedidosActuales.flatMap((pedido) => pedido.elementosPedido.map((item) => item.productoId))

    const conteoProductos = productoIds.reduce(
      (acc, id) => {
        acc[id] = (acc[id] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topProductoIds = Object.entries(conteoProductos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id)

    const productosMasVendidos = await Promise.all(
      topProductoIds.map(async (id) => {
        const producto = await prisma.producto.findUnique({
          where: { id },
        })

        if (!producto) return null

        const cantidadVendida = conteoProductos[id]
        const ingresos = producto.precio * cantidadVendida

        return {
          id: producto.id,
          nombre: producto.nombre,
          imagen: producto.imagenes[0] || "/placeholder.svg",
          precio: producto.precio,
          cantidadVendida,
          ingresos,
        }
      }),
    ).then((productos) => productos.filter(Boolean) as any[])

    return {
      totalVentas: formatearPrecio(totalVentas),
      totalPedidos,
      clientesNuevos,
      ganancia: formatearPrecio(ganancia),
      porcentajeCambioVentas,
      porcentajeCambioPedidos,
      porcentajeCambioClientes,
      porcentajeCambioGanancia,
      datosGrafico,
      productosMasVendidos,
    }
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    throw new Error("Error al obtener estadísticas")
  }
}

