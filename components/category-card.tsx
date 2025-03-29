import Image from "next/image"
import Link from "next/link"

export function CategoryCard({ category }) {
  return (
    <Link href={`/productos?categoria=${category.name}`} className="group">
      <div className="aspect-square overflow-hidden rounded-2xl bg-baby-white dark:bg-baby-dark/40 group-hover:opacity-95">
        <Image
          src={category.image || "/placeholder.svg"}
          alt={category.name}
          width={200}
          height={200}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="mt-3 flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-baby-dark dark:text-baby-white">{category.name}</h3>
          <p className="text-sm text-muted-foreground">{category.count} productos</p>
        </div>
      </div>
    </Link>
  )
}

