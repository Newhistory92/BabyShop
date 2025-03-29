import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatearPrecio(precio: number): string {
  return `$${precio.toLocaleString("es-AR")}`
}

export function truncarTexto(texto: string, longitud: number): string {
  if (texto.length <= longitud) return texto
  return texto.slice(0, longitud) + "..."
}

export function generarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function obtenerFechaFormateada(fecha: Date | string): string {
  const fechaObj = typeof fecha === "string" ? new Date(fecha) : fecha
  return fechaObj.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function calcularTiempoTranscurrido(fecha: Date | string): string {
  const fechaObj = typeof fecha === "string" ? new Date(fecha) : fecha
  const ahora = new Date()
  const diferencia = ahora.getTime() - fechaObj.getTime()

  const segundos = Math.floor(diferencia / 1000)
  const minutos = Math.floor(segundos / 60)
  const horas = Math.floor(minutos / 60)
  const dias = Math.floor(horas / 24)
  const meses = Math.floor(dias / 30)
  const años = Math.floor(dias / 365)

  if (años > 0) return `hace ${años} ${años === 1 ? "año" : "años"}`
  if (meses > 0) return `hace ${meses} ${meses === 1 ? "mes" : "meses"}`
  if (dias > 0) return `hace ${dias} ${dias === 1 ? "día" : "días"}`
  if (horas > 0) return `hace ${horas} ${horas === 1 ? "hora" : "horas"}`
  if (minutos > 0) return `hace ${minutos} ${minutos === 1 ? "minuto" : "minutos"}`
  return "hace unos segundos"
}

export function generarCodigoAleatorio(longitud = 8): string {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let resultado = ""
  for (let i = 0; i < longitud; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
  }
  return resultado
}

export function sanitizarHTML(html: string): string {
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

