import { Link, Head } from "@inertiajs/react";

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-300 to-cyan-100">
      <Head title="Pembayaran Gagal" />

      <div className="bg-white p-10 rounded-2xl shadow-lg text-center animate-pulse">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-red-700">
          Pembayaran Gagal
        </h1>
        <p className="text-gray-500 mt-2">
          Silakan coba lagi atau pilih metode lain.
        </p>

        <div className="flex gap-4 justify-center mt-6">
          <Link
            href={route("checkout.payment")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Coba Lagi
          </Link>

          <Link
            href={route("shop")}
            className="border px-6 py-3 rounded-xl"
          >
            Kembali ke Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
