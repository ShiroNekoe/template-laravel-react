import { useForm, router } from "@inertiajs/react";
import type { Product } from "@/types";

type Props = {
  products: Product[];
};

export default function Shop({ products }: Props) {
  const { data, setData } = useForm({ search: "" });

  function search(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.get("/shop", data);
  }

  return (
    <div className="p-6">
      <form onSubmit={search} className="mb-4 flex gap-2">
        <input
          placeholder="Cari produk..."
          value={data.search}
          onChange={(e) => setData("search", e.target.value)}
          className="border p-1 rounded"
        />
        <button className="bg-gray-800 text-white px-3 rounded">Search</button>
      </form>

      <div className="grid grid-cols-3 gap-4">
        {products.map((p: Product) => (
          <div key={p.id} className="border p-4 rounded">
            <h3 className="font-bold">{p.name}</h3>
            <p>Rp {p.price}</p>
            <p>Stock: {p.stock}</p>
            <button
              onClick={() => router.post("/cart", { product_id: p.id })}
              className="bg-blue-600 text-white px-2 py-1 mt-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
