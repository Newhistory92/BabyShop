import { PrismaAdapter } from "@next-auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"

export const opcionesAutenticacion: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/iniciar-sesion",
    signOut: "/auth/cerrar-sesion",
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const usuario = await prisma.usuario.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!usuario || !usuario.contrasenaHash) {
          return null
        }

        const esContrasenaValida = await bcrypt.compare(credentials.password, usuario.contrasenaHash)

        if (!esContrasenaValida) {
          return null
        }

        return {
          id: usuario.id,
          email: usuario.email,
          name: usuario.nombre,
          image: usuario.imagen,
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.esAdmin = token.esAdmin as boolean
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUsuario = await prisma.usuario.findFirst({
        where: {
          email: token.email as string,
        },
      })

      if (!dbUsuario) {
        if (user) {
          token.id = user.id
        }
        return token
      }

      return {
        id: dbUsuario.id,
        name: dbUsuario.nombre,
        email: dbUsuario.email,
        picture: dbUsuario.imagen,
        esAdmin: dbUsuario.esAdmin || false,
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

