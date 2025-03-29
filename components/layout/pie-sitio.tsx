import Link from "next/link"
import { Baby, Facebook, Instagram, Twitter } from "lucide-react"

export function PieSitio() {
  return (
    <footer className="bg-baby-dark text-baby-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Baby className="h-6 w-6 text-baby-mint" />
              <h3 className="font-bold text-lg">BabyDream</h3>
            </div>
            <p className="text-baby-white/80 mb-4">
              Ropa para bebés y niños con diseños exclusivos, materiales suaves y seguros para la piel sensible.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-baby-mint hover:text-baby-blue transition-colors">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-baby-mint hover:text-baby-blue transition-colors">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-baby-mint hover:text-baby-blue transition-colors">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/bebes" className="text-baby-white/80 hover:text-baby-mint transition-colors">
                  Bebés
                </Link>
              </li>
              <li>
                <Link href="/ninos" className="text-baby-white/80 hover:text-baby-mint transition-colors">
                  Niños
                </Link>
              </li>
              <li>
                <Link href="/colecciones" className="text-baby-white/80 hover:text-baby-mint transition-colors">
                  Colecciones
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-baby-white/80 hover:text-baby-mint transition-colors">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-baby-white/80 hover:text-baby-mint transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/envios" className="text-baby-white/80 hover:text-baby-mint transition-colors">
                  Envíos y entregas
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-baby-white/80 hover:text-baby-mint transition-colors">
                  Política de devoluciones
                </Link>
              </li>
              <li>
                <Link
                  href="/preguntas-frecuentes"
                  className="text-baby-white/80 hover:text-baby-mint transition-colors"
                >
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-baby-white/80 hover:text-baby-mint transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-baby-white/80 hover:text-baby-mint transition-colors">
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="text-baby-white/80">
                <span className="font-medium text-baby-white">Dirección:</span> Av. Corrientes 1234, CABA, Argentina
              </li>
              <li className="text-baby-white/80">
                <span className="font-medium text-baby-white">Teléfono:</span> +54 11 1234-5678
              </li>
              <li className="text-baby-white/80">
                <span className="font-medium text-baby-white">Email:</span> info@babydream.com
              </li>
              <li className="text-baby-white/80">
                <span className="font-medium text-baby-white">Horario:</span> Lun-Vie: 9:00 - 18:00
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-baby-white/20 mt-12 pt-8 text-center text-baby-white/60 text-sm">
          <p>© {new Date().getFullYear()} BabyDream. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

