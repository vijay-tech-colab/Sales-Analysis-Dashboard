"use client";

import * as React from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, Row, getPaginationRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconDotsVertical, IconTrash, IconGripVertical, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { DndContext, closestCenter, useSensor, useSensors, MouseSensor, TouchSensor, KeyboardSensor, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Seller = {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
};

const initialSellers: Seller[] = Array.from({ length: 50 }, (_, i) => ({
  id: `s${String(i + 1).padStart(3, "0")}`,
  name: `Seller ${i + 1}`,
  email: `seller${i + 1}@example.com`,
  phone: `+1-555-${Math.floor(1000000 + i).toString().padStart(7, "0")}`,
  image: `https://i.pravatar.cc/40?img=${i + 1}`,
}));

// Drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button {...attributes} {...listeners} variant="ghost" size="icon">
      <IconGripVertical />
    </Button>
  );
}

// Draggable row
function DraggableRow({ row }: { row: Row<Seller> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({ id: row.original.id });
  return (
    <TableRow
      ref={setNodeRef}
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="hover:bg-muted/30"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  );
}

export default function SellersPage() {
  const [data, setData] = React.useState<Seller[]>(initialSellers);
  const [rowSelection, setRowSelection] = React.useState<{ [key: string]: boolean }>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pageSize, setPageSize] = React.useState(10);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor));

  // Columns
  const columns: ColumnDef<Seller>[] = React.useMemo(() => [
    { id: "drag", header: () => null, cell: ({ row }) => <DragHandle id={row.original.id} /> },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
    },
    { accessorKey: "image", header: "Image", cell: ({ row }) => <img src={row.original.image} className="w-10 h-10 rounded-full" /> },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><IconDotsVertical /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => alert(`Edit ${row.original.name}`)}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => setData((prev) => prev.filter((d) => d.id !== row.original.id))}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], []);

  const filteredData = React.useMemo(() => data.filter((d) => d.name.toLowerCase().includes(globalFilter.toLowerCase())), [data, globalFilter]);

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
  };

  const dataIds = filteredData.map((d) => d.id);

  return (
    <div className="w-full min-h-screen bg-background p-6">
    <Card className="p-6">
      {/* Header: Title + Search + Actions */}
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <CardTitle>Sellers</CardTitle>
          <CardDescription>Manage all your sellers here</CardDescription>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <Input placeholder="Search sellers..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="w-64" />
          {Object.keys(rowSelection).length > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelected}>Delete Selected</Button>
          )}
          <Button>More Actions</Button>
        </div>
      </CardHeader>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => <DraggableRow key={row.id} row={row} />)
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">No results found</TableCell>
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
                <SelectItem key={size} value={String(size)}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
    </div>
  );
}
