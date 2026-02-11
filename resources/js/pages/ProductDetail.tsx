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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-300 to-cyan-100">
      <Head title={product.name} />

      <div className="max-w-6xl mx-auto p-6">
        {/* BACK */}
        <Link
          href={route("shop")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur border border-white shadow hover:bg-white transition"
        >
          ← Kembali ke Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-10 mt-6">
          {/* IMAGE */}
          <div className="bg-white rounded-3xl shadow-2xl p-4">
            <img
              src={product.image ?? "/placeholder.png"}
              className="w-full h-[420px] object-cover rounded-2xl"
            />
          </div>

          {/* INFO */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-blue-950 drop-shadow-sm">
              {product.name}
            </h1>

            <p className="text-3xl font-bold text-blue-800 mt-3 drop-shadow-sm">
              Rp {product.price.toLocaleString()}
            </p>

            {/* STOCK */}
            <p
              className={`mt-2 font-semibold ${
                product.stock === 0 ? "text-red-700" : "text-emerald-700"
              }`}
            >
              {product.stock === 0
                ? "Stok habis"
                : `Stok tersedia: ${product.stock}`}
            </p>

            {/* LINE */}
            <div className="h-px bg-white/60 my-5" />

            {/* DESCRIPTION */}
            <div className="text-gray-700 leading-relaxed">
              {product.description || "Tidak ada deskripsi."}
            </div>

            {/* ACTION */}
            <div className="mt-6 flex gap-2">
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
                    : "bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                }`}
              >
                🛒 Masukkan ke Keranjang
              </button>
            </div>

            {/* EXTRA TRUST */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-700">
              <span>🚚 Pengiriman cepat</span>
              <span>🔒 Original</span>
              <span>✅ Bergaransi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
