import { useState } from "react"
import {
  ColumnDef,
  RowSelectionState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from "lucide-react"
import { toast } from "sonner"

import { DataTable } from "@/components/data-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

import AppLayout from "@/layouts/app-layout"
import { Head, router } from "@inertiajs/react"
import type { Product } from "@/types"

type Props = {
  products: Product[]
}

export default function Products({ products }: Props) {
  const [search, setSearch] = useState("")
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>({})

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const columns: ColumnDef<Product, any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() &&
              "indeterminate")
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) =>
            row.toggleSelected(!!value)
          }
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(
              column.getIsSorted() === "asc"
            )
          }
        >
          Nama Produk
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(
              column.getIsSorted() === "asc"
            )
          }
        >
          Harga
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>
          Rp {row.original.price.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) =>
        row.original.image ? (
          <img
            src={`/storage/${row.original.image}`}
            alt={row.original.name}
            className="w-14 h-14 object-cover rounded-md"
          />
        ) : (
          <span className="text-muted-foreground text-sm">
            No Image
          </span>
        ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              router.get(
                `/admin/products/${row.original.id}/edit`
              )
            }
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => {
              if (!confirm("Yakin hapus?")) return

              router.delete(
                `/admin/products/${row.original.id}`,
                {
                  preserveScroll: true,
                  onSuccess: () => {
                    toast.success(
                      "Produk berhasil dihapus 🗑️"
                    )
                  },
                  onError: () => {
                    toast.error(
                      "Gagal menghapus produk ❌"
                    )
                  },
                }
              )
            }}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AppLayout
      breadcrumbs={[
        {
          title: "Products",
          href: "/admin/products",
        },
      ]}
    >
      <Head title="Manage Products" />

      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Kelola Produk
            </h1>
            <p className="text-muted-foreground text-sm">
              Atur dan kelola semua produk kamu di sini.
            </p>
          </div>

          
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <Input
            placeholder="Cari produk..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="max-w-sm"
          />

          <div className="flex items-center gap-2">
            {Object.keys(rowSelection).length > 0 && (
              <Button
                variant="outline"
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={() => {
                  const selectedIds =
                    Object.keys(rowSelection).map(
                      (index) =>
                        filteredProducts[
                          Number(index)
                        ]?.id
                    )

                  if (
                    !confirm(
                      "Hapus produk terpilih?"
                    )
                  )
                    return

                  selectedIds.forEach((id) => {
                    if (!id) return

                    router.delete(
                      `/admin/products/${id}`,
                      {
                        preserveScroll: true,
                      }
                    )
                  })

                  toast.success(
                    "Produk terpilih berhasil dihapus 🗑️"
                  )

                  setRowSelection({})
                }}
              >
                Hapus Terpilih (
                {Object.keys(rowSelection).length})
              </Button>
            )}

          <Button
            onClick={() =>
              router.get("/admin/products/create")
            }
          >
            Tambah Produk
          </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredProducts}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </div>
    </AppLayout>
  )
}