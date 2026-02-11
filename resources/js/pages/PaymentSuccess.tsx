import { Link, Head } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-300 to-cyan-100">
      <Head title="Pembayaran Berhasil" />

      {/* 🎉 CONFETTI */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <span
              key={i}
              className="absolute text-xl animate-confetti"
              style={{
                left: Math.random() * 100 + "%",
                animationDelay: Math.random() * 0.5 + "s",
              }}
            >
              🎉
            </span>
          ))}
        </div>
      )}

      {/* soft pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_30%,white,transparent_40%),radial-gradient(circle_at_50%_80%,white,transparent_40%)]" />

      <div className="relative flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-xl text-center bg-white/95 backdrop-blur rounded-3xl shadow-2xl px-10 py-14">
          
         {/* ICON */}
<div className="relative flex justify-center mb-6">
  <div className="absolute w-28 h-28 bg-emerald-400/30 blur-3xl rounded-full animate-pulse" />
  <div className="relative text-7xl success-icon">
    ✅
  </div>
</div>


          {/* TITLE */}
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">
            Pembayaran Berhasil 🎉
          </h1>

          {/* SUB */}
          <p className="text-gray-600 mt-4 leading-relaxed">
            Terima kasih sudah berbelanja.
            Pesanan kamu sekarang masuk antrian proses kami.
          </p>

          {/* MINI INFO */}
          <div className="mt-8 space-y-2 text-sm text-gray-500">
            <p>📦 Tim kami sedang menyiapkan paketmu</p>
            <p>⚡ Kamu akan mendapat notifikasi saat dikirim</p>
          </div>

          {/* CTA */}
          <div className="mt-10">
            <Link
              href={route("shop")}
              className="inline-block px-7 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-900 shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition"
            >
              Belanja Lagi 🛍️
            </Link>
          </div>
        </div>
      </div>

      {/* animation */}

<style>{`
  .success-icon {
    animation: popIn 0.8s cubic-bezier(.17,.67,.48,1.32);
  }

  @keyframes popIn {
    0% { transform: scale(0) translateY(20px); opacity: 0; }
    60% { transform: scale(1.25) translateY(-6px); opacity: 1; }
    100% { transform: scale(1) translateY(0); }
  }

  .animate-confetti {
    animation: confetti 3s linear forwards;
  }

  @keyframes confetti {
    0% { transform: translateY(-20px) rotate(0); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
`}</style>


      <style>{`
        .animate-success-bounce {
          animation: successBounce 0.6s ease;
        }

        @keyframes successBounce {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); }
        }

        .animate-confetti {
          animation: confetti 3s linear forwards;
        }

        @keyframes confetti {
          0% { transform: translateY(-20px) rotate(0); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
