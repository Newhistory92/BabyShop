"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Loader2 } from "lucide-react"

interface PropiedadesImagenProductoUpload {
  onImagenCargada: (url: string) => void
}

export function ImagenProductoUpload({ onImagenCargada }: PropiedadesImagenProductoUpload) {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Función para cargar imagen
  const cargarImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen")
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe superar los 5MB")
      return
    }

    setCargando(true)
    setError(null)

    try {
      // Crear FormData
      const formData = new FormData()
      formData.append("file", file)

      // Enviar imagen al servidor
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error al cargar la imagen")
      }

      const data = await response.json()

      // Llamar al callback con la URL de la imagen
      onImagenCargada(data.url)
    } catch (error) {
      console.error("Error al cargar imagen:", error)
      setError("Error al cargar la imagen. Intenta nuevamente.")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="relative aspect-square rounded-md border border-dashed flex flex-col items-center justify-center">
      <input
        type="file"
        accept="image/*"
        onChange={cargarImagen}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={cargando}
      />
      <div className="flex flex-col items-center justify-center p-4 text-center">
        {cargando ? (
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Haz clic para subir</p>
          </>
        )}
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  )
}

