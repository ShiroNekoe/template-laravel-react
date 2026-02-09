import { useForm, router, Link, Head, usePage } from "@inertiajs/react";
import type { Product } from "@/types";

// 👉 Bikin tipe lokal biar nggak error
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

export default function Shop({ products, search = "" }: Props) {
const { auth } = usePage<{ auth: { user: AuthUser } }>().props;
const isAdmin = !!auth?.user?.roles?.includes("admin");

  const { data, setData } = useForm({ search });


  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.get(route("shop"), data, {
      preserveState: true,
      replace: true,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Head title="Shop" />

      {/* HEADER */}
      <header className="border-b bg-white sticky top-0 z-50">
  <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
    
    <Link href={route("shop")} className="font-bold text-lg">
      TokoLu
    </Link>

    <form onSubmit={handleSearch} className="flex-1 max-w-lg flex gap-2">
      <input
        placeholder="Cari produk..."
        value={data.search}
        onChange={(e) => setData("search", e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button className="bg-black text-white px-4 rounded">
        Search
      </button>
    </form>

    <div className="flex items-center gap-3">
      {!auth?.user ? (
        <>
          <Link href={route("login")} className="border px-3 py-1 rounded text-sm">
            Login
          </Link>
          <Link href={route("register")} className="bg-black text-white px-3 py-1 rounded text-sm">
            Register
          </Link>
        </>
      ) : (
        <>
          {/* CART BUTTON 🔥 */}
          <Link
            href="/cart"
            className="border px-3 py-1 rounded text-sm bg-gray-100"
          >
            🛒 Cart
          </Link>

          {isAdmin && (
            <Link
              href={route("admin.dashboard")}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
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
      <div className="p-6 max-w-6xl mx-auto">
        {products.length === 0 && (
          <p className="text-center text-muted-foreground mb-4">
            Produk gak ketemu bro.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="border p-4 rounded-xl shadow-sm hover:shadow transition"
            >
              <img
                src={p.image || "/placeholder.png"}
                alt={p.name}
                className="w-full h-40 object-cover rounded mb-3"
              />

              <h3 className="font-bold text-lg">{p.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {p.description}
              </p>

              <div className="mt-2 flex justify-between items-center">
                <p className="font-semibold">
                  Rp {p.price.toLocaleString()}
                </p>
                <p className={p.stock === 0 ? "text-red-500" : ""}>
                  Stock: {p.stock}
                </p>
              </div>

              <div className="mt-3 flex gap-2">
                <Link
                  href={route("product.show", p.id)}
                  className="border px-3 py-1 rounded text-sm"
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
                  className={`px-3 py-1 rounded text-sm text-white ${
                    p.stock === 0 ? "bg-gray-400" : "bg-blue-600"
                  }`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
