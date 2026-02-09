import { useForm, router } from "@inertiajs/react";
import type { Product } from "@/types";

type Props = {
  products: Product[];
};

export default function Products({ products }: Props) {
  const { data, setData, post } = useForm({
    name: "",
    price: "",
    stock: "",
    description: "",
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post("/admin/products");
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Products</h1>

      <form onSubmit={submit} className="mb-6 flex gap-2">
        <input
          placeholder="Name"
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
          className="border p-1 rounded"
        />
        <input
          placeholder="Price"
          type="number"
          value={data.price}
          onChange={(e) => setData("price", e.target.value)}
          className="border p-1 rounded"
        />
        <input
          placeholder="Stock"
          type="number"
          value={data.stock}
          onChange={(e) => setData("stock", e.target.value)}
          className="border p-1 rounded"
        />
        <button className="bg-blue-600 text-white px-3 rounded">Add</button>
      </form>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: Product) => (
            <tr key={p.id}>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">Rp {p.price}</td>
              <td className="border p-2">{p.stock}</td>
              <td className="border p-2">
                <button
                  onClick={() => router.delete(`/admin/products/${p.id}`)}
                  className="text-red-600"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
