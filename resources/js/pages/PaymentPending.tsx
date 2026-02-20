import { Link, Head } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";

export default function PaymentPending({ flash }: any) {
  const [showMarks, setShowMarks] = useState<string | boolean>(".");


  useEffect(() => {
    const timer = setTimeout(() => setShowMarks(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-yellow-500 via-yellow-200 to-white">
      <Head title="Menunggu Pembayaran" />

      {/* ⏳ hujan X */}
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
              ⏳
            </span>
          ))}
        </div>
      )}

      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_30%,white,transparent_40%),radial-gradient(circle_at_50%_80%,white,transparent_40%)]" />

      <div className="relative flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-xl text-center bg-white/95 backdrop-blur rounded-3xl shadow-2xl px-10 py-14">

          {/* ICON */}
          <div className="relative flex justify-center mb-6">
            <div className="absolute w-28 h-28 bg-yellow-400/30 blur-3xl rounded-full animate-pulse" />
            <div className="relative text-7xl pending-icon">
              ⏳
            </div>
          </div>

          {/* TITLE */}
          <h1 className="text-4xl font-extrabold text-yellow-800 tracking-tight">
            Menunggu pembayaran{showMarks}
          </h1>

          {/* SUB */}
          <p className="text-gray-600 mt-4 leading-relaxed">
            Terima kasih telah melakukan pemesanan. Silakan siapkan pembayaran
          </p>

          {flash?.order_id && (
            <p className="mt-3 text-sm text-gray-500">
              Order ID: #{flash.order_id}
            </p>
          )}

          {/* MINI INFO */}
          <div className="mt-8 space-y-2 text-sm text-gray-500">
            <p>jangan lupa untuk membayar</p>
            <p>
              📦 Status: <span className="font-bold">Pending</span>
            </p>
          </div>

          {/* CTA */}
          <div className="mt-10">
            <Link
              href={route("shop")}
              className="inline-block px-7 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition"
            >
              Lihat Produk Lain 🛍️
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .pending-icon {
          animation: popIn 0.7s cubic-bezier(.17,.67,.48,1.32);
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-fall {
          animation: fall 3s linear forwards;
        }
        @keyframes fall {
          from { transform: translateY(-20px) rotate(0); opacity: 1; }
          to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}