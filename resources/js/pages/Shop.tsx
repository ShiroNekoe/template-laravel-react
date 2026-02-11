import { useForm, router, Link, Head, usePage } from "@inertiajs/react";
import type { Product } from "@/types";
import { useState } from "react";

type AuthUser = {
  id: number;
  name: string;
  email: string;
  roles?: string[];
} | null;

type Props = {
  products: Product[];
  search?: string;
};

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

export default function Shop({ products, search = "" }: Props) {
  // Semua hooks ada di dalam component
  const { auth, cart } = usePage<{
    auth: { user: AuthUser };
    cart: { id: number; quantity: number; product: Product & { image?: string } }[];
  }>().props;

  const isAdmin = !!auth?.user?.roles?.includes("admin");
  const [openMenu, setOpenMenu] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const { data, setData } = useForm({ search });

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.get(route("shop"), data, {
      preserveState: true,
      replace: true,
    });
  }

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  function updateQty(id: number, qty: number) {
    if (qty < 1) return;

    router.put(
      route("cart.update", id),
      { quantity: qty }, // 🔥 HARUS quantity (match backend)
      {
        preserveScroll: true,
      }
    );
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-300 to-cyan-100">
      <Head title="Shop" />

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          {/* LOGO */}
      <Link
        href={route("shop")}
        className="flex items-center gap-3 min-w-fit"
      >
        <img
          src="/LOGO TOKOLU.png"
          alt="TokoLu"
          className="h-14 w-auto object-contain drop-shadow-md hover:scale-105 transition"
        />
      </Link>
          {/* SEARCH */}
          <div className="flex-1 flex justify-center px-10">
            <form onSubmit={handleSearch} className="w-full max-w-xl flex gap-2">
              <input
                placeholder="Cari produk impianmu..."
                value={data.search}
                onChange={(e) => setData("search", e.target.value)}
                className="w-full border border-white/50 bg-white/80 backdrop-blur focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none px-4 py-2 rounded-xl"
              />
              <button className="px-5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-800 shadow hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition">
                Search
              </button>
            </form>
          </div>

          {/* RIGHT MENU */}
         <div className="flex items-center gap-3 min-w-fit">
      {!auth?.user ? (
        <>
          <Link
            href={route("login")}
            className="px-4 py-2 rounded-xl border border-blue-200 bg-white/70 backdrop-blur text-blue-700 hover:bg-blue-50 text-sm transition"
          >
            Login
          </Link>

          <Link
            href={route("register")}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-800 shadow hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition"
          >
            Register
          </Link>
        </>
      ) : (
        <>
         <div className="relative">
  <button
    onClick={() => setOpenCart(!openCart)}
    className="px-4 py-2 rounded-xl border border-blue-200 bg-white/70 backdrop-blur text-sm hover:bg-blue-50 transition"
  >
    🛒 Cart ({cart.length})
  </button>

  {openCart && (
    <div className="absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow-lg p-3">
      <h3 className="font-bold mb-2">Keranjang lu</h3>

      {cart.length === 0 ? (
        <p className="text-sm text-gray-400">Kosong bro.</p>
      ) : (
        <>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-2 border-b pb-2">
                <img
                  src={item.product.image ?? "/placeholder.png"}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.product.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} x Rp {item.product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-bold text-blue-700">
                  Rp {total.toLocaleString()}
                </span>
              </div>
                  <Link
                    href="/cart"
                    className="block text-center mt-3 bg-blue-600 text-white py-2 rounded-xl text-sm"
                  >
                    Lihat Keranjang
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
          <div className="relative">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="px-4 py-2 rounded-xl border border-blue-200 bg-white/70 backdrop-blur text-sm flex items-center gap-2"
            >
              👤 {auth.user.name}
            </button>

          {openMenu && (
  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-md overflow-hidden">
    <Link
      href="/cart"
      className="block px-4 py-2 text-sm hover:bg-blue-50"
    >
      🛒 Cart
    </Link>

    <Link
      href={route("orders.index")}
      className="block px-4 py-2 text-sm hover:bg-blue-50"
    >
      📦 My Orders
    </Link>

    <Link
      href={route("settings")}
      className="block px-4 py-2 text-sm hover:bg-gray-100"
    >
      ⚙️ Settings
    </Link>

    <button
      onClick={() => router.post(route("logout"))}
      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
    >
      🚪 Logout
    </button>
  </div>
)}

          </div>

          {isAdmin && (
            <Link
              href={route("admin.dashboard")}
              className="px-4 py-2 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-800 shadow hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition"
            >
              Dashboard
            </Link>
          )}
        </>
      )}
    </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="p-6 max-w-7xl mx-auto">
        {products.length === 0 && (
          <p className="text-center text-gray-500 mb-6">
            Produk gak ketemu bro.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <div
              key={p.id}
              className="group bg-white/90 backdrop-blur rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition overflow-hidden"
            >
              {/* IMAGE */}
              <div className="h-52 bg-blue-50 overflow-hidden">
                <img
                  src={(p as any).image ?? "/placeholder.png"}
                  alt={p.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>

              {/* BODY */}
              <div className="p-5">
                <h3 className="font-bold text-blue-900 line-clamp-1">
                  {p.name}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {p.description}
                </p>

                <div className="mt-3 flex justify-between items-center">
                  <p className="font-bold text-blue-700">
                    Rp {p.price.toLocaleString()}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      p.stock === 0 ? "text-red-500" : "text-gray-400"
                    }`}
                  >
                    Stok: {p.stock}
                  </p>
                </div>

                {/* BUTTON */}
                <div className="mt-4 flex gap-2">
                  <Link
                    href={route("product.show", p.id)}
                    className="w-full text-center border border-blue-200 text-blue-700 rounded-xl py-2 text-sm hover:bg-blue-50 transition"
                  >
                    Detail
                  </Link>

                  <button
                    disabled={p.stock === 0}
                    onClick={() =>
                      router.post(route("cart.store"), {
                        product_id: p.id,
                      })
                    }
                    className={`w-full py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
                      p.stock === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-800 shadow hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                    }`}
                  >
                    + Keranjang
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
