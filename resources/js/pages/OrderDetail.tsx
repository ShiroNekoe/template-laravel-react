import { Head, Link } from "@inertiajs/react";

type Product = {
  id: number;
  name: string;
};

type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  product: Product;
};

type Order = {
  id: number;
  status: "pending" | "paid" | "packing" | "shipped" | "completed";
  total: number;
  order_items: OrderItem[];
};

type Props = {
  order: Order;
};

const STATUS_FLOW = [
  { key: "pending", label: "Menunggu" },
  { key: "paid", label: "Dibayar" },
  { key: "packing", label: "Dikemas" },
  { key: "shipped", label: "Dikirim" },
  { key: "completed", label: "Selesai" },
];

export default function OrderDetail({ order }: Props) {
  const currentIndex = STATUS_FLOW.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-300 to-cyan-100">
      <Head title={`Order #${order.id}`} />

      {/* background pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,#60a5fa,transparent_40%),radial-gradient(circle_at_80%_30%,#22d3ee,transparent_40%),radial-gradient(circle_at_50%_80%,#93c5fd,transparent_40%)]" />

      <div className="relative max-w-5xl mx-auto">
       {/* BACK */}
<div className="pt-6">
  <Link
    href={route("orders.index")}
    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 backdrop-blur shadow-md border border-blue-100 font-semibold text-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition"
  >
    ← Kembali
  </Link>
</div>


        {/* HEADER */}
        <div className="mt-4 bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Order #{order.id}
              </h1>
              <p className="text-gray-500 mt-1">
                Detail & perjalanan pesanan kamu
              </p>
            </div>

            {/* TOTAL */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400/20 blur-2xl rounded-full" />
              <div className="relative text-xl font-bold text-blue-700">
                Rp {Number(order.total).toLocaleString()}
              </div>
            </div>
          </div>

          {/* STATUS BADGE */}
          <div className="mt-4">
            <span className="px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 capitalize">
              {order.status}
            </span>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="mt-8 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="font-bold text-lg mb-6">Status Pengiriman</h2>

          <div className="flex items-center justify-between">
            {STATUS_FLOW.map((step, i) => {
              const done = i <= currentIndex;

              return (
                <div key={step.key} className="flex flex-col items-center w-full relative">
                  {/* garis */}
                  {i < STATUS_FLOW.length - 1 && (
                    <div
                      className={`absolute top-5 left-1/2 w-full h-1 ${
                        done ? "bg-blue-500" : "bg-gray-200"
                      }`}
                    />
                  )}

                  {/* bulat */}
                  <div
                    className={`z-10 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-all
                    ${
                      done
                        ? "bg-gradient-to-br from-blue-500 to-cyan-500 scale-110"
                        : "bg-gray-300"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </div>

                  <p
                    className={`mt-3 text-sm font-semibold ${
                      done ? "text-blue-700" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ITEMS */}
        <div className="mt-8 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="font-bold text-lg mb-4">Produk Dibeli</h2>

          <div className="space-y-3">
            {order.order_items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border rounded-xl p-4 hover:shadow-md transition"
              >
                <div>
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-bold text-blue-700">
                  Rp {Number(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
