import { getServerSession } from "next-auth/next"
import { opcionesAutenticacion } from "./opcionesAutenticacion"

export async function verificarAutenticacion(request?: Request) {
  const sesion = await getServerSession(opcionesAutenticacion)

  if (!sesion?.user) {
    return null
  }

  return {
    usuario: {
      id: sesion.user.id,
      nombre: sesion.user.name,
      email: sesion.user.email,
      imagen: sesion.user.image,
      esAdmin: sesion.user.esAdmin || false,
    },
  }
}

