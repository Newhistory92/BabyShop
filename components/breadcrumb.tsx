import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />}
            {item.active ? (
              <span className="text-gray-500 font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="text-gray-600 hover:text-gray-900">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

