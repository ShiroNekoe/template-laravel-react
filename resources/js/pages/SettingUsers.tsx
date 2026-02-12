import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Settings({ user }: any) {
  const [showSuccess, setShowSuccess] = useState(false);

  const { data, setData, put, processing } = useForm({
    name: user.name,
    address: user.address || "",
    phone: user.phone || "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();

    put(route("settings.update"), {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2500);
      },
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-300 to-cyan-100">
      <Head title="Settings" />

      <div className="max-w-3xl mx-auto p-6">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href={route("shop")}
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/90 backdrop-blur shadow font-bold"
          >
            🛒
          </Link>

          <div>
            <h1 className="text-3xl font-extrabold text-white">
              Pengaturan Akun ⚙️
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Update data diri dan alamat pengiriman kamu.
            </p>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="relative bg-white/95 backdrop-blur rounded-3xl shadow-xl p-6 overflow-hidden">
          <form onSubmit={submit} className="space-y-5">

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Nama
              </label>
              <input
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className="w-full mt-1 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none rounded-xl px-4 py-3 transition"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Alamat
              </label>
              <textarea
                value={data.address}
                onChange={(e) => setData("address", e.target.value)}
                className="w-full mt-1 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none rounded-xl px-4 py-3 transition"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Nomor HP
              </label>
              <input
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                className="w-full mt-1 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none rounded-xl px-4 py-3 transition"
              />
            </div>

            <button
              disabled={processing}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition disabled:opacity-70"
            >
              {processing ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>

          {/* ✅ SUCCESS ANIMATION */}
          {showSuccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur">
              <div className="text-center animate-success">
                <div className="text-6xl mb-3">✅</div>
                <p className="font-bold text-green-600">
                  Berhasil Disimpan!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ANIMATION STYLE */}
      <style>{`
        .animate-success {
          animation: pop .4s ease;
        }
        @keyframes pop {
          from { transform: scale(.7); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
