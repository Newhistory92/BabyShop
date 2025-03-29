import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section className="py-12 px-4 md:px-6 lg:px-8 bg-green-700 text-white">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Únete a nuestra comunidad</h2>
          <p className="mb-6">
            Suscríbete para recibir noticias, ofertas exclusivas y consejos sobre cosmética natural.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Tu correo electrónico"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-green-500"
              required
            />
            <Button className="bg-white text-green-700 hover:bg-green-100">Suscribirse</Button>
          </form>
          <p className="text-sm mt-4 text-white/80">
            Al suscribirte, aceptas nuestra política de privacidad y recibirás comunicaciones de marketing.
          </p>
        </div>
      </div>
    </section>
  )
}

