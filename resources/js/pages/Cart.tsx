import { router, Link, Head } from "@inertiajs/react";

type CartItem = {
  id: number;
  qty: number; 
  product: {
    id: number;
    name: string;
    price: number;
    image?: string | null;
  };
};


export default function Cart({ cartItems }: { cartItems: CartItem[] }) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  function updateQty(id: number, qty: number) {
    if (qty < 1) return;
    router.put(route("cart.update", id), { qty });
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Head title="Keranjang" />

      <h1 className="text-2xl font-bold mb-4">Keranjang Lu</h1>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="mb-2">Keranjang kosong bro.</p>
          <Link href={route("shop")} className="text-blue-600">
            Balik ke Shop
          </Link>
        </div>
      ) : (
        <div>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border p-4 rounded"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.image || "/placeholder.png"}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-bold">{item.product.name}</h3>
                    <p>Rp {item.product.price.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="px-2 border rounded"
                  >
                    -
                  </button>

                  <span>{item.qty}</span>

                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="px-2 border rounded"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    Rp {(item.product.price * item.qty).toLocaleString()}
                  </p>
                  <button
                    onClick={() => router.delete(route("cart.destroy", item.id))}
                    className="text-red-600 text-sm mt-1"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 flex justify-between items-center">
            <h2 className="text-lg font-bold">
              Total: Rp {total.toLocaleString()}
            </h2>

            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
