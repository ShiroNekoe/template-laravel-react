import { router, Link, Head } from "@inertiajs/react";
import { useState } from "react";

type CartItem = {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image?: string | null;
  };
};

export default function Cart({ cartItems }: { cartItems: CartItem[] }) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  function updateQty(id: number, qty: number) {
    if (qty < 1) return;

    setLoadingId(id);

    router.put(
      route("cart.update", id),
      { quantity: qty },
      {
        preserveScroll: true,
        onFinish: () => setLoadingId(null),
      }
    );
  }

  function deleteItem(id: number) {
    setLoadingId(id);

    router.delete(route("cart.destroy", id), {
      preserveScroll: true,
      onFinish: () => setLoadingId(null),
    });
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-300 to-cyan-100">
      <Head title="Keranjang" />

      {/* background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_30%,white,transparent_40%),radial-gradient(circle_at_50%_80%,white,transparent_40%)]" />

      <div className="relative max-w-6xl mx-auto p-6">
        <Link
          href={route("shop")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur border border-blue-200 text-blue-700 font-medium shadow-sm hover:bg-blue-50 transition"
        >
          ← Lanjut belanja
        </Link>

        <h1 className="text-3xl font-extrabold text-blue-900 mt-6 mb-6">
          Keranjang Belanja 🛒
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-12 text-center">
            <div className="text-5xl mb-3">🛍️</div>
            <p className="text-gray-500">Keranjang kamu masih kosong.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* LIST */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white/90 backdrop-blur rounded-3xl shadow-md p-4 flex gap-4 transition
                  ${loadingId === item.id ? "scale-[0.98] opacity-70" : "hover:shadow-2xl"}`}
                >
                  {/* IMAGE */}
                  <div className="bg-blue-50 p-2 rounded-2xl">
                    <img
                      src={item.product.image ?? "/placeholder.png"}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex-1">
                    <h3 className="font-bold text-blue-900">
                      {item.product.name}
                    </h3>

                    <p className="text-blue-600 font-semibold mt-1">
                      Rp {item.product.price.toLocaleString()}
                    </p>

                    {/* QTY */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || loadingId === item.id}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-blue-200 bg-white hover:bg-blue-100 transition font-bold disabled:opacity-40"
                      >
                        -
                      </button>

                      {/* angka dengan animasi */}
                      <span
                        className={`min-w-[44px] h-9 flex items-center justify-center font-bold text-blue-700 bg-blue-50 rounded-xl transition ${
                          loadingId === item.id ? "animate-pulse" : ""
                        }`}
                      >
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        disabled={loadingId === item.id}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-blue-200 bg-white hover:bg-blue-100 transition font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* PRICE + DELETE */}
                  <div className="text-right flex flex-col justify-between">
                    <p className="font-bold text-blue-900">
                      Rp{" "}
                      {(item.product.price * item.quantity).toLocaleString()}
                    </p>

                    <button
                      onClick={() => deleteItem(item.id)}
                      disabled={loadingId === item.id}
                      className="text-red-500 text-sm hover:underline disabled:opacity-40"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="sticky top-6 bg-white/95 backdrop-blur rounded-3xl shadow-xl p-6 h-fit">
              <h2 className="font-bold text-blue-900 mb-4">
                Ringkasan Belanja
              </h2>

              <div className="flex justify-between text-sm">
                <span>Total</span>
                <span className="font-extrabold text-lg text-blue-700">
                  Rp {total.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => router.visit(route("checkout.payment"))}
                className="w-full mt-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition"
              >
                Checkout Sekarang 🚀
              </button>

              <Link
                href={route("shop")}
                className="block text-center text-sm text-gray-400 mt-3 hover:underline"
              >
                Tambah produk lagi
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
