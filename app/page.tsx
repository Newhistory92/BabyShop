import Image from "next/image"
import { Baby, Gift, Truck, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Bebés felices con ropa BabyDream"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-baby-dark/30 dark:bg-baby-dark/50"></div>
        </div>

        <div className="container relative z-10 text-baby-white">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Ropa para bebés con estilo y comodidad</h1>
            <p className="text-lg md:text-xl mb-8">
              Diseños exclusivos con materiales suaves y seguros para la piel sensible de tu bebé
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-baby-mint hover:bg-baby-mint/90 text-baby-dark rounded-full">
                Ver colección
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-baby-white text-baby-white hover:bg-baby-white/10 rounded-full"
              >
                Recién nacidos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías destacadas */}
      <section className="py-16 bg-baby-white dark:bg-baby-dark">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-baby-dark dark:text-baby-white">
            Categorías destacadas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Categoría 1 */}
            <div className="group relative overflow-hidden rounded-2xl">
              <div className="aspect-square bg-baby-pink dark:bg-baby-dark/60 rounded-2xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Ropa para recién nacidos"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-t from-baby-dark/60 to-transparent">
                <div>
                  <h3 className="text-xl font-bold text-baby-white mb-2">Recién nacidos</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-baby-white/20 backdrop-blur-sm text-baby-white border-baby-white/40 hover:bg-baby-white/30 rounded-full"
                  >
                    Ver productos
                  </Button>
                </div>
              </div>
            </div>

            {/* Categoría 2 */}
            <div className="group relative overflow-hidden rounded-2xl">
              <div className="aspect-square bg-baby-pink dark:bg-baby-dark/60 rounded-2xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Ropa para bebés"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-t from-baby-dark/60 to-transparent">
                <div>
                  <h3 className="text-xl font-bold text-baby-white mb-2">Bebés</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-baby-white/20 backdrop-blur-sm text-baby-white border-baby-white/40 hover:bg-baby-white/30 rounded-full"
                  >
                    Ver productos
                  </Button>
                </div>
              </div>
            </div>

            {/* Categoría 3 */}
            <div className="group relative overflow-hidden rounded-2xl">
              <div className="aspect-square bg-baby-pink dark:bg-baby-dark/60 rounded-2xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Ropa para niños"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-t from-baby-dark/60 to-transparent">
                <div>
                  <h3 className="text-xl font-bold text-baby-white mb-2">Niños</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-baby-white/20 backdrop-blur-sm text-baby-white border-baby-white/40 hover:bg-baby-white/30 rounded-full"
                  >
                    Ver productos
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-16 bg-baby-pink/30 dark:bg-baby-dark/80">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-baby-dark dark:text-baby-white">
            Productos destacados
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-baby-white dark:bg-baby-dark/60 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow product-card-hover"
              >
                <div className="relative aspect-square">
                  <Image
                    src={`/placeholder.svg?height=400&width=400&text=Producto ${item}`}
                    alt={`Producto ${item}`}
                    width={400}
                    height={400}
                    className="object-cover"
                  />
                  {item === 1 && (
                    <span className="absolute top-2 right-2 bg-baby-pink text-baby-dark text-xs px-2 py-1 rounded-full">
                      Nuevo
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1 text-baby-dark dark:text-baby-white">Body manga larga</h3>
                  <p className="text-sm text-muted-foreground mb-2">100% algodón orgánico</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-baby-dark dark:text-baby-white">$4.500</span>
                    <Button size="sm" className="bg-baby-blue hover:bg-baby-blue/90 text-baby-dark rounded-full">
                      Agregar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" className="bg-baby-mint hover:bg-baby-mint/90 text-baby-dark rounded-full">
              Ver todos los productos
            </Button>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 bg-baby-white dark:bg-baby-dark">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-baby-dark dark:text-baby-white">
            ¿Por qué elegirnos?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-baby-mint/20 flex items-center justify-center mb-4">
                <Baby className="h-8 w-8 text-baby-mint" />
              </div>
              <h3 className="font-bold mb-2 text-baby-dark dark:text-baby-white">Materiales seguros</h3>
              <p className="text-muted-foreground">
                Algodón orgánico certificado, suave y seguro para la piel sensible.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-baby-mint/20 flex items-center justify-center mb-4">
                <Gift className="h-8 w-8 text-baby-mint" />
              </div>
              <h3 className="font-bold mb-2 text-baby-dark dark:text-baby-white">Diseños exclusivos</h3>
              <p className="text-muted-foreground">Colecciones únicas con estampados y diseños originales.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-baby-mint/20 flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-baby-mint" />
              </div>
              <h3 className="font-bold mb-2 text-baby-dark dark:text-baby-white">Envío rápido</h3>
              <p className="text-muted-foreground">Entrega en 24-48hs en CABA y GBA. Envíos a todo el país.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-baby-mint/20 flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-baby-mint" />
              </div>
              <h3 className="font-bold mb-2 text-baby-dark dark:text-baby-white">Pago seguro</h3>
              <p className="text-muted-foreground">Múltiples métodos de pago y cuotas sin interés.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-baby-dark text-baby-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Únete a nuestra comunidad</h2>
            <p className="mb-8">Recibe novedades, ofertas exclusivas y consejos para el cuidado de tu bebé</p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-2 rounded-full bg-baby-white/10 border border-baby-white/20 text-baby-white placeholder:text-baby-white/60 focus:outline-none focus:ring-2 focus:ring-baby-mint"
                required
              />
              <Button className="bg-baby-mint hover:bg-baby-mint/90 text-baby-dark rounded-full">Suscribirme</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

