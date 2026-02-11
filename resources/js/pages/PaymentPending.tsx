import { Link, Head } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function PaymentPending({ flash }: any) {
  const [showDots, setShowDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setShowDots((prev) =>
        prev.length >= 3 ? "." : prev + "."
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-yellow-500 via-yellow-200 to-white">
      <Head title="Menunggu Kurir" />

      {/* floating particles (soft vibe, bukan confetti) */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="absolute text-lg animate-float"
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: Math.random() * 1 + "s",
            }}
          >
            ⏳
          </span>
        ))}
      </div>

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
            Menunggu Pembayaran COD
          </h1>

          {/* SUB */}
          <p className="text-gray-600 mt-4 leading-relaxed">
            Kurir lagi jalan. Lu bayar pas barang sampai.
          </p>

          {flash?.order_id && (
            <p className="mt-3 text-sm text-gray-500">
              Order ID: #{flash.order_id}
            </p>
          )}

          {/* MINI INFO */}
          <div className="mt-8 space-y-2 text-sm text-gray-500">
            <p>🚚 Kurir akan menghubungi kamu</p>
            <p>📦 Status: <span className="font-bold">Pending</span></p>
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
          animation: popIn 0.8s cubic-bezier(.17,.67,.48,1.32);
        }

        @keyframes popIn {
          0% { transform: scale(0) translateY(20px); opacity: 0; }
          60% { transform: scale(1.25) translateY(-6px); opacity: 1; }
          100% { transform: scale(1) translateY(0); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0) rotate(0); opacity: 0.8; }
          50% { transform: translateY(-20px) rotate(10deg); opacity: 1; }
          100% { transform: translateY(0) rotate(0); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
