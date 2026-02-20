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
        <button
          onClick={() => router.get("/admin/products/create")}
          className="mb-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Tambah Produk
        </button>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Price</th>
                <th className="border p-2 text-left">Stock</th>
                <th className="border p-2 text-left">Image</th>
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
                   <td className="border p-2">
                      {p.image ? (
                        <img
                          src={`/storage/${p.image}`}
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </td>
                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() => router.get(`/admin/products/${p.id}/edit`)}

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
