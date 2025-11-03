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
import {
  IconDotsVertical,
  IconTrash,
  IconGripVertical,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconUsers,
  IconUserCheck,
  IconStar,
  IconUserX,
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

// 💠 Seller type
type Seller = {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
};

// Dummy Data
const initialSellers: Seller[] = Array.from({ length: 20 }, (_, i) => ({
  id: `s${String(i + 1).padStart(3, "0")}`,
  name: `Seller ${i + 1}`,
  email: `seller${i + 1}@example.com`,
  phone: `+1-555-${Math.floor(1000000 + i).toString().padStart(7, "0")}`,
  image: `https://i.pravatar.cc/40?img=${i + 1}`,
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
function DraggableRow({ row }: { row: Row<Seller> }) {
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

export default function SellersPage() {
  const [data, setData] = React.useState<Seller[]>(initialSellers);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pageSize, setPageSize] = React.useState(10);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  // Table Columns
  const columns = React.useMemo<ColumnDef<Seller>[]>(() => [
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
        <img
          src={row.original.image}
          className="w-10 h-10 rounded-full border"
          alt={row.original.name}
        />
      ),
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <IconDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toast.info(`Editing ${row.original.name}`)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setData((prev) => prev.filter((d) => d.id !== row.original.id))}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], []);

  const filteredData = React.useMemo(
    () => data.filter((d) => d.name.toLowerCase().includes(globalFilter.toLowerCase())),
    [data, globalFilter]
  );

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
    toast.success("Selected sellers deleted.");
  };

  const handleExport = () => {
    const csvRows = [["Name", "Email", "Phone"], ...data.map((s) => [s.name, s.email, s.phone])];
    const csv = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sellers.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("📦 Data exported as sellers.csv");
  };

  const dataIds = filteredData.map((d) => d.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full min-h-screen bg-background p-6"
    >


      {/* Header Section */}
      <div className="flex flex-col gap-4 border px-4 py-6 rounded-md shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Sellers</h2>
            <p className="text-muted-foreground text-sm">Manage all your sellers here.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search sellers..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full sm:w-64"
            />

            {Object.keys(rowSelection).length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                className="whitespace-nowrap"
                onClick={handleDeleteSelected}
              >
                Delete Selected
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
              onClick={handleExport}
            >
              <IconDownload size={16} /> &nbsp; Export Data
            </Button>
          </div>
        </div>
      </div>
      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Sellers */}
        <Card>
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className=" font-semibold text-foreground">
              Total Sellers
            </CardTitle>
            <IconUsers className="text-primary" size={20} />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.length}</p>
            <CardDescription className="text-xs text-muted-foreground">
              +12% from last month
            </CardDescription>
          </CardContent>
        </Card>

        {/* Active Sellers */}
        <Card>
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className=" font-semibold text-foreground">
              Active Sellers
            </CardTitle>
            <IconUserCheck className="text-green-600" size={20} />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Math.floor(data.length * 0.8)}</p>
            <CardDescription className="text-xs text-muted-foreground">
              80% of all sellers
            </CardDescription>
          </CardContent>
        </Card>

        {/* Top Rated */}
        <Card>
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className=" font-semibold text-foreground">
              Top Rated
            </CardTitle>
            <IconStar className="text-yellow-500" size={20} />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Math.floor(data.length / 4)}</p>
            <CardDescription className="text-xs text-muted-foreground">
              Based on feedback
            </CardDescription>
          </CardContent>
        </Card>

        {/* Inactive Sellers */}
        <Card>
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className=" font-semibold text-foreground">
              Inactive Sellers
            </CardTitle>
            <IconUserX className="text-red-500" size={20} />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Math.floor(data.length * 0.2)}</p>
            <CardDescription className="text-xs text-muted-foreground">
              Need follow-up
            </CardDescription>
          </CardContent>
        </Card>
      </div>

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
