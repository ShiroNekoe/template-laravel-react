import { router, Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function CheckoutPayment({ cart }: { cart: any[] }) {
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const [selected, setSelected] = useState<string | null>(null);

  const pay = (method: string) => {
    setSelected(method);
    setTimeout(() => {
      router.post(route("order.store"), { method });
    }, 250);
  };

  const base =
    "relative text-left p-5 rounded-2xl border-2 transition-all duration-300 w-full bg-white hover:-translate-y-1 hover:shadow-2xl";

  const active =
    "border-blue-600 shadow-2xl scale-[1.03] ring-4 ring-blue-200";

  const idle = "border-transparent hover:border-blue-300 shadow-lg";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-300 to-cyan-100">
      <Head title="Pilih Pembayaran" />

      <div className="max-w-5xl mx-auto p-6">
        {/* BACK */}
        <Link
          href={route("cart.index")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur border border-white shadow hover:bg-white transition"
        >
          ← Kembali
        </Link>

        {/* WRAPPER */}
        <div className="mt-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40">
          <h1 className="text-3xl font-extrabold text-blue-900">
            Metode Pembayaran
          </h1>
          <p className="text-gray-500 mt-1">
            Pilih metode yang tersedia
          </p>

          {/* TOTAL */}
          <div className="mt-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-5 shadow-lg">
            <p className="text-sm text-blue-100">Total Pembayaran</p>
            <p className="text-3xl font-bold">
              Rp {total.toLocaleString()}
            </p>
          </div>

          {/* METHODS */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* VA */}
            <button
              onClick={() => pay("VA")}
              className={`${base} ${
                selected === "VA" ? active : idle
              }`}
            >
              <div className="absolute top-3 right-3 text-xs bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-1 rounded-full shadow">
                POPULER
              </div>

              <div className="flex items-center gap-3">
                <img src="/bank/bca.png" className="h-8" />
                <img src="/bank/bni.png" className="h-8" />
                <img src="/bank/bri.png" className="h-8" />
              </div>

              <div className="mt-4 font-bold text-lg text-blue-900">
                Transfer / Virtual Account
              </div>
              <div className="text-gray-500 text-sm">
                Verifikasi otomatis
              </div>
            </button>

            {/* COD */}
            <button
              onClick={() => pay("COD")}
              className={`${base} ${
                selected === "COD" ? active : idle
              }`}
            >
              <div className="text-3xl">🚚</div>

              <div className="mt-4 font-bold text-lg text-blue-900">
                Bayar di Tempat
              </div>
              <div className="text-gray-500 text-sm">
                Bayar saat pesanan diterima
              </div>
            </button>
          </div>

          {/* TRUST */}
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-600">
            <span>🔒 Aman</span>
            <span>⚡ Cepat</span>
            <span>✅ Diproses otomatis</span>
          </div>
        </div>
      </div>
    </div>
  );
}
