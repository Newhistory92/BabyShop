"use client"
import Image from "next/image"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

interface MetodoPago {
  id: string
  nombre: string
  descripcion: string
  logo: string
}

interface PropiedadesSelectorMetodoPago {
  metodos: MetodoPago[]
  metodoSeleccionado: string
  onSeleccionarMetodo: (id: string) => void
  disabled?: boolean
}

export function SelectorMetodoPago({
  metodos,
  metodoSeleccionado,
  onSeleccionarMetodo,
  disabled = false,
}: PropiedadesSelectorMetodoPago) {
  return (
    <div className={cn("space-y-4", disabled && "opacity-50")}>
      <div className="grid grid-cols-1 gap-4">
        {metodos.map((metodo) => (
          <div
            key={metodo.id}
            className={cn(
              "relative flex items-center rounded-lg border p-4 cursor-pointer transition-colors",
              metodoSeleccionado === metodo.id
                ? "border-green-700 bg-green-50"
                : "border-gray-200 hover:border-green-200 hover:bg-green-50/50",
            )}
            onClick={() => !disabled && onSeleccionarMetodo(metodo.id)}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center">
                <div className="h-10 w-16 flex items-center justify-center mr-3">
                  <Image
                    src={metodo.logo || "/placeholder.svg"}
                    alt={metodo.nombre}
                    width={64}
                    height={40}
                    className="max-h-10 w-auto object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{metodo.nombre}</p>
                  <p className="text-xs text-gray-500">{metodo.descripcion}</p>
                </div>
              </div>
            </div>
            <div
              className={cn(
                "h-5 w-5 rounded-full border flex items-center justify-center",
                metodoSeleccionado === metodo.id ? "border-green-700 bg-green-700 text-white" : "border-gray-300",
              )}
            >
              {metodoSeleccionado === metodo.id && <Check className="h-3 w-3" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

