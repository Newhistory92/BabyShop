"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroSlider({ banners }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Función para cambiar al siguiente slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
  }

  // Función para cambiar al slide anterior
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }

  // Cambio automático de slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={banner.id} className="w-full flex-shrink-0 relative">
            <div className="relative aspect-[21/9] md:aspect-[3/1]">
              <Image
                src={banner.image || "/placeholder.svg"}
                alt={banner.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-baby-dark/30 dark:bg-baby-dark/50"></div>
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                  <div className="max-w-lg">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-baby-white mb-4">{banner.title}</h2>
                    <p className="text-lg md:text-xl text-baby-white mb-6">{banner.subtitle}</p>
                    <Button asChild className="bg-baby-mint hover:bg-baby-mint/90 text-baby-dark rounded-full">
                      <Link href={banner.link}>{banner.cta}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de navegación */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-baby-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 text-baby-dark"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-baby-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 text-baby-dark"
        aria-label="Siguiente slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full ${currentSlide === index ? "bg-baby-white" : "bg-baby-white bg-opacity-50"}`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

