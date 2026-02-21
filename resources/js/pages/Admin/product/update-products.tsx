import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import type { Product } from "@/types";

type Props = {
  product: Product;
};

export default function UpdateProduct({ product }: Props) {
  const { data, setData, put, processing } = useForm({
    name: product.name,
    price: product.price, // kirim number
    stock: product.stock, // kirim number
    description: product.description ?? "",
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(
    product.image ? `/storage/${product.image}` : null
  );

  const handleImageChange = (file: File | null) => {
    setData("image", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(product.image ? `/storage/${product.image}` : null);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    put(`/admin/products/${product.id}`, {
      forceFormData: true,
      onSuccess: () => {
        // opsional: kasih toast / redirect
        console.log("Updated successfully!");
      },
      onError: (errors) => {
        console.log(errors);
      },
    });
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Products", href: "/admin/products" },
        { title: `Update Product #${product.id}`, href: `/admin/products/${product.id}/edit` },
      ]}
    >
      
      <Head title="Update Product" />

      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Update Produk</h1>

        <form onSubmit={submit} className="grid grid-cols-2 gap-10">
          {/* LEFT FORM */}
          <div className="space-y-4">
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="Nama Produk"
              className="w-full border p-3 rounded"
            />

            <input
              type="number"
              value={data.price}
              onChange={(e) => setData("price", Number(e.target.value))}
              placeholder="Harga"
              className="w-full border p-3 rounded"
            />

            <input
              type="number"
              value={data.stock}
              onChange={(e) => setData("stock", Number(e.target.value))}
              placeholder="Stok"
              className="w-full border p-3 rounded"
            />

            <textarea
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              placeholder="Deskripsi"
              className="w-full border p-3 rounded"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImageChange(e.target.files ? e.target.files[0] : null)
              }
            />

            <button
              disabled={processing}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
            >
              Update
            </button>
          </div>

          {/* RIGHT PREVIEW */}
          <div className="flex items-center justify-center border rounded-lg bg-gray-50 min-h-[300px]">
            {preview ? (
              <img
                src={preview}
                className="max-h-[300px] object-contain"
                alt="Preview"
              />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>
        </form>
      </div>
    </AppLayout>
  );
}