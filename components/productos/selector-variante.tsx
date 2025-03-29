"use client"

import type { VarianteProducto } from "@/types"
import { formatearPrecio } from "@/lib/utils"

interface PropiedadesSelectorVariante {
  variantes: VarianteProducto[]
  varianteSeleccionada: string | null
  setVarianteSeleccionada: (id: string) => void
  disabled?: boolean
}

export function SelectorVariante({
  variantes,
  varianteSeleccionada,
  setVarianteSeleccionada,
  disabled = false,
}: PropiedadesSelectorVariante) {
  if (!variantes || variantes.length === 0) {
    return null
  }

  return (
    <div className={disabled ? "opacity-50" : ""}>
      <h3 className="text-sm font-medium mb-3">Variante</h3>
      <div className="flex flex-wrap gap-2">
        {variantes.map((variante) => (
          <button
            key={variante.id}
            type="button"
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              varianteSeleccionada === variante.id
                ? "bg-green-700 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setVarianteSeleccionada(variante.id)}
            disabled={disabled || variante.stock <= 0}
          >
            <span className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span>{variante.nombre}</span>
              <span className="text-xs sm:ml-1 sm:text-sm">{formatearPrecio(variante.precio)}</span>
            </span>
            {variante.stock <= 0 && <span className="block text-xs text-red-500 mt-1">Agotado</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

