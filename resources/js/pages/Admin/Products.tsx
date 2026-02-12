import AppLayout from "@/layouts/app-layout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import type { Product } from "@/types";

type Props = {
  products: Product[];
};

export default function Products({ products }: Props) {
  const { data, setData, post, reset } = useForm({
    id: null as number | null,
    name: "",
    price: "",
    stock: "",
    description: "",
    image: null as File | null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

 function submit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (isEditing && data.id) {
    router.put(`/admin/products/${data.id}`, data, {
      forceFormData: true,
      onSuccess: () => {
        setIsEditing(false);
        reset();
      },
    });
  } else {
    post("/admin/products", {
      forceFormData: true,
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
      image: null, // biarin null, kecuali user upload baru
    });
  }

  return (
    <AppLayout breadcrumbs={[{ title: "Kelola Produk", href: "/admin/products" }]}>
      <Head title="Manage Products" />

      <div className="p-4 space-y-4">

        {/* FORM */}
        <div className="border p-4 rounded-xl bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-3">
            {isEditing ? "Edit Produk" : "Tambah Produk"}
          </h2>

          <form onSubmit={submit} className="grid grid-cols-4 gap-3">
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
              type="file"
              accept="image/*"
              onChange={(e) =>
                setData("image", e.target.files ? e.target.files[0] : null)
              }
              className="border p-2 rounded"
            />

            <input
              placeholder="Deskripsi"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              className="border p-2 rounded col-span-4"
            />

            <div className="col-span-4 flex gap-2">
              <button
                className={`px-4 py-2 rounded text-white ${
                  isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
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
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full"
        />

        {/* TABLE */}
        <div className="border p-4 rounded-xl bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Daftar Produk</h2>

          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Price</th>
                <th className="border p-2 text-left">Stock</th>
                <th className="border p-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-400">
                    Produk gak ketemu.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="border p-2">{p.name}</td>
                    <td className="border p-2">Rp {p.price.toLocaleString()}</td>
                    <td className="border p-2">{p.stock}</td>
                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          confirm("Yakin hapus?") &&
                          router.delete(`/admin/products/${p.id}`)
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
