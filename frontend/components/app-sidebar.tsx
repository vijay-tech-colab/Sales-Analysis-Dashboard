"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserPlus,
  Package,
  PackagePlus,
  Boxes,
  BarChart3,
  PieChart,
  LineChart,
  ShoppingCart,
  FileText,
  CalendarDays,
  Settings,
  FileSpreadsheet,
  FileBarChart,
  FileDown,
  Shield,
  HelpCircle,
  Search,
  LogOut,
  Database,
  FileChartColumn,
  FilePieChart,
  GaugeCircle,
} from "lucide-react"
import Link from "next/link"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  // 🌟 Main Navigation
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Sellers",
      icon: Users,
      url: "/dashboard/sellers",
      items: [
        { title: "All Sellers", url: "/dashboard/sellers" },
        { title: "Add Seller", url: "/dashboard/sellers/add" },
        { title: "Performance", url: "/dashboard/sellers/performance" },
      ],
    },
    {
      title: "Customers",
      icon: UserCheck,
      url: "/dashboard/customers",
      items: [
        { title: "All Customers", url: "/dashboard/customers" },
        { title: "Top Customers", url: "/dashboard/customers/top" },
        { title: "Feedback", url: "/dashboard/customers/feedback" },
      ],
    },
    {
      title: "Products",
      icon: Package,
      url: "/dashboard/products",
      items: [
        { title: "All Products", url: "/dashboard/products" },
        { title: "Add Product", url: "/dashboard/products/add" },
        { title: "Categories", url: "/dashboard/products/categories" },
        { title: "Inventory", url: "/dashboard/products/inventory" },
      ],
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      url: "/dashboard/orders",
      items: [
        { title: "All Orders", url: "/dashboard/orders" },
        { title: "Pending Orders", url: "/dashboard/orders/pending" },
        { title: "Delivered Orders", url: "/dashboard/orders/delivered" },
        { title: "Cancelled Orders", url: "/dashboard/orders/cancelled" },
      ],
    },
    {
      title: "Analytics",
      icon: BarChart3,
      url: "/dashboard/analytics",
      items: [
        { title: "Sales Overview", url: "/dashboard/analytics/sales" },
        { title: "Region Wise", url: "/dashboard/analytics/region" },
        { title: "Product Performance", url: "/dashboard/analytics/products" },
        { title: "Seller Comparison", url: "/dashboard/analytics/sellers" },
      ],
    },
    {
      title: "Reports",
      icon: FileText,
      url: "/dashboard/reports",
      items: [
        { title: "Monthly Report", url: "/dashboard/reports/monthly" },
        { title: "Yearly Report", url: "/dashboard/reports/yearly" },
        { title: "Export PDF", url: "/dashboard/reports/pdf" },
        { title: "Export Excel", url: "/dashboard/reports/excel" },
      ],
    },
  ],

 // 📊 Sales & Reports Section
documents: [
  {
    name: "Sales Dashboard",
    url: "/dashboard/sales/dashboard",
    icon: LineChart,
  },
  {
    name: "Performance Reports",
    url: "/dashboard/sales/reports",
    icon: FileBarChart,
  },
  {
    name: "Customer Insights",
    url: "/dashboard/sales/customers",
    icon: FilePieChart,
  },
  {
    name: "Data Library",
    url: "/dashboard/sales/data-library",
    icon: Database,
  },
],


  // ⚙️ Secondary / Utility Links
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      items: [
        { title: "System Settings", url: "/dashboard/settings/system" },
        { title: "Tax & Commission", url: "/dashboard/settings/tax" },
        { title: "User Roles", url: "/dashboard/settings/roles" },
      ],
    },
    {
      title: "Get Help",
      url: "/dashboard/get-help",
      icon: HelpCircle,
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
    },
    {
      title: "Logout",
      url: "/logout",
      icon: LogOut,
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className=" p-0 border-r">
      {/* 🧭 Header */}
      <SidebarHeader className="border-b border-gray-200 py-3 px-4">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-center gap-2">
            <GaugeCircle className="h-5 w-5 text-black" />
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <span className="text-xl font-bold text-black tracking-wide">
                  Admin Dashboard
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="sidebar-content overflow-y-auto">
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
