"use client"

import { useState } from "react"

import useSWR from "swr"
import { useOptimistic } from "react"
import { servicioPedidos } from "@/dominio/pedidos/servicio"
import type { Pedido, DatosPago, ActualizacionOptimista } from "@/types"

// Hook para obtener los pedidos del usuario
export function usePedidos() {
  const { data, error, isLoading, mutate } = useSWR<Pedido[]>("/api/pedidos", async () => {
    try {
      return await servicioPedidos.obtenerPedidosUsuario()
    } catch (error) {
      console.error("Error al obtener pedidos:", error)
      return []
    }
  })

  return {
    pedidos: data || [],
    error,
    cargando: isLoading,
    recargar: mutate,
  }
}

// Hook para obtener un pedido específico
export function usePedido(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Pedido | null>(id ? `/api/pedidos/${id}` : null, async () => {
    try {
      return await servicioPedidos.obtenerPedidoPorId(id)
    } catch (error) {
      console.error(`Error al obtener el pedido ${id}:`, error)
      return null
    }
  })

  // Usar useOptimistic para actualizar el estado del pedido inmediatamente
  const [pedidoOptimista, actualizarPedidoOptimista] = useOptimistic(
    data,
    (estado: Pedido | null, actualizacion: ActualizacionOptimista<Partial<Pedido>>) => {
      if (!estado || actualizacion.accion !== "actualizar") return estado

      return {
        ...estado,
        ...actualizacion.datos,
      }
    },
  )

  // Función para actualizar el estado del pedido
  const actualizarEstado = async (nuevoEstado: string) => {
    if (!data) return null

    // Actualizar optimistamente
    actualizarPedidoOptimista({
      accion: "actualizar",
      datos: { estado: nuevoEstado as any },
    })

    try {
      const pedidoActualizado = await servicioPedidos.actualizarEstadoPedido(id, nuevoEstado)
      mutate(pedidoActualizado)
      return pedidoActualizado
    } catch (error) {
      console.error(`Error al actualizar el estado del pedido ${id}:`, error)
      // Revertir la actualización optimista recargando los datos
      mutate()
      return null
    }
  }

  return {
    pedido: pedidoOptimista,
    error,
    cargando: isLoading,
    recargar: mutate,
    actualizarEstado,
  }
}

// Hook para procesar pagos
export function useProcesarPago() {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Función para procesar pago con Stripe
  const procesarPagoStripe = async (datosPago: DatosPago) => {
    setCargando(true)
    setError(null)

    try {
      const respuesta = await servicioPedidos.procesarPagoStripe(datosPago)
      return respuesta
    } catch (err: any) {
      setError(err.message || "Error al procesar el pago con Stripe")
      return { error: err.message }
    } finally {
      setCargando(false)
    }
  }

  // Función para procesar pago con MercadoPago
  const procesarPagoMercadoPago = async (datosPago: DatosPago) => {
    setCargando(true)
    setError(null)

    try {
      const respuesta = await servicioPedidos.procesarPagoMercadoPago(datosPago)
      return respuesta
    } catch (err: any) {
      setError(err.message || "Error al procesar el pago con MercadoPago")
      return { error: err.message }
    } finally {
      setCargando(false)
    }
  }

  return {
    procesarPagoStripe,
    procesarPagoMercadoPago,
    cargando,
    error,
  }
}

