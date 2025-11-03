"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format, subMonths } from "date-fns";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { IconDownload, IconSearch, IconCalendar, IconStar } from "@tabler/icons-react";
import { CSVLink } from "react-csv";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  BarChart,
  Bar,
} from "recharts";

// -----------------------------
// MOCK DATA SECTION
// -----------------------------
const mockSeller = {
  id: "S001",
  name: "Vikram Traders",
  email: "vikramtraders@example.com",
  phone: "+91-9876543210",
  image: "https://i.pravatar.cc/150?img=12",
  rating: 4.7,
};

const mockTopProducts = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  sales: Math.floor(Math.random() * 5000 + 2000),
  units: Math.floor(Math.random() * 300 + 50),
}));

const mockRecentOrders = Array.from({ length: 10 }).map((_, i) => ({
  id: `ORD-${1000 + i}`,
  customerName: `Customer ${i + 1}`,
  status: ["pending", "shipped", "delivered"][i % 3],
  value: Math.floor(Math.random() * 200 + 50),
  createdAt: new Date(Date.now() - i * 86400000),
}));

const mockReviews = Array.from({ length: 5 }).map((_, i) => ({
  id: i + 1,
  author: `User ${i + 1}`,
  rating: (Math.random() * 2 + 3).toFixed(1),
  text: "Great product and fast delivery!",
  date: new Date(Date.now() - i * 604800000),
}));

const mockStats = {
  monthly: Array.from({ length: 6 }).map((_, i) => {
    const date = subMonths(new Date(), 5 - i);
    return {
      month: format(date, "MMM yyyy"),
      revenue: Math.floor(Math.random() * 20000 + 3000),
      orders: Math.floor(Math.random() * 150 + 20),
    };
  }),
  totalRevenue: 126000,
  totalOrders: 820,
  channels: [
    { name: "Web", value: 60 },
    { name: "Mobile", value: 25 },
    { name: "Retail", value: 15 },
  ],
  returnRate: 2.8,
};

// -----------------------------
// MAIN COMPONENT
// -----------------------------
export default function SellerPerformanceFull() {
  const router = useRouter();
  const seller = mockSeller;
  const [rangeMonths, setRangeMonths] = React.useState(6);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [exporting, setExporting] = React.useState(false);
  const [realtime, setRealtime] = React.useState(true);

  // CSV Export
  const csvData = mockTopProducts.map((p) => ({
    product: p.name,
    sales: p.sales,
    units: p.units,
  }));

  // KPIs
  const totalRevenue = mockStats.totalRevenue;
  const totalOrders = mockStats.totalOrders;
  const avgOrderValue = (totalRevenue / totalOrders).toFixed(2);

  const kpis = {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    rating: seller.rating,
  };

  // Export handler
  const handleExport = () => {
    setExporting(true);
    setTimeout(() => setExporting(false), 800);
  };

  return (
    <div className="min-h-screen p-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border px-2 py-4 rounded-md">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={seller.image} alt={seller.name} />
            <AvatarFallback>{seller.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold">{seller.name}</h1>
            <div className="text-sm text-muted-foreground flex gap-4">
              <span>{seller.email}</span>
              <span>{seller.phone}</span>
              <span className="flex items-center gap-1">
                <IconStar size={14} /> {seller.rating}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <IconCalendar size={16} /> &nbsp; {rangeMonths} months
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                {[3, 6, 12, 24].map((m) => (
                  <Button
                    key={m}
                    variant={m === rangeMonths ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setRangeMonths(m)}
                    className="w-full justify-start"
                  >
                    Last {m} months
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            size="sm"
            onClick={() => setRealtime((r) => !r)}
            variant={realtime ? "default" : "outline"}
          >
            {realtime ? "Realtime ON" : "Realtime OFF"}
          </Button>

          <Select onValueChange={(v) => setStatusFilter(v)} defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>

          <Button size="sm" onClick={handleExport}>
            <IconDownload /> &nbsp; {exporting ? "Preparing..." : "Export"}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Total Revenue</CardTitle>
            <Badge>All</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">
              Avg order ${avgOrderValue}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Total Orders</CardTitle>
            <Badge>Count</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <div className="text-sm text-muted-foreground">
              In last {rangeMonths} months
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Average Rating</CardTitle>
            <Badge>Score</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seller.rating.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">From reviews</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Conversion</CardTitle>
            <Badge variant="secondary">Est.</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((totalOrders / 1000) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Estimated</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Quick search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-64"
            />
            <Button size="sm" onClick={() => alert(`Search: ${query}`)}>
              <IconSearch />
            </Button>
          </div>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle>Sales & Orders</CardTitle>
                <CardDescription>
                  Revenue and order trends over the past {rangeMonths} months
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockStats.monthly}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--primary)"
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                    <Line type="monotone" dataKey="orders" stroke="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
