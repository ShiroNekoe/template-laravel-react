import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateProduct() {
  const { data, setData, post, processing } = useForm({
    name: "",
    price: "",
    stock: "",
    description: "",
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    post("/admin/products", {
      forceFormData: true,
      onSuccess: () => {
        toast.success("Produk berhasil dibuat 🚀");

        // reset form
        setData({
          name: "",
          price: "",
          stock: "",
          description: "",
          image: null,
        });

        setPreview(null);
      },
      onError: () => {
        toast.error("Gagal membuat produk ❌");
      },
    });
  }

  function handleImageChange(file: File | null) {
    setData("image", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Products", href: "/admin/products" },
        { title: "Create Product", href: "/admin/products/create" },
      ]}
    >
      <Head title="Create Product" />

      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tambah Produk Baru</h1>

        <form onSubmit={submit} className="grid grid-cols-2 gap-10">
          {/* LEFT SIDE - FORM */}
          <div className="space-y-5">
            <div>
              <label className="block mb-1 font-medium">Nama Produk</label>
              <input
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Harga</label>
              <input
                type="number"
                value={data.price}
                onChange={(e) => setData("price", e.target.value)}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Stok</label>
              <input
                type="number"
                value={data.stock}
                onChange={(e) => setData("stock", e.target.value)}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Deskripsi</label>
              <textarea
                rows={4}
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Upload Gambar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(
                    e.target.files ? e.target.files[0] : null
                  )
                }
                className="w-full"
              />
            </div>

            <button
              type="submit"
              disabled={processing}
              className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition"
            >
              {processing ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </div>

          {/* RIGHT SIDE - IMAGE PREVIEW */}
          <div className="flex items-center justify-center border border-dashed border-gray-300 rounded-xl min-h-[400px] bg-gray-50">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-[400px] object-contain rounded-lg shadow-md"
              />
            ) : (
              <div className="text-gray-400 text-center">
                <p className="text-lg">Preview Gambar</p>
                <p className="text-sm mt-2">
                  Belum ada gambar dipilih
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </AppLayout>
  );
}