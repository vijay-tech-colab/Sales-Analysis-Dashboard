"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()
  const [openItem, setOpenItem] = React.useState<string | null>(null)

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const hasChildren = item.items && item.items.length > 0
            const isChildActive = hasChildren
              ? item.items?.some((sub) => pathname === sub.url)
              : false
            const isActive = pathname === item.url || isChildActive
            const isOpen = openItem === item.title || isChildActive

            return (
              <SidebarMenuItem key={item.title}>
                {/* Parent Button */}
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() =>
                    hasChildren ? setOpenItem(isOpen ? null : item.title) : null
                  }
                  asChild={!hasChildren}
                  className={cn(
                    "group flex justify-between items-center w-full rounded-xl px-3 py-2 transition-all duration-200 text-sm font-medium",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/30 shadow-sm"
                      : "hover:bg-accent/70 hover:text-black text-black"
                  )}
                >
                  {hasChildren ? (
                    <button className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        {item.icon && (
                          <item.icon
                            className={cn(
                              "h-4 w-4 transition-colors",
                              isActive
                                ? "text-primary"
                                : "text-black group-hover:text-black"
                            )}
                          />
                        )}
                        <span>{item.title}</span>
                      </div>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 text-black transition-transform duration-200",
                          isOpen && "rotate-90"
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.url}
                      className="flex items-center gap-2 w-full"
                    >
                      {item.icon && (
                        <item.icon
                          className={cn(
                            "h-4 w-4 transition-colors",
                            isActive ? "text-primary" : "text-black"
                          )}
                        />
                      )}
                      <span>{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuButton>

                {/* Submenu */}
                {hasChildren && isOpen && (
                  <div className="ml-6 mt-2 space-y-1 border-l border-gray-400 pl-3 animate-slide-down">
                    {item.items?.map((sub) => {
                      const isSubActive = pathname === sub.url
                      return (
                        <Link
                          key={sub.url}
                          href={sub.url}
                          className={cn(
                            "block text-sm transition-colors rounded-md px-2 py-1",
                            isSubActive
                              ? "text-primary font-semibold bg-primary/10"
                              : "text-black hover:text-primary hover:bg-accent/40"
                          )}
                        >
                          {sub.title}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
