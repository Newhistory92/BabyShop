"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus } from "lucide-react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { VarianteProducto } from "@/types"

// Esquema de validación
const esquemaVariante = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  precio: z.coerce.number().min(1, "El precio debe ser mayor a 0"),
  stock: z.coerce.number().min(0, "El stock no puede ser negativo"),
})

type ValoresVariante = z.infer<typeof esquemaVariante>

interface PropiedadesVarianteProductoForm {
  onAgregarVariante: (variante: VarianteProducto) => void
}

export function VarianteProductoForm({ onAgregarVariante }: PropiedadesVarianteProductoForm) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  // Inicializar formulario
  const form = useForm<ValoresVariante>({
    resolver: zodResolver(esquemaVariante),
    defaultValues: {
      nombre: "",
      precio: 0,
      stock: 0,
    },
  })

  // Manejar envío del formulario
  const manejarEnvio = (valores: ValoresVariante) => {
    // Crear variante
    const variante: VarianteProducto = {
      id: `temp-${Date.now()}`, // ID temporal, se reemplazará en el backend
      nombre: valores.nombre,
      precio: valores.precio,
      stock: valores.stock,
      productoId: "", // Se asignará en el backend
    }

    // Agregar variante
    onAgregarVariante(variante)

    // Resetear formulario
    form.reset()

    // Ocultar formulario
    setMostrarFormulario(false)
  }

  return (
    <div>
      {mostrarFormulario ? (
        <Card>
          <CardHeader>
            <CardTitle>Nueva Variante</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(manejarEnvio)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la variante</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 50ml, Color Rojo, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="precio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Agregar Variante</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      ) : (
        <Button variant="outline" className="w-full h-24 border-dashed" onClick={() => setMostrarFormulario(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Variante
        </Button>
      )}
    </div>
  )
}

