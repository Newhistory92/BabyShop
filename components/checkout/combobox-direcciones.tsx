"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Direccion } from "@/types"

interface PropiedadesComboboxDirecciones {
  onSelect: (direccion: Direccion) => void
  buscarDirecciones: (termino: string) => Promise<Direccion[]>
  cargando?: boolean
}

export function ComboboxDirecciones({ onSelect, buscarDirecciones, cargando = false }: PropiedadesComboboxDirecciones) {
  const [abierto, setAbierto] = useState(false)
  const [valor, setValor] = useState("")
  const [direcciones, setDirecciones] = useState<Direccion[]>([])
  const [buscando, setBuscando] = useState(false)

  // Buscar direcciones cuando cambia el valor
  useEffect(() => {
    const buscar = async () => {
      if (valor.length < 3) {
        setDirecciones([])
        return
      }

      setBuscando(true)
      try {
        const resultados = await buscarDirecciones(valor)
        setDirecciones(resultados)
      } catch (error) {
        console.error("Error al buscar direcciones:", error)
        setDirecciones([])
      } finally {
        setBuscando(false)
      }
    }

    const timeoutId = setTimeout(buscar, 300)

    return () => clearTimeout(timeoutId)
  }, [valor, buscarDirecciones])

  return (
    <Popover open={abierto} onOpenChange={setAbierto}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={abierto}
          className="w-full justify-between"
          disabled={cargando}
        >
          {valor ? valor : "Buscar dirección..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Ingresa calle, número, ciudad..." value={valor} onValueChange={setValor} />
          <CommandList>
            <CommandEmpty>
              {buscando ? (
                <div className="flex items-center justify-center py-6">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-700 border-t-transparent" />
                </div>
              ) : valor.length < 3 ? (
                "Ingresa al menos 3 caracteres para buscar"
              ) : (
                "No se encontraron direcciones"
              )}
            </CommandEmpty>
            <CommandGroup>
              {direcciones.map((direccion) => (
                <CommandItem
                  key={`${direccion.calle}-${direccion.numero}-${direccion.ciudad}`}
                  value={`${direccion.calle} ${direccion.numero}, ${direccion.ciudad}`}
                  onSelect={() => {
                    setValor(`${direccion.calle} ${direccion.numero}, ${direccion.ciudad}`)
                    onSelect(direccion)
                    setAbierto(false)
                  }}
                >
                  <MapPin className="mr-2 h-4 w-4 text-green-700" />
                  <span className="flex-1 truncate">
                    {direccion.calle} {direccion.numero}, {direccion.ciudad}, {direccion.provincia}
                  </span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      valor === `${direccion.calle} ${direccion.numero}, ${direccion.ciudad}`
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

