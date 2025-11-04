"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Row,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  IconDotsVertical,
  IconGripVertical,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconSearch,
  IconFilter,
  IconTrendingUp,
  IconCash,
  IconChartBar,
  IconChevronDown,
  IconReceipt2,
  IconCalendarMonth,
} from "@tabler/icons-react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { toast } from "sonner";

// -----------------------------------------------------------------------------
// TYPE & MOCK DATA
// -----------------------------------------------------------------------------
type MonthlyReport = {
  id: string;
  month: string;
  totalOrders: number;
  totalRevenue: number;
  profitMargin: number;
  topProduct: string;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const initialReports: MonthlyReport[] = months.map((m, i) => ({
  id: `m${String(i + 1).padStart(2, "0")}`,
  month: m,
  totalOrders: 120 + i * 7,
  totalRevenue: Math.floor(30000 + Math.random() * 10000),
  profitMargin: Math.floor(20 + Math.random() * 15),
  topProduct: ["Wireless Headphones", "Running Shoes", "Smart Watch"][i % 3],
}));

// -----------------------------------------------------------------------------
// DnD + Table Row
// -----------------------------------------------------------------------------
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button {...attributes} {...listeners} variant="ghost" size="icon">
      <IconGripVertical className="text-muted-foreground" />
    </Button>
  );
}

function DraggableRow({ row }: { row: Row<MonthlyReport> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="hover:bg-muted/30"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------
export default function AdminMonthlyReport() {
  const [data, setData] = React.useState<MonthlyReport[]>(initialReports);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [pageSize, setPageSize] = React.useState(6);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  // Columns
  const columns = React.useMemo<ColumnDef<MonthlyReport>[]>(
    () => [
      {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
      },
      {
        accessorKey: "month",
        header: "Month",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 font-medium">
            <IconCalendarMonth size={16} className="text-primary" />
            {row.original.month}
          </div>
        ),
      },
      {
        accessorKey: "totalOrders",
        header: "Total Orders",
        cell: ({ row }) => row.original.totalOrders.toLocaleString(),
      },
      {
        accessorKey: "totalRevenue",
        header: "Revenue",
        cell: ({ row }) => `₹${row.original.totalRevenue.toLocaleString()}`,
      },
      {
        accessorKey: "profitMargin",
        header: "Profit Margin",
        cell: ({ row }) => (
          <Badge
            variant={row.original.profitMargin > 30 ? "default" : "secondary"}
          >
            {row.original.profitMargin}%
          </Badge>
        ),
      },
      {
        accessorKey: "topProduct",
        header: "Top Product",
        cell: ({ row }) => row.original.topProduct,
      },
    ],
    []
  );

  const filteredData = React.useMemo(() => {
    return data.filter((d) =>
      d.month.toLowerCase().includes(globalFilter.toLowerCase())
    );
  }, [data, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(filteredData.length / pageSize),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = data.findIndex((d) => d.id === active.id);
    const newIndex = data.findIndex((d) => d.id === over.id);
    setData((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  const handleExport = () => {
    const csvRows = [
      ["Month", "Orders", "Revenue", "Profit Margin", "Top Product"],
      ...data.map((r) => [
        r.month,
        r.totalOrders,
        r.totalRevenue,
        r.profitMargin,
        r.topProduct,
      ]),
    ];
    const csv = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "monthly_report.csv";
    a.click();
    toast.success("Monthly Report exported successfully!");
  };

  // Summary metrics
  const totalRevenue = data.reduce((a, b) => a + b.totalRevenue, 0);
  const avgProfit = (
    data.reduce((a, b) => a + b.profitMargin, 0) / data.length
  ).toFixed(1);
  const totalOrders = data.reduce((a, b) => a + b.totalOrders, 0);

  const dataIds = filteredData.map((d) => d.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full min-h-screen bg-background p-6"
    >
      {/* HEADER */}
      <div className="flex flex-col gap-4 border px-4 py-6 rounded-md shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Monthly Sales Report
            </h2>
            <p className="text-muted-foreground text-sm">
              Analyze monthly revenue, orders, and profit performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            {/* 🔍 Search */}
            <div className="relative">
              <IconSearch
                size={18}
                className="absolute left-2.5 top-2.5 text-muted-foreground"
              />
              <Input
                placeholder="Search month..."
                className="pl-8 w-56"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>

            {/* 🧭 Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-1 py-[17px]"
              >
                <IconDownload size={16} />
                Export Data
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <IconFilter size={16} />
                    {filter === "all" ? "Filter" : filter}
                    <IconChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilter("all")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("TopPerforming")}>
                    Top Performing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("LowPerforming")}>
                    Low Performing
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                size="sm"
                className="bg-primary text-white hover:bg-primary/90 py-[17px]"
              >
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Total Revenue</div>
            <IconCash className="text-primary" size={20} />
          </div>
          <div className="text-2xl font-bold">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Across all months</p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Total Orders</div>
            <IconReceipt2 className="text-primary" size={20} />
          </div>
          <div className="text-2xl font-bold">
            {totalOrders.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Completed orders</p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Average Profit</div>
            <IconTrendingUp className="text-primary" size={20} />
          </div>
          <div className="text-2xl font-bold">{avgProfit}%</div>
          <p className="text-xs text-muted-foreground">
            Average monthly margin
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Reports Generated</div>
            <IconChartBar className="text-primary" size={20} />
          </div>
          <div className="text-2xl font-bold">{data.length}</div>
          <p className="text-xs text-muted-foreground">Monthly records</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border bg-gradient-to-br from-background via-muted/30 to-background px-5 py-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            <IconChartBar size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight leading-none">
              Sales Insights
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Visual overview of sales, orders, and profit trends throughout the
              year.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <IconFilter size={16} />
            Filter Data
          </Button>
          <Button
            className="gap-1 bg-primary text-white hover:bg-primary/90"
            size="sm"
          >
            <IconDownload size={16} />
            Export Report
          </Button>
        </div>
      </div>

      {/* ANALYTICS CHARTS */}
      <div className="grid gap-4 md:grid-cols-2 mt-4 mb-8">
        {/* 📈 Revenue Trend */}
        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-sm font-medium mb-2">Yearly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              <Line
                type="monotone" 
                dataKey="totalRevenue"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 📊 Orders by Month */}
        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-sm font-medium mb-2">Total Orders per Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Bar
                dataKey="totalOrders"
                fill="hsl(var(--secondary))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 📉 Profit Margin Overview */}
        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-sm font-medium mb-2">Profit Margin Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
                formatter={(v) => `${v}%`}
              />
              <Area
                type="monotone"
                dataKey="profitMargin"
                stroke="hsl(var(--destructive))"
                fill="hsl(var(--destructive))"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 🥧 Top Products */}
        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-sm font-medium mb-2">Top Product Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={Object.entries(
                  data.reduce((acc, cur) => {
                    acc[cur.topProduct] =
                      (acc[cur.topProduct] || 0) + cur.totalOrders;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([name, value]) => ({ name, value }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {Object.keys(
                  data.reduce((acc, cur) => {
                    acc[cur.topProduct] =
                      (acc[cur.topProduct] || 0) + cur.totalOrders;
                    return acc;
                  }, {} as Record<string, number>)
                ).map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      [
                        "hsl(var(--primary))",
                        "hsl(var(--secondary))",
                        "hsl(var(--accent))",
                        "hsl(var(--muted-foreground))",
                        "hsl(var(--destructive))",
                      ][index % 5]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={dataIds}
            strategy={verticalListSortingStrategy}
          >
            <Table>
              <TableHeader className="bg-muted/40 sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table
                    .getRowModel()
                    .rows.map((row) => <DraggableRow key={row.id} row={row} />)
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => setPageSize(Number(v))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[6, 12, 24, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
}
