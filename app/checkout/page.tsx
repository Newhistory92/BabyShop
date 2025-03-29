"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { Migas } from "@/components/ui/migas"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FormularioDireccion } from "@/components/checkout/formulario-direccion"
import { SelectorMetodoPago } from "@/components/checkout/selector-metodo-pago"
import { ResumenPedido } from "@/components/checkout/resumen-pedido"
import { useCarrito } from "@/hooks/useCarrito"
import { useAutenticacion } from "@/hooks/useAutenticacion"
import { useDirecciones } from "@/hooks/useDirecciones"
import { useProcesarPago } from "@/hooks/usePedidos"
import { useToast } from "@/components/ui/use-toast"
import type { Direccion } from "@/types"

export default function PaginaCheckout() {
  const router = useRouter()
  const { elementosCarrito, totalCarrito, vaciarCarrito } = useCarrito()
  const { sesion, usuario } = useAutenticacion()
  const { direcciones, direccionPrincipal, agregarDireccion, cargando: cargandoDirecciones } = useDirecciones()
  const { procesarPagoStripe, procesarPagoMercadoPago, cargando: cargandoPago } = useProcesarPago()
  const { toast } = useToast()

  // Estados
  const [pasoActual, setPasoActual] = useState<string>("direccion")
  const [direccionSeleccionada, setDireccionSeleccionada] = useState<string | null>(null)
  const [direccionInvitado, setDireccionInvitado] = useState<Direccion | null>(null)
  const [metodoPago, setMetodoPago] = useState<string>("stripe")
  const [codigoDescuento, setCodigoDescuento] = useState<string>("")
  const [descuento, setDescuento] = useState<number>(0)
  const [cargandoDescuento, setCargandoDescuento] = useState<boolean>(false)
  const [mensajeDescuento, setMensajeDescuento] = useState<string>("")
  const [errorDescuento, setErrorDescuento] = useState<string>("")

  // Calcular costos
  const subtotal = totalCarrito
  const costoEnvio = subtotal > 5000 ? 0 : 499
  const total = subtotal - descuento + costoEnvio

  // Métodos de pago disponibles
  const metodosPago = [
    {
      id: "stripe",
      nombre: "Tarjeta de crédito/débito",
      descripcion: "Pago seguro con Stripe",
      logo: "/payment/stripe.svg",
    },
    {
      id: "mercadopago",
      nombre: "MercadoPago",
      descripcion: "Pago con MercadoPago",
      logo: "/payment/mercadopago.svg",
    },
  ]

  // Verificar si hay elementos en el carrito
  useEffect(() => {
    if (elementosCarrito.length === 0) {
      router.push("/carrito")
    }
  }, [elementosCarrito, router])

  // Establecer dirección principal como seleccionada
  useEffect(() => {
    if (direccionPrincipal && !direccionSeleccionada) {
      setDireccionSeleccionada(direccionPrincipal.id)
    }
  }, [direccionPrincipal, direccionSeleccionada])

  // Función para aplicar código de descuento
  const aplicarDescuento = () => {
    if (!codigoDescuento) return

    setCargandoDescuento(true)
    setErrorDescuento("")
    setMensajeDescuento("")

    // Simular verificación de código (en producción, esto sería una llamada a la API)
    setTimeout(() => {
      if (codigoDescuento.toLowerCase() === "eco20") {
        const montoDescuento = Math.round(subtotal * 0.2)
        setDescuento(montoDescuento)
        setMensajeDescuento("¡Código aplicado! 20% de descuento")
      } else {
        setErrorDescuento("Código de descuento inválido")
      }
      setCargandoDescuento(false)
    }, 1000)
  }

  // Función para procesar el pago
  const procesarPago = async () => {
    // Verificar si hay dirección seleccionada
    if (!direccionSeleccionada && !direccionInvitado) {
      toast({
        title: "Error",
        description: "Por favor selecciona una dirección de envío",
        variant: "destructive",
      })
      return
    }

    try {
      let respuesta

      if (metodoPago === "stripe") {
        respuesta = await procesarPagoStripe({
          elementos: elementosCarrito,
          direccionEnvioId: direccionSeleccionada || "invitado",
          direccionInvitado: direccionInvitado,
          descuento,
        })
      } else {
        respuesta = await procesarPagoMercadoPago({
          elementos: elementosCarrito,
          direccionEnvioId: direccionSeleccionada || "invitado",
          direccionInvitado: direccionInvitado,
          descuento,
        })
      }

      if (respuesta.error) {
        toast({
          title: "Error al procesar el pago",
          description: respuesta.error,
          variant: "destructive",
        })
        return
      }

      // Redirigir a la página de pago
      if (respuesta.url) {
        vaciarCarrito()
        window.location.href = respuesta.url
      } else if (respuesta.punto_inicio) {
        vaciarCarrito()
        window.location.href = respuesta.punto_inicio
      }
    } catch (error: any) {
      toast({
        title: "Error al procesar el pago",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      })
    }
  }

  // Función para manejar el envío del formulario de dirección
  const manejarEnvioDireccion = (valores: any) => {
    if (sesion) {
      // Usuario registrado
      agregarDireccion(valores)
    } else {
      // Usuario invitado
      setDireccionInvitado(valores)
    }

    // Avanzar al siguiente paso
    setPasoActual("pago")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Migas de pan */}
      <Migas
        items={[
          { label: "Inicio", href: "/" },
          { label: "Carrito", href: "/carrito" },
          { label: "Checkout", href: "/checkout", activo: true },
        ]}
      />

      <h1 className="text-3xl font-bold mt-6 mb-8">Finalizar compra</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Formulario de checkout */}
        <div className="md:col-span-2">
          <Tabs value={pasoActual} onValueChange={setPasoActual}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="direccion">1. Dirección</TabsTrigger>
              <TabsTrigger value="pago" disabled={!direccionSeleccionada && !direccionInvitado}>
                2. Pago
              </TabsTrigger>
            </TabsList>

            <TabsContent value="direccion" className="pt-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {sesion ? (
                  // Usuario registrado
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Dirección de envío</h2>

                    {/* Direcciones guardadas */}
                    {direcciones.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Direcciones guardadas</h3>
                        <div className="grid gap-4">
                          {direcciones.map((direccion) => (
                            <div
                              key={direccion.id}
                              className={`relative flex items-center rounded-lg border p-4 cursor-pointer transition-colors ${
                                direccionSeleccionada === direccion.id
                                  ? "border-green-700 bg-green-50"
                                  : "border-gray-200 hover:border-green-200 hover:bg-green-50/50"
                              }`}
                              onClick={() => setDireccionSeleccionada(direccion.id)}
                            >
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium">{direccion.nombre}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {direccion.calle} {direccion.numero}
                                  {direccion.departamento ? `, ${direccion.departamento}` : ""}, {direccion.ciudad},{" "}
                                  {direccion.provincia}, {direccion.codigoPostal}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{direccion.telefono}</p>
                              </div>
                              <div
                                className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                                  direccionSeleccionada === direccion.id
                                    ? "border-green-700 bg-green-700 text-white"
                                    : "border-gray-300"
                                }`}
                              >
                                {direccionSeleccionada === direccion.id && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Agregar nueva dirección */}
                    <div className="mt-6 border-t pt-6">
                      <h3 className="text-sm font-medium mb-4">Agregar nueva dirección</h3>
                      <FormularioDireccion alEnviar={manejarEnvioDireccion} cargando={cargandoDirecciones} />
                    </div>
                  </div>
                ) : (
                  // Usuario invitado
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Información de envío</h2>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                      <p className="text-sm text-blue-800">
                        ¿Ya tienes una cuenta?{" "}
                        <Button
                          variant="link"
                          className="p-0 h-auto text-blue-800 underline"
                          onClick={() => router.push("/auth/iniciar-sesion?redirect=/checkout")}
                        >
                          Inicia sesión
                        </Button>{" "}
                        o{" "}
                        <Button
                          variant="link"
                          className="p-0 h-auto text-blue-800 underline"
                          onClick={() => router.push("/auth/asociate?redirect=/checkout")}
                        >
                          Asóciate
                        </Button>{" "}
                        para guardar tus datos y agilizar futuras compras.
                      </p>
                    </div>

                    <FormularioDireccion alEnviar={manejarEnvioDireccion} />
                  </div>
                )}

                {/* Botón para continuar */}
                {(direccionSeleccionada || direccionInvitado) && (
                  <div className="mt-8">
                    <Button className="w-full bg-green-700 hover:bg-green-800" onClick={() => setPasoActual("pago")}>
                      Continuar al pago
                    </Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="pago" className="pt-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Método de pago</h2>

                  <SelectorMetodoPago
                    metodos={metodosPago}
                    metodoSeleccionado={metodoPago}
                    onSeleccionarMetodo={setMetodoPago}
                    disabled={cargandoPago}
                  />

                  <div className="mt-8">
                    <Button
                      className="w-full bg-green-700 hover:bg-green-800"
                      onClick={procesarPago}
                      disabled={cargandoPago}
                    >
                      {cargandoPago ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                          Procesando...
                        </>
                      ) : (
                        `Pagar ${metodoPago === "stripe" ? "con tarjeta" : "con MercadoPago"}`
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                      Al hacer clic en "Pagar", serás redirigido a la plataforma de pago seguro para completar tu
                      compra.
                    </p>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Resumen del pedido */}
        <div className="md:col-span-1">
          <ResumenPedido
            elementos={elementosCarrito}
            subtotal={subtotal}
            descuento={descuento}
            costoEnvio={costoEnvio}
            total={total}
            codigoDescuento={codigoDescuento}
            setCodigoDescuento={setCodigoDescuento}
            aplicarDescuento={aplicarDescuento}
            cargandoDescuento={cargandoDescuento}
            mensajeDescuento={mensajeDescuento}
            errorDescuento={errorDescuento}
          />
        </div>
      </div>
    </div>
  )
}

