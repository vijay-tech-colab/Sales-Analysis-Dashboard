"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Home, ChevronRight } from "lucide-react"

export default function BreadcrumbPath() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const name = segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    return { name, href }
  })

  return (
    <div className="flex items-center text-sm font-medium text-muted-foreground">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center space-x-1">
          {/* Home */}
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/"
                className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
              >
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center">
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4 text-muted-foreground/70 mx-1" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage className="text-foreground font-semibold tracking-wide">
                    {crumb.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={crumb.href}
                      className="capitalize hover:text-primary transition-colors"
                    >
                      {crumb.name}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
