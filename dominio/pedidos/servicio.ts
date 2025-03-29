import type { Pedido, ElementoPedido, DatosPago, RespuestaPago } from "@/types"

// Interfaz del servicio de pedidos
export interface ServicioPedidos {
  obtenerPedidosUsuario(): Promise<Pedido[]>
  obtenerPedidoPorId(id: string): Promise<Pedido | null>
  crearPedido(elementos: ElementoPedido[], direccionId: string): Promise<Pedido>
  actualizarEstadoPedido(id: string, estado: string): Promise<Pedido>
  procesarPagoStripe(datosPago: DatosPago): Promise<RespuestaPago>
  procesarPagoMercadoPago(datosPago: DatosPago): Promise<RespuestaPago>
}

// Implementación del servicio
class ServicioPedidosAPI implements ServicioPedidos {
  async obtenerPedidosUsuario(): Promise<Pedido[]> {
    const response = await fetch("/api/pedidos")

    if (!response.ok) {
      throw new Error("Error al obtener pedidos")
    }

    return response.json()
  }

  async obtenerPedidoPorId(id: string): Promise<Pedido | null> {
    const response = await fetch(`/api/pedidos/${id}`)

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error("Error al obtener el pedido")
    }

    return response.json()
  }

  async crearPedido(elementos: ElementoPedido[], direccionId: string): Promise<Pedido> {
    const response = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ elementos, direccionId }),
    })

    if (!response.ok) {
      throw new Error("Error al crear el pedido")
    }

    return response.json()
  }

  async actualizarEstadoPedido(id: string, estado: string): Promise<Pedido> {
    const response = await fetch(`/api/pedidos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    })

    if (!response.ok) {
      throw new Error("Error al actualizar el estado del pedido")
    }

    return response.json()
  }

  async procesarPagoStripe(datosPago: DatosPago): Promise<RespuestaPago> {
    const response = await fetch("/api/checkout/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosPago),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Error al procesar el pago con Stripe")
    }

    return response.json()
  }

  async procesarPagoMercadoPago(datosPago: DatosPago): Promise<RespuestaPago> {
    const response = await fetch("/api/checkout/mercadopago", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosPago),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Error al procesar el pago con MercadoPago")
    }

    return response.json()
  }
}

// Exportar una instancia del servicio
export const servicioPedidos = new ServicioPedidosAPI()

