import { Head, router, Link } from "@inertiajs/react";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
  image?: string | null;
};

export default function ProductDetail({ product }: { product: Product }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Head title={product.name} />

      <Link href={route("shop")} className="text-sm text-blue-600">
        ← Kembali ke Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <img
          src={product.image || "/placeholder.png"}
          className="w-full h-80 object-cover rounded-xl"
        />

        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold mt-2">
            Rp {product.price.toLocaleString()}
          </p>

          <p className="mt-3 text-muted-foreground">
            {product.description || "Tidak ada deskripsi."}
          </p>

          <p className={`mt-2 ${product.stock === 0 ? "text-red-500" : ""}`}>
            Stock: {product.stock}
          </p>

          <button
            disabled={product.stock === 0}
            onClick={() =>
              router.post(route("cart.store"), { product_id: product.id })
            }
            className={`mt-4 px-4 py-2 rounded text-white ${
              product.stock === 0 ? "bg-gray-400" : "bg-blue-600"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
