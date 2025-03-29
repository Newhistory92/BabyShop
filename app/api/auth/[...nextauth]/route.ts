import NextAuth from "next-auth"
import { opcionesAutenticacion } from "@/lib/auth/opcionesAutenticacion"

const manejador = NextAuth(opcionesAutenticacion)

export { manejador as GET, manejador as POST }

