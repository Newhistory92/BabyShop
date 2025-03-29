"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAutenticacion } from "@/hooks/useAutenticacion"

export function BotonGoogle() {
  const [cargando, setCargando] = useState(false)
  const { iniciarSesionConGoogle } = useAutenticacion()

  const manejarClick = async () => {
    setCargando(true)
    try {
      await iniciarSesionConGoogle()
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error)
    } finally {
      setCargando(false)
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={manejarClick}
      disabled={cargando}
    >
      {cargando ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Image src="/google-logo.svg" alt="Google" width={18} height={18} />
      )}
      Continuar con Google
    </Button>
  )
}

