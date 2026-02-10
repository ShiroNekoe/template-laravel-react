import { router, Link, Head } from "@inertiajs/react";

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
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * (item.quantity ?? 1),
    0
  );

  function updateQty(id: number, qty: number) {
    if (qty < 1) return;
    router.put(route("cart.update", id), { quantity: qty }, { preserveScroll: true });
  }

  function deleteItem(id: number) {
    router.delete(route("cart.destroy", id), { preserveScroll: true });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-100 to-white">
      <Head title="Keranjang" />

      <div className="max-w-6xl mx-auto p-6">
        {/* BACK */}
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
          <div className="bg-white rounded-3xl shadow p-10 text-center">
            <p className="text-gray-400">Keranjang kamu masih kosong.</p>
            <Link
              href={route("shop")}
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
            >
              Mulai belanja
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* LIST */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl shadow p-4 hover:shadow-xl transition flex gap-4"
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
                      {/* MINUS */}
                      <button
                        onClick={() => updateQty(item.id, (item.quantity ?? 1) - 1)}
                        disabled={(item.quantity ?? 1) <= 1}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-blue-200 bg-white hover:bg-blue-100 transition font-bold disabled:opacity-40"
                      >
                        -
                      </button>

                      {/* NUMBER */}
                      <span className="min-w-[44px] h-9 flex items-center justify-center font-bold text-blue-700 bg-blue-50 rounded-xl">
                        {item.quantity ?? 1}
                      </span>

                      {/* PLUS */}
                      <button
                        onClick={() => updateQty(item.id, (item.quantity ?? 1) + 1)}
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
                      {(item.product.price * (item.quantity ?? 1)).toLocaleString()}
                    </p>

                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="bg-white rounded-3xl shadow p-6 h-fit">
              <h2 className="font-bold text-blue-900 mb-4">
                Ringkasan Belanja
              </h2>

              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-bold text-blue-700">
                  Rp {total.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => router.visit(route("checkout"))}
                disabled={cartItems.length === 0}
                className={`w-full mt-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                  cartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                }`}
              >
                Lanjut ke Pembayaran
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
