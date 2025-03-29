"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown } from "lucide-react"

import type { Producto } from "@/types"

interface PropiedadesFichaTecnica {
  producto: Producto
}

export function FichaTecnica({ producto }: PropiedadesFichaTecnica) {
  const [seccionActiva, setSeccionActiva] = useState<string | null>("descripcion")

  // Secciones de la ficha técnica
  const secciones = [
    {
      id: "descripcion",
      titulo: "Descripción",
      contenido: producto.descripcion || "No hay descripción disponible para este producto.",
    },
    {
      id: "ingredientes",
      titulo: "Ingredientes",
      contenido: producto.ingredientes || "No hay información de ingredientes disponible para este producto.",
    },
    {
      id: "modo-uso",
      titulo: "Modo de uso",
      contenido: producto.modoUso || "No hay instrucciones de uso disponibles para este producto.",
    },
    {
      id: "beneficios",
      titulo: "Beneficios",
      contenido: (
        <ul className="space-y-2">
          {producto.beneficios?.map((beneficio, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
              <span>{beneficio}</span>
            </li>
          )) || <li>No hay información de beneficios disponible para este producto.</li>}
        </ul>
      ),
    },
  ]

  // Alternar sección activa
  const alternarSeccion = (id: string) => {
    setSeccionActiva(seccionActiva === id ? null : id)
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="divide-y">
        {secciones.map((seccion) => (
          <div key={seccion.id} className="border-b last:border-b-0">
            <button
              className="flex w-full items-center justify-between px-4 py-4 text-left font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
              onClick={() => alternarSeccion(seccion.id)}
              aria-expanded={seccionActiva === seccion.id}
              aria-controls={`contenido-${seccion.id}`}
            >
              <span>{seccion.titulo}</span>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  seccionActiva === seccion.id ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {seccionActiva === seccion.id && (
                <motion.div
                  id={`contenido-${seccion.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-0 text-gray-700">
                    {typeof seccion.contenido === "string" ? (
                      <div className="prose prose-sm max-w-none">
                        {seccion.contenido.split("\n").map((parrafo, idx) => (
                          <p key={idx} className="mb-2 last:mb-0">
                            {parrafo}
                          </p>
                        ))}
                      </div>
                    ) : (
                      seccion.contenido
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

