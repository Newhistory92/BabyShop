import type { Usuario, SesionUsuario } from "@/types"

// Interfaz del servicio de autenticación
export interface ServicioAutenticacion {
  iniciarSesion(email: string, password: string): Promise<SesionUsuario>
  iniciarSesionConGoogle(): Promise<SesionUsuario>
  cerrarSesion(): Promise<void>
  registrarUsuario(nombre: string, email: string, password: string): Promise<Usuario>
  obtenerSesionActual(): Promise<SesionUsuario | null>
  obtenerUsuarioActual(): Promise<Usuario | null>
}

// Implementación del servicio usando NextAuth
class ServicioAutenticacionNextAuth implements ServicioAutenticacion {
  async iniciarSesion(email: string, password: string): Promise<SesionUsuario> {
    const response = await fetch("/api/auth/callback/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error("Error al iniciar sesión")
    }

    return this.obtenerSesionActual() as Promise<SesionUsuario>
  }

  async iniciarSesionConGoogle(): Promise<SesionUsuario> {
    // Redirigir a la página de autenticación de Google
    window.location.href = "/api/auth/signin/google"

    // Esta promesa nunca se resolverá debido a la redirección
    return new Promise<SesionUsuario>(() => {})
  }

  async cerrarSesion(): Promise<void> {
    await fetch("/api/auth/signout", {
      method: "POST",
    })

    window.location.href = "/"
  }

  async registrarUsuario(nombre: string, email: string, password: string): Promise<Usuario> {
    const response = await fetch("/api/auth/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al registrar usuario")
    }

    return response.json()
  }

  async obtenerSesionActual(): Promise<SesionUsuario | null> {
    const response = await fetch("/api/auth/session")

    if (!response.ok) {
      return null
    }

    const sesion = await response.json()

    if (!sesion || !sesion.user) {
      return null
    }

    return {
      usuario: {
        id: sesion.user.id,
        nombre: sesion.user.name,
        email: sesion.user.email,
        imagen: sesion.user.image,
      },
      expira: sesion.expires,
    }
  }

  async obtenerUsuarioActual(): Promise<Usuario | null> {
    const sesion = await this.obtenerSesionActual()

    if (!sesion) {
      return null
    }

    const response = await fetch(`/api/usuarios/${sesion.usuario.id}`)

    if (!response.ok) {
      return null
    }

    return response.json()
  }
}

// Exportar una instancia del servicio
export const servicioAutenticacion = new ServicioAutenticacionNextAuth()

