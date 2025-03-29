import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Heart } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ProductCard({ product }) {
  return (
    <div className="group relative product-card-hover">
      <div className="aspect-square overflow-hidden rounded-2xl bg-baby-white dark:bg-baby-dark/40 group-hover:opacity-95">
        <Link href={`/productos/${product.id}`}>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover object-center"
          />
        </Link>
        {product.isNew && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-baby-pink hover:bg-baby-pink/90 text-baby-dark rounded-full">Nuevo</Badge>
          </div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full h-8 w-8 bg-baby-white/80 hover:bg-baby-white text-baby-dark"
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Agregar a favoritos</span>
          </Button>
        </div>
      </div>
      <div className="mt-3 flex flex-col">
        <div className="flex items-center gap-1 mb-1">
          {product.ecoLabels &&
            product.ecoLabels.slice(0, 2).map((label) => (
              <span key={label} className="text-xs text-baby-dark bg-baby-mint px-1.5 py-0.5 rounded-full">
                {label}
              </span>
            ))}
        </div>
        <h3 className="text-sm font-medium text-baby-dark dark:text-baby-white">
          <Link href={`/productos/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm font-medium text-baby-dark dark:text-baby-white">${product.price.toLocaleString()}</p>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating) ? "text-baby-pink fill-baby-pink" : "text-gray-300"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <Button className="w-full bg-baby-blue hover:bg-baby-blue/90 text-baby-dark text-xs h-9 rounded-full" size="sm">
          <ShoppingBag className="h-3.5 w-3.5 mr-1" />
          Agregar al carrito
        </Button>
      </div>
    </div>
  )
}

