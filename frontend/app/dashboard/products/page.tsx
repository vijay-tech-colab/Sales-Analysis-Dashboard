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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
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
  IconTrash,
  IconGripVertical,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconSearch,
  IconFilter,
  IconBox,
  IconPackage,
  IconTrendingUp,
  IconEye,
  IconEdit,
  IconChevronDown,
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

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  image: string;
};

const productNames = [
  "Wireless Headphones",
  "Running Shoes",
  "Smart Watch",
  "Leather Wallet",
  "Table Lamp",
  "Bluetooth Speaker",
  "Sunglasses",
  "Backpack",
  "Gaming Mouse",
  "Coffee Mug",
  "Desk Organizer",
  "Hoodie",
];

// Create initial products (deterministic for preview)
const initialProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
  id: `p${String(i + 1).padStart(3, "0")}`,
  name: productNames[i],
  category: ["Electronics", "Fashion", "Home"][i % 3],
  price: Math.floor((i + 1) * 499 + (i % 5) * 150),
  stock: (i * 7 + 3) % 45,
  sales: (i * 37 + 13) % 900,
  image: `https://picsum.photos/seed/prod${i}/100/100`,
}));

// Drag Handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button {...attributes} {...listeners} variant="ghost" size="icon">
      <IconGripVertical className="text-muted-foreground" />
    </Button>
  );
}

// Draggable Row
function DraggableRow({ row }: { row: Row<Product> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      ref={setNodeRef}
      data-state={row.getIsSelected() && "selected"}
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

export default function AdminProductsWithTable() {
  const [data, setData] = React.useState<Product[]>(initialProducts);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [pageSize, setPageSize] = React.useState(10);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  // Columns
  const columns = React.useMemo<ColumnDef<Product>[]>(
    () => [
      { id: "drag", header: () => null, cell: ({ row }) => <DragHandle id={row.original.id} /> },
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
      },
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => (
          <img src={row.original.image} alt={row.original.name} className="w-10 h-10 rounded-md object-cover" />
        ),
      },
      {
        accessorKey: "name",
        header: "Product",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div>
              <div className="font-medium">{row.original.name}</div>
              <div className="text-xs text-muted-foreground">#{row.original.id}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge>,
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => `₹${row.original.price}`,
      },
      {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => (
          <span className={
            row.original.stock > 10
              ? "text-green-600"
              : row.original.stock > 0
                ? "text-yellow-600"
                : "text-red-600"
          }>
            {row.original.stock}
          </span>
        ),
      },
      {
        accessorKey: "sales",
        header: "Sales",
        cell: ({ row }) => row.original.sales,
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <IconDotsVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast.info(`Viewing ${row.original.name}`)}>
                  <IconEye className="mr-2 inline" /> View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info(`Editing ${row.original.name}`)}>
                  <IconEdit className="mr-2 inline" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setData((prev) => prev.filter((p) => p.id !== row.original.id))}
                >
                  <IconTrash className="mr-2 inline" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    []
  );

  const filteredData = React.useMemo(() => {
    return data
      .filter((d) => (filter === "all" ? true : d.category === filter))
      .filter((d) => d.name.toLowerCase().includes(globalFilter.toLowerCase()));
  }, [data, globalFilter, filter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
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

  const handleDeleteSelected = () => {
    const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
    setData((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
    setRowSelection({});
    toast.success("Selected products deleted.");
  };

  const handleExport = () => {
    const csvRows = [
      ["ID", "Name", "Category", "Price", "Stock", "Sales"],
      ...data.map((p) => [p.id, p.name, p.category, p.price, p.stock, p.sales]),
    ];
    const csv = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported as products.csv");
  };

  const dataIds = filteredData.map((d) => d.id);

  // Summary numbers
  const totalStock = data.reduce((a, b) => a + b.stock, 0);
  const totalSales = data.reduce((a, b) => a + b.sales, 0);
  const categoriesCount = Array.from(new Set(data.map((d) => d.category))).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full min-h-screen bg-background p-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border px-4 py-6 rounded-md shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Products Overview</h2>
          <p className="text-muted-foreground text-sm">Manage, track and analyze your product performance.</p>
        </div>
        

        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
      {/* 🔍 Search */}
      <div className="relative">
        <IconSearch
          size={18}
          className="absolute left-2.5 top-2.5 text-muted-foreground"
        />
        <Input
          placeholder="Search product..."
          className="pl-8 w-56"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* 🧭 Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Delete Selected (only if rows are selected) */}
        {Object.keys(rowSelection).length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
            className="gap-1"
          >
            <IconTrash size={16} />
            Delete Selected
          </Button>
        )}

        {/* Export */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="gap-1 py-[17px]"
        >
          <IconDownload size={16} />
          Export Data
        </Button>

        {/* shadcn Filter Dropdown */}
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
            <DropdownMenuItem onClick={() => setFilter("Electronics")}>
              Electronics
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("Fashion")}>
              Fashion
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("Home")}>
              Home
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Add Product */}
        <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
          Add Product
        </Button>
      </div>
      </div>
    </div>

      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Total Products</div>
            <IconBox className="text-primary" size={20} />
          </div>
          <div className="text-2xl font-bold">{data.length}</div>
          <p className="text-xs text-muted-foreground">Active listings</p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Total Stock</div>
            <IconPackage className="text-primary" size={20} />
          </div>
          <div className="text-2xl font-bold">{totalStock}</div>
          <p className="text-xs text-muted-foreground">Units available</p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Total Sales</div>
            <IconTrendingUp className="text-primary" size={20} />
          </div>
          <div className="text-2xl font-bold">{totalSales}</div>
          <p className="text-xs text-muted-foreground">Total sold items</p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Categories</div>
            <IconFilter className="text-primary" size={20} />
          </div>
          <div className="text-2xl font-bold">{categoriesCount}</div>
          <p className="text-xs text-muted-foreground">Active categories</p>
        </div>
      </div>

      {/* Table Controls */}


      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
            <Table>
              <TableHeader className="bg-muted/40 sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => <DraggableRow key={row.id} row={row} />)
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <IconChevronLeft />
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <IconChevronRight />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50].map((size) => (
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
