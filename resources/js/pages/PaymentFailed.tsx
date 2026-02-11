import { Link, Head } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function PaymentFailed() {
  const [showMarks, setShowMarks] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowMarks(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-600 via-rose-400 to-red-100">
      <Head title="Pembayaran Gagal" />

      {/* ❌ hujan X */}
      {showMarks && (
        <div className="pointer-events-none absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <span
              key={i}
              className="absolute text-xl animate-fall"
              style={{
                left: Math.random() * 100 + "%",
                animationDelay: Math.random() * 0.5 + "s",
              }}
            >
              ❌
            </span>
          ))}
        </div>
      )}

      {/* pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_30%,white,transparent_40%),radial-gradient(circle_at_50%_80%,white,transparent_40%)]" />

      <div className="relative flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-xl text-center bg-white/95 backdrop-blur rounded-3xl shadow-2xl px-10 py-14">

          {/* ICON */}
          <div className="relative flex justify-center mb-6">
            <div className="absolute w-28 h-28 bg-red-400/30 blur-3xl rounded-full animate-pulse" />
            <div className="relative text-7xl failed-icon">
              ❌
            </div>
          </div>

          {/* TITLE */}
          <h1 className="text-4xl font-extrabold text-red-700">
            Pembayaran Gagal
          </h1>

          {/* SUB */}
          <p className="text-gray-600 mt-4 leading-relaxed">
            Transaksi belum berhasil.
            Kamu bisa mencoba lagi atau memilih metode lain.
          </p>

          {/* ACTION */}
          <div className="mt-10 flex gap-4 justify-center">
            <Link
              href={route("checkout.payment")}
              className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-red-700 shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition"
            >
              Coba Lagi 🔄
            </Link>

            <Link
              href={route("shop")}
              className="px-6 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition"
            >
              Kembali ke Shop
            </Link>
          </div>
        </div>
      </div>

      {/* animation */}
      <style>{`
        .failed-icon {
          animation: popIn 0.7s cubic-bezier(.17,.67,.48,1.32);
        }

        @keyframes popIn {
          0% { transform: scale(0) translateY(20px); opacity: 0; }
          60% { transform: scale(1.2) translateY(-6px); opacity: 1; }
          100% { transform: scale(1) translateY(0); }
        }

        .animate-fall {
          animation: fall 3s linear forwards;
        }

        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
