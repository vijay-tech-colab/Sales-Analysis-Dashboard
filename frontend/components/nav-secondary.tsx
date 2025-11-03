"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavSecondary({
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
  const [openItem, setOpenItem] = React.useState<string | null>(null)
  const [activeItem, setActiveItem] = React.useState<string | null>(null)

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const hasChildren = item.items && item.items.length > 0
            const isOpen = openItem === item.title
            const isActive = activeItem === item.title

            return (
              <SidebarMenuItem key={item.title}>
                {/* Parent Button */}
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => {
                    if (hasChildren) {
                      setOpenItem(isOpen ? null : item.title)
                      setActiveItem(item.title)
                    } else {
                      setActiveItem(item.title)
                      setOpenItem(null)
                    }
                  }}
                  asChild={!hasChildren}
                  className={cn(
                    "group flex justify-between items-center w-full rounded-md px-3 py-2 transition-all duration-200 text-sm font-medium relative overflow-hidden",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/30 shadow-md"
                      : "hover:bg-accent/70 hover:text-black text-black"
                  )}
                >
                  {hasChildren ? (
                    <button className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        {/* Left Active Indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-sm shadow-[2px_0_5px_rgba(0,0,0,0.2)]" />
                        )}

                        {item.icon && (
                          <item.icon
                            className={cn(
                              "h-4 w-4 transition-colors ml-1",
                              isActive
                                ? "text-primary"
                                : "text-black group-hover:text-black"
                            )}
                          />
                        )}
                        <span className="ml-1">{item.title}</span>
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
                      onClick={() => setActiveItem(item.title)}
                      className="flex items-center gap-2 w-full relative"
                    >
                      {/* Left Active Indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-sm shadow-[2px_0_5px_rgba(0,0,0,0.2)]" />
                      )}

                      {item.icon && (
                        <item.icon
                          className={cn(
                            "h-4 w-4 transition-colors ml-1",
                            isActive ? "text-primary" : "text-black"
                          )}
                        />
                      )}
                      <span className="ml-1">{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuButton>

                {/* Submenu */}
                {hasChildren && isOpen && (
                  <div className="ml-6 mt-2 space-y-1 border-l border-gray-400 pl-3 animate-slide-down">
                    {item.items?.map((sub) => {
                      const isSubActive = activeItem === sub.title
                      return (
                        <Link
                          key={sub.url}
                          href={sub.url}
                          onClick={() => setActiveItem(sub.title)}
                          className={cn(
                            "block text-sm transition-colors rounded-md px-2 py-1 relative overflow-hidden",
                            isSubActive
                              ? "text-primary font-semibold bg-primary/10 shadow-sm border border-primary/30"
                              : "text-black hover:text-primary hover:bg-accent/40"
                          )}
                        >
                          {/* Left Bar for active subitem */}
                          {isSubActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-sm shadow-[1px_0_3px_rgba(0,0,0,0.15)]" />
                          )}
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
