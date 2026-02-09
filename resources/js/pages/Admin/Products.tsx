import AppLayout from "@/layouts/app-layout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import type { Product } from "@/types";

type Props = {
  products: Product[];
};

export default function Products({ products }: Props) {
  const { data, setData, post, put, reset } = useForm({
    id: null as number | null,
    name: "",
    price: "",
    stock: "",
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isEditing && data.id) {
      put(`/admin/products/${data.id}`, {
        onSuccess: () => {
          setIsEditing(false);
          reset();
        },
      });
    } else {
      post("/admin/products", {
        onSuccess: () => reset(),
      });
    }
  }

  function handleEdit(p: Product) {
    setIsEditing(true);
    setData({
      id: p.id,
      name: p.name,
      price: String(p.price),
      stock: String(p.stock),
      description: p.description || "",
    });
  }

  return (
    <AppLayout breadcrumbs={[{ title: "Kelola Produk", href: "/admin/products" }]}>
      <Head title="Manage Products" />

      <div className="p-4 space-y-4">

        {/* FORM CARD */}
        <div className="border p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-3">
            {isEditing ? "Edit Produk" : "Tambah Produk"}
          </h2>

          <form onSubmit={submit} className="flex gap-2 flex-wrap">
            <input
              placeholder="Name"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              placeholder="Price"
              type="number"
              value={data.price}
              onChange={(e) => setData("price", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              placeholder="Stock"
              type="number"
              value={data.stock}
              onChange={(e) => setData("stock", e.target.value)}
              className="border p-2 rounded"
            />

            <input
              placeholder="deskripsi"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              className="border p-2 rounded"
            />

            <button
              className={`px-4 py-2 rounded text-white ${
                isEditing ? "bg-green-600" : "bg-blue-600"
              }`}
            >
              {isEditing ? "Update" : "Add"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  reset();
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* TABLE CARD */}
        <div className="border p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-3">Daftar Produk</h2>

          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Stock</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="border p-2">{p.name}</td>
                  <td className="border p-2">Rp {p.price}</td>
                  <td className="border p-2">{p.stock}</td>
                  <td className="border p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => router.delete(`/admin/products/${p.id}`)}
                      className="text-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </AppLayout>
  );
}
