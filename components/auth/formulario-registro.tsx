"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAutenticacion } from "@/hooks/useAutenticacion"
import { useToast } from "@/components/ui/use-toast"

// Esquema de validación
const esquemaRegistro = z
  .object({
    nombre: z.string().min(1, "El nombre es requerido"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmarPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmarPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarPassword"],
  })

type ValoresRegistro = z.infer<typeof esquemaRegistro>

export function FormularioRegistro() {
  const [cargando, setCargando] = useState(false)
  const { registrarUsuario } = useAutenticacion()
  const { toast } = useToast()

  // Inicializar formulario
  const form = useForm<ValoresRegistro>({
    resolver: zodResolver(esquemaRegistro),
    defaultValues: {
      nombre: "",
      email: "",
      password: "",
      confirmarPassword: "",
    },
  })

  // Manejar envío del formulario
  const manejarEnvio = async (valores: ValoresRegistro) => {
    setCargando(true)

    try {
      const resultado = await registrarUsuario(valores.nombre, valores.email, valores.password)

      if (resultado) {
        toast({
          title: "¡Registro exitoso!",
          description: "Tu cuenta ha sido creada correctamente.",
        })
      } else {
        toast({
          title: "Error al registrarse",
          description: "No se pudo crear la cuenta. Intenta nuevamente.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error al registrarse",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setCargando(false)
    }
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

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="tu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmarPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={cargando}>
          {cargando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando cuenta...
            </>
          ) : (
            "Crear cuenta"
          )}
        </Button>
      </form>
    </Form>
  )
}

