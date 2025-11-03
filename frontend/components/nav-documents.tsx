"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
} from "@tabler/icons-react"
import type { LucideIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeItem, setActiveItem] = React.useState<string | null>(null)

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-sm font-semibold text-black mb-2">
        Documents
      </SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const isActive = activeItem === item.name

          return (
            <SidebarMenuItem
              key={item.name}
              className={cn(
                "group relative rounded-md transition-all duration-200 overflow-hidden",
                isActive
                  ? "bg-primary/10 border border-primary/30 text-primary shadow-md"
                  : "hover:bg-accent/70 hover:text-black text-black"
              )}
            >
              {/* Left Active Indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-sm shadow-[2px_0_5px_rgba(0,0,0,0.2)]" />
              )}

              {/* Main Button */}
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  onClick={() => setActiveItem(item.name)}
                  className={cn(
                    "flex items-center justify-between gap-2 px-3 py-2 w-full rounded-md transition-all duration-200",
                    isActive ? "text-primary" : "text-black hover:text-black"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <item.icon
                      className={cn(
                        "h-4 w-4 transition-colors ml-1",
                        isActive ? "text-primary" : "text-black"
                      )}
                    />
                    <span
                      className={cn(
                        "font-medium ml-1",
                        isActive ? "text-primary" : "text-black"
                      )}
                    >
                      {item.name}
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>

              {/* Dropdown Menu for Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="data-[state=open]:bg-accent rounded-md transition-colors"
                  >
                    <IconDots className="size-4 text-black transition-colors" />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-32 rounded-xl shadow-md"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem className="flex items-center gap-2 text-black hover:text-primary">
                    <IconFolder className="size-4" />
                    <span>Open</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 text-black hover:text-primary">
                    <IconShare3 className="size-4" />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                  >
                    <IconTrash className="size-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
