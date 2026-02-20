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
  const { data, setData, put, reset } = useForm({
    id: null as number | null,
    name: "",
    email: "",
    role: "user" as "user" | "admin",
    address: "",
    phone: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (data.id) {
      router.put(`/admin/users/${data.id}`, data, {
        onSuccess: () => {
          setIsEditing(false);
          reset();
        },
      });
    }
  }

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

  return (
    <AppLayout breadcrumbs={[{ title: "User Settings", href: "/admin/users" }]}>
      <Head title="Admin User Settings" />

      <div className="p-4 space-y-4">

        {/* FORM EDIT USER */}
        {isEditing && (
          <div className="border p-4 rounded-xl bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Edit User</h2>

            <form onSubmit={submit} className="grid grid-cols-4 gap-3">
              <input
                placeholder="Name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className="border p-2 rounded"
              />

              <input
                placeholder="Email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                className="border p-2 rounded"
              />

              <select
                value={data.role}
                onChange={(e) => setData("role", e.target.value as any)}
                className="border p-2 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <input
                placeholder="Alamat Pengiriman"
                value={data.address}
                onChange={(e) => setData("address", e.target.value)}
                className="border p-2 rounded col-span-4"
              />

              <input
                placeholder="nomor telepon"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                className="border p-2 rounded col-span-4"
              />

              <div className="col-span-4 flex gap-2">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                  Update
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    reset();
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Cari nama / email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full"
        />

        {/* TABLE USER */}
        <div className="border p-4 rounded-xl bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Daftar User</h2>

          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Role</th>
                <th className="border p-2 text-left">Address</th>
                <th className="border p-2 text-left">nomor hp</th>
                <th className="border p-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-400">
                    User gak ketemu.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="border p-2">{u.name}</td>
                    <td className="border p-2">{u.email}</td>
                    <td className="border p-2 font-semibold">
                      {u.role === "admin" ? "🛡 Admin" : "👤 User"}
                    </td>
                    <td className="border p-2">{u.address || "-"}</td>
                    <td className="border p-2">{u.phone || "-"}</td>
                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          confirm("Yakin hapus user ini?") &&
                          router.delete(`/admin/users/${u.id}`)
                        }
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
