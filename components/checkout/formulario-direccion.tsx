"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Direccion } from "@/types"
import { useDirecciones } from "@/hooks/useDirecciones"
import { ComboboxDirecciones } from "@/components/checkout/combobox-direcciones"

// Esquema de validación
const esquemaDireccion = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  calle: z.string().min(1, "La calle es requerida"),
  numero: z.string().min(1, "El número es requerido"),
  departamento: z.string().optional(),
  ciudad: z.string().min(1, "La ciudad es requerida"),
  provincia: z.string().min(1, "La provincia es requerida"),
  codigoPostal: z.string().min(1, "El código postal es requerido"),
  pais: z.string().min(1, "El país es requerido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  esPrincipal: z.boolean().default(false),
})

type ValoresDireccion = z.infer<typeof esquemaDireccion>

interface PropiedadesFormularioDireccion {
  direccionInicial?: Direccion
  alEnviar: (direccion: ValoresDireccion) => void
  cargando?: boolean
  mostrarGuardar?: boolean
}

export function FormularioDireccion({
  direccionInicial,
  alEnviar,
  cargando = false,
  mostrarGuardar = true,
}: PropiedadesFormularioDireccion) {
  const [usarAutocompletado, setUsarAutocompletado] = useState(true)
  const { buscarDireccionesPorTermino, cargando: cargandoDirecciones } = useDirecciones()

  // Inicializar formulario
  const form = useForm<ValoresDireccion>({
    resolver: zodResolver(esquemaDireccion),
    defaultValues: direccionInicial || {
      nombre: "",
      calle: "",
      numero: "",
      departamento: "",
      ciudad: "",
      provincia: "",
      codigoPostal: "",
      pais: "Argentina",
      telefono: "",
      esPrincipal: false,
    },
  })

  // Actualizar valores del formulario cuando cambia la dirección inicial
  useEffect(() => {
    if (direccionInicial) {
      form.reset(direccionInicial)
    }
  }, [direccionInicial, form])

  // Manejar envío del formulario
  const manejarEnvio = (valores: ValoresDireccion) => {
    alEnviar(valores)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(manejarEnvio)} className="space-y-4">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder="Nombre y apellido" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Dirección de envío</h3>
          <Button
            type="button"
            variant="link"
            className="text-xs text-green-700 p-0 h-auto"
            onClick={() => setUsarAutocompletado(!usarAutocompletado)}
          >
            {usarAutocompletado ? "Ingresar manualmente" : "Usar autocompletado"}
          </Button>
        </div>

        {usarAutocompletado ? (
          <div className="space-y-4">
            <ComboboxDirecciones
              onSelect={(direccion) => {
                form.setValue("calle", direccion.calle)
                form.setValue("numero", direccion.numero)
                form.setValue("ciudad", direccion.ciudad)
                form.setValue("provincia", direccion.provincia)
                form.setValue("codigoPostal", direccion.codigoPostal)
                form.setValue("pais", direccion.pais)
              }}
              buscarDirecciones={buscarDireccionesPorTermino}
              cargando={cargandoDirecciones}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Piso, depto, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Teléfono de contacto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="calle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calle</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de la calle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="Número" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="departamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Depto (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Piso, depto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ciudad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <FormControl>
                      <Input placeholder="Ciudad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="provincia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provincia</FormLabel>
                    <FormControl>
                      <Input placeholder="Provincia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="codigoPostal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Postal</FormLabel>
                    <FormControl>
                      <Input placeholder="Código postal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Teléfono de contacto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="pais"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <FormControl>
                    <Input placeholder="País" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {mostrarGuardar && (
          <div className="pt-4">
            <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={cargando}>
              {cargando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar dirección"
              )}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}

