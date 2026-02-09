import { router } from "@inertiajs/react";
import type { CartItem } from "@/types";

type Props = {
  cart: CartItem[];
};

export default function Cart({ cart }: Props) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Keranjang</h1>

      {cart.map((item: CartItem) => (
        <div key={item.id} className="border p-3 mb-2 rounded flex justify-between items-center">
          <div>
            <p className="font-semibold">{item.product.name}</p>
            <p>Qty: {item.quantity}</p>
          </div>
          <button
            onClick={() => router.delete(`/cart/${item.id}`)}
            className="text-red-600 font-semibold"
          >
            Hapus
          </button>
        </div>
      ))}
    </div>
  );
}
