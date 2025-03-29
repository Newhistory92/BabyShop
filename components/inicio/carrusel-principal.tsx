"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTransiciones } from "@/hooks/useTransiciones"
import { Button } from "@/components/ui/button"

interface Banner {
  id: string
  titulo: string
  subtitulo: string
  imagen: string
  imagenMovil?: string
  enlace: string
  textoBoton: string
  colorTexto?: string
}

interface PropiedadesCarruselPrincipal {
  banners: Banner[]
  autoplay?: boolean
  intervalo?: number
}

export function CarruselPrincipal({ banners, autoplay = true, intervalo = 5000 }: PropiedadesCarruselPrincipal) {
  const [slideActual, setSlideActual] = useState(0)
  const [enPausa, setEnPausa] = useState(false)
  const [enTransicion, setEnTransicion] = useState(false)
  const carruselRef = useRef<HTMLDivElement>(null)
  const { navegarConTransicion } = useTransiciones()

  // Función para cambiar al siguiente slide
  const siguienteSlide = () => {
    if (enTransicion) return
    setEnTransicion(true)
    setSlideActual((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
    setTimeout(() => setEnTransicion(false), 500)
  }

  // Función para cambiar al slide anterior
  const anteriorSlide = () => {
    if (enTransicion) return
    setEnTransicion(true)
    setSlideActual((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
    setTimeout(() => setEnTransicion(false), 500)
  }

  // Cambio automático de slides
  useEffect(() => {
    if (!autoplay || enPausa) return

    const intervaloId = setInterval(() => {
      siguienteSlide()
    }, intervalo)

    return () => clearInterval(intervaloId)
  }, [autoplay, enPausa, intervalo, slideActual, enTransicion])

  // Detectar cuando el carrusel no está visible
  useEffect(() => {
    const observador = new IntersectionObserver(
      ([entrada]) => {
        setEnPausa(!entrada.isIntersecting)
      },
      { threshold: 0.5 },
    )

    if (carruselRef.current) {
      observador.observe(carruselRef.current)
    }

    return () => {
      if (carruselRef.current) {
        observador.unobserve(carruselRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={carruselRef}
      className="relative overflow-hidden"
      onMouseEnter={() => setEnPausa(true)}
      onMouseLeave={() => setEnPausa(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out h-[50vh] md:h-[60vh] lg:h-[70vh]"
        style={{ transform: `translateX(-${slideActual * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={banner.id} className="w-full flex-shrink-0 relative">
            {/* Imagen para móvil */}
            <div className="block md:hidden h-full w-full">
              <Image
                src={banner.imagenMovil || banner.imagen}
                alt={banner.titulo}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>

            {/* Imagen para desktop */}
            <div className="hidden md:block h-full w-full">
              <Image
                src={banner.imagen || "/placeholder.svg"}
                alt={banner.titulo}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>

            {/* Overlay para mejorar legibilidad del texto */}
            <div className="absolute inset-0 bg-black bg-opacity-30" />

            {/* Contenido del banner */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="max-w-lg">
                  <h2
                    className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${banner.colorTexto || "text-white"}`}
                  >
                    {banner.titulo}
                  </h2>
                  <p className={`text-lg md:text-xl mb-6 ${banner.colorTexto || "text-white"}`}>{banner.subtitulo}</p>
                  <Button
                    asChild
                    className="bg-green-700 hover:bg-green-800"
                    onClick={(e) => {
                      e.preventDefault()
                      navegarConTransicion(() => (window.location.href = banner.enlace))
                    }}
                  >
                    <Link href={banner.enlace}>{banner.textoBoton}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de navegación */}
      <button
        onClick={anteriorSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-gray-800 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-700"
        aria-label="Slide anterior"
        disabled={enTransicion}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={siguienteSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-gray-800 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-700"
        aria-label="Siguiente slide"
        disabled={enTransicion}
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!enTransicion) {
                setEnTransicion(true)
                setSlideActual(index)
                setTimeout(() => setEnTransicion(false), 500)
              }
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              slideActual === index ? "bg-white scale-110" : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
            aria-label={`Ir al slide ${index + 1}`}
            disabled={enTransicion}
          />
        ))}
      </div>
    </div>
  )
}

