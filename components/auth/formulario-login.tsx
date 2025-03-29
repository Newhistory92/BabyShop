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
const esquemaLogin = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
})

type ValoresLogin = z.infer<typeof esquemaLogin>

export function FormularioLogin() {
  const [cargando, setCargando] = useState(false)
  const { iniciarSesion } = useAutenticacion()
  const { toast } = useToast()

  // Inicializar formulario
  const form = useForm<ValoresLogin>({
    resolver: zodResolver(esquemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Manejar envío del formulario
  const manejarEnvio = async (valores: ValoresLogin) => {
    setCargando(true)

    try {
      const resultado = await iniciarSesion(valores.email, valores.password)

      if (!resultado) {
        toast({
          title: "Error al iniciar sesión",
          description: "Email o contraseña incorrectos",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error al iniciar sesión",
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

        <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={cargando}>
          {cargando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </form>
    </Form>
  )
}

