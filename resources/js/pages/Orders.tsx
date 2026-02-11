import { useEffect, useMemo, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";

const STATUS_OPTIONS = [
  "all",
  "pending",
  "paid",
  "packing",
  "shipped",
  "completed",
] as const;

type Product = {
  id: number;
  name: string;
};

type OrderItem = {
  id: number;
  quantity: number;
  product: Product;
};

type Order = {
  id: number;
  status: "pending" | "paid" | "packing" | "shipped" | "completed";
  total: number;
  order_items: OrderItem[];
};

type Props = {
  orders: Order[];
};

export default function Orders({ orders }: Props) {
  const [statusFilter, setStatusFilter] =
    useState<"all" | Order["status"]>("all");

  const [loading, setLoading] = useState(false);

  // ✅ AUTO REFRESH TANPA ERROR MERAH
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({
  only: ["orders"],
  preserveScroll: true,
} as any);

    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredOrders = useMemo(() => {
    return statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const statusColor: Record<Order["status"], string> = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-blue-100 text-blue-700",
    packing: "bg-purple-100 text-purple-700",
    shipped: "bg-indigo-100 text-indigo-700",
    completed: "bg-emerald-100 text-emerald-700",
  };

  const statusIcon: Record<Order["status"], string> = {
    pending: "⏳",
    paid: "💳",
    packing: "📦",
    shipped: "🚚",
    completed: "✅",
  };

  const changeFilter = (s: any) => {
    setLoading(true);
    setStatusFilter(s);
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-300 to-cyan-100">
      <Head title="Pesanan Saya" />

      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <div className="inline-block bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow">
          <h1 className="text-3xl font-extrabold text-blue-900">
            Pesanan Saya 📦
          </h1>
        </div>

        {/* FILTER */}
        <div className="flex gap-3 mt-6 flex-wrap">
          {STATUS_OPTIONS.map((status) => {
            const active = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => changeFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  active
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-white/80 backdrop-blur border border-white hover:bg-white"
                }`}
              >
                {status.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* LIST */}
        <div className="mt-8">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 rounded-3xl bg-white/70 animate-pulse"
                />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-10 text-center">
              <div className="text-5xl mb-3">🧾</div>
              <p className="text-gray-500">
                Belum ada pesanan di kategori ini.
              </p>

              <Link
                href={route("shop")}
                className="inline-block mt-5 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-900 shadow hover:shadow-xl hover:-translate-y-0.5 transition"
              >
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 animate-fade">
              {filteredOrders.map((order) => (
                <Link
                  key={order.id}
                  href={route("orders.show", order.id)}
                  className="block bg-white/95 backdrop-blur rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition p-6"
                >
                  {/* TOP */}
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-lg text-blue-900">
                      Order #{order.id}
                    </p>

                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize flex items-center gap-1 ${
                        statusColor[order.status]
                      }`}
                    >
                      {statusIcon[order.status]} {order.status}
                    </span>
                  </div>

                  {/* ITEMS */}
                  <div className="mt-4 space-y-1 text-sm text-gray-600">
                    {order.order_items.slice(0, 3).map((item) => (
                      <div key={item.id}>
                        • {item.product.name} x {item.quantity}
                      </div>
                    ))}

                    {order.order_items.length > 3 && (
                      <div className="text-xs text-gray-400">
                        + {order.order_items.length - 3} produk lainnya
                      </div>
                    )}
                  </div>

                  {/* TOTAL */}
                  <div className="mt-5 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="text-xl font-extrabold text-blue-700">
                      Rp {Number(order.total).toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* BACK */}
        <Link
          href={route("shop")}
          className="inline-block mt-8 text-blue-700 font-semibold hover:underline"
        >
          ← Kembali ke Shop
        </Link>
      </div>

      {/* ANIMATION */}
      <style>{`
        .animate-fade {
          animation: fade .3s ease;
        }
        @keyframes fade {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
