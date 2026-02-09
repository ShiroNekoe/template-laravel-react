import { Head, router, Link } from "@inertiajs/react";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
  image?: string | null;
};

export default function ProductDetail({ product }: { product: Product }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-100 to-white">
      <Head title={product.name} />

      <div className="max-w-6xl mx-auto p-6">
        {/* BACK */}
        <Link
          href={route("shop")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur border border-blue-200 text-blue-700 font-medium shadow-sm hover:bg-blue-50 hover:shadow transition"

        >
          ← Kembali ke Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-10 mt-6">
          {/* IMAGE */}
          <div className="bg-white rounded-3xl shadow p-4">
            <img
              src={product.image ?? "/placeholder.png"}
              className="w-full h-[420px] object-cover rounded-2xl"
            />
          </div>

          {/* INFO */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-blue-900">
              {product.name}
            </h1>

            <p className="text-2xl font-bold text-blue-600 mt-3">
              Rp {product.price.toLocaleString()}
            </p>

            {/* STOCK */}
            <p
              className={`mt-2 font-medium ${
                product.stock === 0 ? "text-red-500" : "text-green-600"
              }`}
            >
              {product.stock === 0
                ? "Stok habis"
                : `Stok tersedia: ${product.stock}`}
            </p>

            {/* DESCRIPTION */}
            <div className="mt-5 text-gray-500 leading-relaxed">
              {product.description || "Tidak ada deskripsi."}
            </div>

            {/* ACTION */}
            <div className="mt-8 flex gap-3">
              <button
                disabled={product.stock === 0}
                onClick={() =>
                  router.post(route("cart.store"), {
                    product_id: product.id,
                  })
                }
                className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
  product.stock === 0
    ? "bg-gray-400 cursor-not-allowed"
    : "bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
}`}

              >
                🛒 Masukkan ke Keranjang

              </button>

              <Link
  href="/cart"
  className="flex-1 py-3 rounded-xl font-semibold text-blue-700 bg-white/90 backdrop-blur shadow-lg ring-1 ring-blue-200 text-center hover:-translate-y-0.5 transition"
>
  🛒 Lihat Keranjang
</Link>

            </div>

            {/* EXTRA TRUST */}
            <div className="mt-6 text-sm text-gray-400">
              🚚 Pengiriman cepat & aman <br />
              🔒 Garansi produk original
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
