"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, QrCode, Check, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { actualizarEstadoPedido } from "@/acciones/admin/pedidos"

export function EscanerCodigoBarras() {
  const router = useRouter()
  const [codigoEscaneado, setCodigoEscaneado] = useState("")
  const [escaneando, setEscaneando] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error" | "info"; texto: string } | null>(null)
  const [cargando, setCargando] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Simular escaneo de código de barras
  const iniciarEscaneo = () => {
    setEscaneando(true)
    setMensaje({ tipo: "info", texto: "Escaneando código de barras..." })

    // Enfocar el input
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Detener escaneo
  const detenerEscaneo = () => {
    setEscaneando(false)
    setMensaje(null)
  }

  // Procesar código escaneado
  const procesarCodigo = async () => {
    if (!codigoEscaneado) return

    setCargando(true)
    setMensaje({ tipo: "info", texto: "Procesando código..." })

    try {
      // Actualizar estado del pedido a ENTREGADO
      await actualizarEstadoPedido(codigoEscaneado, "ENTREGADO")

      setMensaje({
        tipo: "exito",
        texto: `Pedido ${codigoEscaneado.slice(0, 8)} marcado como ENTREGADO`,
      })

      // Limpiar código
      setCodigoEscaneado("")

      // Refrescar la página para mostrar los cambios
      router.refresh()
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: "Error al procesar el código. Pedido no encontrado o no se puede actualizar.",
      })
    } finally {
      setCargando(false)
      setEscaneando(false)
    }
  }

  // Manejar cambio en el input
  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodigoEscaneado(e.target.value)
  }

  // Manejar envío del formulario
  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault()
    procesarCodigo()
  }

  // Detectar cuando se presiona Enter
  useEffect(() => {
    const manejarKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && codigoEscaneado) {
        procesarCodigo()
      }
    }

    window.addEventListener("keydown", manejarKeyDown)

    return () => {
      window.removeEventListener("keydown", manejarKeyDown)
    }
  }, [codigoEscaneado])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <form onSubmit={manejarEnvio} className="flex gap-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Escanea o ingresa el código del pedido"
              value={codigoEscaneado}
              onChange={manejarCambio}
              disabled={cargando}
              className="flex-1"
            />
            <Button type="submit" disabled={!codigoEscaneado || cargando}>
              {cargando ? <Loader2 className="h-4 w-4 animate-spin" /> : "Procesar"}
            </Button>
          </form>
        </div>

        <Button
          variant={escaneando ? "destructive" : "default"}
          onClick={escaneando ? detenerEscaneo : iniciarEscaneo}
          className="sm:w-auto w-full"
        >
          <QrCode className="h-4 w-4 mr-2" />
          {escaneando ? "Detener Escaneo" : "Iniciar Escaneo"}
        </Button>
      </div>

      {mensaje && (
        <div
          className={`p-3 rounded-md flex items-center gap-2 ${
            mensaje.tipo === "exito"
              ? "bg-green-50 text-green-700"
              : mensaje.tipo === "error"
                ? "bg-red-50 text-red-700"
                : "bg-blue-50 text-blue-700"
          }`}
        >
          {mensaje.tipo === "exito" ? (
            <Check className="h-5 w-5 flex-shrink-0" />
          ) : mensaje.tipo === "error" ? (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <Loader2 className="h-5 w-5 flex-shrink-0 animate-spin" />
          )}
          <span>{mensaje.texto}</span>
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        <p>Escanea el código de barras de un pedido para marcarlo como entregado automáticamente.</p>
        <p className="mt-1">También puedes ingresar el ID del pedido manualmente y hacer clic en "Procesar".</p>
      </div>
    </div>
  )
}

