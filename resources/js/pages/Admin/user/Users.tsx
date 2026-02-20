import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import AppLayout from "@/layouts/app-layout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  address?: string | null;
  phone?: string | null;
};

type Props = {
  users: User[];
};

export default function Users({ users }: Props) {
  const { data, setData, reset } = useForm({
    id: null as number | null,
    name: "",
    email: "",
    role: "user" as "user" | "admin",
    address: "",
    phone: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleEdit(u: User) {
    setIsEditing(true);
    setData({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      address: u.address || "",
      phone: u.phone || "",
    });
  }

  // 📊 Columns
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) =>
        row.original.role === "admin" ? (
          <Badge variant="destructive">Admin</Badge>
        ) : (
          <Badge variant="secondary">User</Badge>
        ),
    },
    {
      accessorKey: "address",
      header: "Alamat",
      cell: ({ row }) => row.original.address || "-",
    },
    {
      accessorKey: "phone",
      header: "No HP",
      cell: ({ row }) => row.original.phone || "-",
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleEdit(row.original)}
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() =>
              confirm("Yakin hapus user ini?") &&
              router.delete(`/admin/users/${row.original.id}`)
            }
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout
      breadcrumbs={[{ title: "User Settings", href: "/admin/users" }]}
    >
      <Head title="Admin User Settings" />

      <div className="p-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">
            Manajemen User
          </h1>
          <p className="text-muted-foreground text-sm">
            Kelola semua akun user dan admin.
          </p>
        </div>

        {/* Search */}
        <Input
          placeholder="Cari nama / email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        {/* Table */}
        <DataTable columns={columns} data={filteredUsers} />

      </div>
    </AppLayout>
  );
}