"use client"

import { useState } from "react"
import Image from "next/image"
import { Filter, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/product-card"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ProductosPage() {
  // Estado para filtros
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    ecoLabels: [],
    priceRange: "",
  })

  // Estado para ordenamiento
  const [sortOrder, setSortOrder] = useState("featured")

  // Datos de ejemplo para productos
  const products = [
    {
      id: 1,
      name: "Crema Hidratante Facial",
      price: 2499,
      image: "/placeholder.svg?height=300&width=300",
      category: "Facial",
      isNew: true,
      rating: 4.8,
      ecoLabels: ["Vegano", "Cruelty-Free"],
    },
    {
      id: 2,
      name: "Aceite Esencial de Lavanda",
      price: 1899,
      image: "/placeholder.svg?height=300&width=300",
      category: "Aceites",
      isNew: false,
      rating: 4.9,
      ecoLabels: ["Orgánico", "Eco-Friendly"],
    },
    {
      id: 3,
      name: "Shampoo Sólido de Coco",
      price: 1299,
      image: "/placeholder.svg?height=300&width=300",
      category: "Cabello",
      isNew: true,
      rating: 4.7,
      ecoLabels: ["Zero Waste", "Vegano"],
    },
    {
      id: 4,
      name: "Mascarilla de Arcilla Verde",
      price: 1799,
      image: "/placeholder.svg?height=300&width=300",
      category: "Facial",
      isNew: false,
      rating: 4.6,
      ecoLabels: ["Natural", "Cruelty-Free"],
    },
    {
      id: 5,
      name: "Bálsamo Labial de Miel",
      price: 899,
      image: "/placeholder.svg?height=300&width=300",
      category: "Labios",
      isNew: false,
      rating: 4.5,
      ecoLabels: ["Natural", "Eco-Friendly"],
    },
    {
      id: 6,
      name: "Exfoliante Corporal de Café",
      price: 1999,
      image: "/placeholder.svg?height=300&width=300",
      category: "Corporal",
      isNew: true,
      rating: 4.8,
      ecoLabels: ["Orgánico", "Zero Waste"],
    },
    {
      id: 7,
      name: "Agua Micelar de Rosas",
      price: 1599,
      image: "/placeholder.svg?height=300&width=300",
      category: "Facial",
      isNew: false,
      rating: 4.7,
      ecoLabels: ["Vegano", "Natural"],
    },
    {
      id: 8,
      name: "Acondicionador Natural de Aloe Vera",
      price: 1499,
      image: "/placeholder.svg?height=300&width=300",
      category: "Cabello",
      isNew: false,
      rating: 4.6,
      ecoLabels: ["Orgánico", "Cruelty-Free"],
    },
    {
      id: 9,
      name: "Jabón Artesanal de Caléndula",
      price: 999,
      image: "/placeholder.svg?height=300&width=300",
      category: "Corporal",
      isNew: true,
      rating: 4.9,
      ecoLabels: ["Zero Waste", "Natural"],
    },
    {
      id: 10,
      name: "Sérum Facial de Vitamina C",
      price: 2999,
      image: "/placeholder.svg?height=300&width=300",
      category: "Facial",
      isNew: true,
      rating: 4.8,
      ecoLabels: ["Vegano", "Eco-Friendly"],
    },
    {
      id: 11,
      name: "Desodorante Natural de Salvia",
      price: 1299,
      image: "/placeholder.svg?height=300&width=300",
      category: "Corporal",
      isNew: false,
      rating: 4.5,
      ecoLabels: ["Zero Waste", "Natural"],
    },
    {
      id: 12,
      name: "Bruma Facial de Agua de Rosas",
      price: 1399,
      image: "/placeholder.svg?height=300&width=300",
      category: "Facial",
      isNew: false,
      rating: 4.7,
      ecoLabels: ["Orgánico", "Cruelty-Free"],
    },
  ]

  // Opciones de filtro
  const filterOptions = {
    categories: ["Facial", "Corporal", "Cabello", "Aceites", "Labios"],
    ecoLabels: ["Vegano", "Cruelty-Free", "Orgánico", "Zero Waste", "Natural", "Eco-Friendly"],
    priceRanges: [
      { label: "Menos de $1000", value: "0-1000" },
      { label: "$1000 - $2000", value: "1000-2000" },
      { label: "$2000 - $3000", value: "2000-3000" },
      { label: "Más de $3000", value: "3000-999999" },
    ],
  }

  // Función para manejar cambios en los filtros
  const handleFilterChange = (type, value) => {
    setActiveFilters((prev) => {
      if (type === "categories" || type === "ecoLabels") {
        if (prev[type].includes(value)) {
          return {
            ...prev,
            [type]: prev[type].filter((item) => item !== value),
          }
        } else {
          return {
            ...prev,
            [type]: [...prev[type], value],
          }
        }
      } else if (type === "priceRange") {
        return {
          ...prev,
          priceRange: value,
        }
      }
      return prev
    })
  }

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setActiveFilters({
      categories: [],
      ecoLabels: [],
      priceRange: "",
    })
  }

  // Función para filtrar productos
  const filteredProducts = products.filter((product) => {
    // Filtrar por categoría
    if (activeFilters.categories.length > 0 && !activeFilters.categories.includes(product.category)) {
      return false
    }

    // Filtrar por eco-etiquetas
    if (activeFilters.ecoLabels.length > 0) {
      const hasMatchingLabel = product.ecoLabels.some((label) => activeFilters.ecoLabels.includes(label))
      if (!hasMatchingLabel) return false
    }

    // Filtrar por rango de precio
    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange.split("-").map(Number)
      if (product.price < min || product.price > max) return false
    }

    return true
  })

  // Función para ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOrder) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.isNew ? 1 : -1
      default:
        return 0
    }
  })

  // Contar filtros activos
  const activeFilterCount =
    activeFilters.categories.length + activeFilters.ecoLabels.length + (activeFilters.priceRange ? 1 : 0)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Productos", href: "/productos", active: true },
        ]}
      />

      <h1 className="text-3xl font-bold mt-6 mb-8">Todos los Productos</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filtros para desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filtros</h2>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-sm text-green-700 hover:text-green-800"
                >
                  Limpiar todos
                </Button>
              )}
            </div>

            {/* Categorías */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-3">Categorías</h3>
              <div className="space-y-2">
                {filterOptions.categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={activeFilters.categories.includes(category)}
                      onCheckedChange={() => handleFilterChange("categories", category)}
                      className="text-green-700 border-gray-300"
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Eco-etiquetas */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-3">Eco-etiquetas</h3>
              <div className="space-y-2">
                {filterOptions.ecoLabels.map((label) => (
                  <div key={label} className="flex items-center space-x-2">
                    <Checkbox
                      id={`label-${label}`}
                      checked={activeFilters.ecoLabels.includes(label)}
                      onCheckedChange={() => handleFilterChange("ecoLabels", label)}
                      className="text-green-700 border-gray-300"
                    />
                    <label
                      htmlFor={`label-${label}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rango de precio */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-3">Precio</h3>
              <div className="space-y-2">
                {filterOptions.priceRanges.map((range) => (
                  <div key={range.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`price-${range.value}`}
                      checked={activeFilters.priceRange === range.value}
                      onCheckedChange={() => handleFilterChange("priceRange", range.value)}
                      className="text-green-700 border-gray-300"
                    />
                    <label
                      htmlFor={`price-${range.value}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1">
          {/* Barra de herramientas móvil */}
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div className="flex items-center gap-2">
              {/* Botón de filtro para móvil */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                    {activeFilterCount > 0 && (
                      <span className="ml-1 bg-green-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                  <div className="py-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold">Filtros</h2>
                      {activeFilterCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                          className="text-sm text-green-700 hover:text-green-800"
                        >
                          Limpiar todos
                        </Button>
                      )}
                    </div>

                    {/* Categorías */}
                    <div className="mb-6">
                      <h3 className="text-md font-medium mb-3">Categorías</h3>
                      <div className="space-y-2">
                        {filterOptions.categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-category-${category}`}
                              checked={activeFilters.categories.includes(category)}
                              onCheckedChange={() => handleFilterChange("categories", category)}
                              className="text-green-700 border-gray-300"
                            />
                            <label
                              htmlFor={`mobile-category-${category}`}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Eco-etiquetas */}
                    <div className="mb-6">
                      <h3 className="text-md font-medium mb-3">Eco-etiquetas</h3>
                      <div className="space-y-2">
                        {filterOptions.ecoLabels.map((label) => (
                          <div key={label} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-label-${label}`}
                              checked={activeFilters.ecoLabels.includes(label)}
                              onCheckedChange={() => handleFilterChange("ecoLabels", label)}
                              className="text-green-700 border-gray-300"
                            />
                            <label
                              htmlFor={`mobile-label-${label}`}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rango de precio */}
                    <div className="mb-6">
                      <h3 className="text-md font-medium mb-3">Precio</h3>
                      <div className="space-y-2">
                        {filterOptions.priceRanges.map((range) => (
                          <div key={range.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-price-${range.value}`}
                              checked={activeFilters.priceRange === range.value}
                              onCheckedChange={() => handleFilterChange("priceRange", range.value)}
                              className="text-green-700 border-gray-300"
                            />
                            <label
                              htmlFor={`mobile-price-${range.value}`}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {range.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Filtros activos */}
              {activeFilterCount > 0 && (
                <div className="hidden sm:flex flex-wrap gap-2 items-center">
                  {activeFilters.categories.map((category) => (
                    <div
                      key={category}
                      className="bg-green-50 text-green-700 text-xs rounded-full px-3 py-1 flex items-center gap-1"
                    >
                      {category}
                      <button onClick={() => handleFilterChange("categories", category)}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {activeFilters.ecoLabels.map((label) => (
                    <div
                      key={label}
                      className="bg-green-50 text-green-700 text-xs rounded-full px-3 py-1 flex items-center gap-1"
                    >
                      {label}
                      <button onClick={() => handleFilterChange("ecoLabels", label)}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {activeFilters.priceRange && (
                    <div className="bg-green-50 text-green-700 text-xs rounded-full px-3 py-1 flex items-center gap-1">
                      {filterOptions.priceRanges.find((r) => r.value === activeFilters.priceRange)?.label}
                      <button onClick={() => handleFilterChange("priceRange", "")}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Ordenamiento */}
            <div className="flex items-center">
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Destacados</SelectItem>
                  <SelectItem value="newest">Más nuevos</SelectItem>
                  <SelectItem value="rating">Mejor valorados</SelectItem>
                  <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
                  <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resultados */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <Image
                  src="/placeholder.svg?height=120&width=120"
                  alt="No hay resultados"
                  width={120}
                  height={120}
                  className="mx-auto opacity-50"
                />
              </div>
              <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
              <p className="text-gray-500 mb-6">Intenta con otros filtros o categorías</p>
              <Button onClick={clearAllFilters} className="bg-green-700 hover:bg-green-800">
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

