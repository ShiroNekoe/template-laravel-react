import AppLayout from "@/layouts/app-layout"
import { Head, Link } from "@inertiajs/react"
import { useMemo, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

type Order = {
  id: number
  status: "pending" | "paid" | "packing" | "shipped" | "completed"
  total: number
  user: { name: string }
  created_at: string
}

type Props = {
  orders: {
    pending: Order[]
    paid: Order[]
    packing: Order[]
    shipped: Order[]
    completed: Order[]
  }
}

export default function AdminOrdersDashboard({ orders }: Props) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // 🔥 Flatten semua status jadi satu array
  const allOrders: Order[] = useMemo(() => {
    return Object.values(orders).flat()
  }, [orders])

  // 🔎 Filtering logic
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const matchSearch =
        order.id.toString().includes(search) ||
        order.user.name.toLowerCase().includes(search.toLowerCase())

      const matchStatus =
        statusFilter === "all" || order.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [allOrders, search, statusFilter])

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => (
        <Link
          href={route("admin.orders.show", row.original.id)}
          className="font-semibold hover:underline"
        >
          #{row.original.id}
        </Link>
      ),
    },
    {
      accessorKey: "user",
      header: "Customer",
      cell: ({ row }) => row.original.user.name,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) =>
        `Rp ${Number(row.original.total).toLocaleString()}`,
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) =>
        new Date(row.original.created_at).toLocaleString(),
    },
  ]

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Orders", href: "/admin/orders" },
      ]}
    >
      <Head title="Admin Orders" />

      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">
          Manage Orders
        </h1>

        {/* FILTER AREA */}
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Cari Order ID atau Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="packing">Packing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* DATA TABLE */}
        <DataTable columns={columns} data={filteredOrders} />
      </div>
    </AppLayout>
  )
}