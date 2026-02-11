import { Link, Head } from "@inertiajs/react";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-300 to-cyan-100">
      <Head title="Pembayaran Berhasil" />

      <div className="bg-white p-10 rounded-2xl shadow-lg text-center animate-fade-in">
        <div className="text-6xl mb-4 animate-pulse">✅</div>
        <h1 className="text-2xl font-bold text-green-700">
          Pembayaran Berhasil!
        </h1>
        <p className="text-gray-500 mt-2">
          Order kamu lagi diproses.
        </p>

        <Link
          href={route("shop")}
          className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Kembali ke Shop
        </Link>
      </div>

      <style>
        {`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        `}
      </style>
    </div>
  );
}
