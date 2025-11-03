"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IconDownload, IconSearch } from "@tabler/icons-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { CSVLink } from "react-csv";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function TopCustomersPage() {
  const [search, setSearch] = React.useState("");

  // 🔹 Fake customer data
  const regions = ["North", "South", "East", "West"];
  const statuses = ["Active", "Pending", "Inactive"];

  const fakeCustomers = React.useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: `CUST-${i + 1}`,
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      region: regions[i % 4],
      orders: Math.floor(Math.random() * 50) + 5,
      revenue: Math.floor(Math.random() * 50000) + 5000,
      status: statuses[i % 3],
      image: `https://i.pravatar.cc/150?img=${i + 10}`,
    }));
  }, []);

  const customers = React.useMemo(() => {
    return fakeCustomers.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [fakeCustomers, search]);

  const top5 = customers
    .slice()
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const totalRevenue = fakeCustomers.reduce((a, b) => a + b.revenue, 0);
  const avgOrderValue = Math.floor(totalRevenue / fakeCustomers.length);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <Card className="p-6">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>
              Analyze your highest-spending customers
            </CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <Input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <CSVLink data={customers} filename="top-customers.csv">
              <Button variant="outline">
                <IconDownload className="h-4 w-4 mr-2" /> Export
              </Button>
            </CSVLink>
          </div>
        </CardHeader>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: fakeCustomers.length },
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}` },
          { label: "Average Order Value", value: `₹${avgOrderValue.toLocaleString()}` },
          { label: "Top Region", value: fakeCustomers[0].region },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-2">
              <CardDescription>{kpi.label}</CardDescription>
              <CardTitle>{kpi.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chart">
        <TabsList>
          <TabsTrigger value="chart">Revenue Chart</TabsTrigger>
          <TabsTrigger value="table">Customer Table</TabsTrigger>
        </TabsList>

        {/* Chart */}
        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Customers by Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={top5}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Table */}
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((cust) => (
                    <motion.tr
                      key={cust.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={cust.image} />
                            <AvatarFallback>{cust.name[0]}</AvatarFallback>
                          </Avatar>
                          <span>{cust.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{cust.email}</TableCell>
                      <TableCell>{cust.region}</TableCell>
                      <TableCell>{cust.orders}</TableCell>
                      <TableCell>₹{cust.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            cust.status === "Active"
                              ? "default"
                              : cust.status === "Pending"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {cust.status}
                        </Badge>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
