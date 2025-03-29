"use client"

import type React from "react"

import { Minus, Plus } from "lucide-react"

interface PropiedadesSelectorCantidad {
  cantidad: number
  setCantidad: (cantidad: number) => void
  min?: number
  max?: number
  tamano?: "pequeno" | "normal" | "grande"
  disabled?: boolean
}

export function SelectorCantidad({
  cantidad,
  setCantidad,
  min = 1,
  max = 99,
  tamano = "normal",
  disabled = false,
}: PropiedadesSelectorCantidad) {
  // Función para disminuir la cantidad
  const disminuir = () => {
    if (cantidad > min) {
      setCantidad(cantidad - 1)
    }
  }

  // Función para aumentar la cantidad
  const aumentar = () => {
    if (cantidad < max) {
      setCantidad(cantidad + 1)
    }
  }

  // Función para manejar cambios directos en el input
  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = Number.parseInt(e.target.value)
    if (!isNaN(valor)) {
      if (valor < min) {
        setCantidad(min)
      } else if (valor > max) {
        setCantidad(max)
      } else {
        setCantidad(valor)
      }
    }
  }

  // Clases según el tamaño
  const clasesTamano = {
    pequeno: {
      contenedor: "h-8",
      boton: "px-2",
      icono: "h-3 w-3",
      input: "w-8 text-xs",
    },
    normal: {
      contenedor: "h-10",
      boton: "px-3",
      icono: "h-4 w-4",
      input: "w-10 text-sm",
    },
    grande: {
      contenedor: "h-12",
      boton: "px-4",
      icono: "h-5 w-5",
      input: "w-12 text-base",
    },
  }

  const clases = clasesTamano[tamano]

  return (
    <div className={`flex items-center border rounded-md ${clases.contenedor} ${disabled ? "opacity-50" : ""}`}>
      <button
        type="button"
        className={`${clases.boton} text-gray-600 hover:text-gray-900 disabled:text-gray-300`}
        onClick={disminuir}
        disabled={disabled || cantidad <= min}
        aria-label="Disminuir cantidad"
      >
        <Minus className={clases.icono} />
      </button>
      <input
        type="text"
        value={cantidad}
        onChange={manejarCambio}
        className={`${clases.input} text-center focus:outline-none`}
        disabled={disabled}
        aria-label="Cantidad"
      />
      <button
        type="button"
        className={`${clases.boton} text-gray-600 hover:text-gray-900 disabled:text-gray-300`}
        onClick={aumentar}
        disabled={disabled || cantidad >= max}
        aria-label="Aumentar cantidad"
      >
        <Plus className={clases.icono} />
      </button>
    </div>
  )
}

