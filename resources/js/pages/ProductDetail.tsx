import { router } from "@inertiajs/react";
import type { Product } from "@/types";

type Props = {
  product: Product;
};

export default function ProductDetail({ product }: Props) {
  function addToCart() {
    router.post("/cart", { product_id: product.id });
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="w-full md:w-1/2 h-64 object-cover rounded-lg"
        />
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-xl font-semibold">Rp {product.price}</p>
          <p>Stock: {product.stock}</p>

          <button
            onClick={addToCart}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}
