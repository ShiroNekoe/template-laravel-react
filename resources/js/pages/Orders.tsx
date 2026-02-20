import { useEffect, useMemo, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";

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
  payment_method: string; // dibuat fleksibel
  created_at: string;
  order_items: OrderItem[];
};

type Props = {
  orders: Order[];
};

export default function Orders({ orders }: Props) {
  const [statusFilter, setStatusFilter] =
    useState<"all" | Order["status"]>("all");

  const [paymentFilter, setPaymentFilter] =
    useState<"all" | "COD" | "VA">("all");

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // AUTO REFRESH
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
    return orders.filter((order) => {
      const statusMatch =
        statusFilter === "all" || order.status === statusFilter;

      const payment = order.payment_method?.toLowerCase() || "";

      const paymentMatch =
        paymentFilter === "all" ||
        (paymentFilter === "COD" && payment.includes("cod")) ||
        (paymentFilter === "VA" &&
          (payment.includes("va") ||
            payment.includes("bank") ||
            payment.includes("transfer")));

      const searchMatch =
        search.trim() === "" ||
        order.id.toString().includes(search.trim());

      const orderDate = new Date(order.created_at).setHours(0, 0, 0, 0);

      const fromMatch =
        !dateFrom ||
        orderDate >= new Date(dateFrom).setHours(0, 0, 0, 0);

      const toMatch =
        !dateTo ||
        orderDate <= new Date(dateTo).setHours(23, 59, 59, 999);

      return (
        statusMatch &&
        paymentMatch &&
        searchMatch &&
        fromMatch &&
        toMatch
      );
    });
  }, [orders, statusFilter, paymentFilter, search, dateFrom, dateTo]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-300 to-cyan-100">
      <Head title="Pesanan Saya" />

      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href={route("shop")}
            className="px-4 py-2 rounded-xl bg-white shadow"
          >
            🏠
          </Link>

          <div className="px-4 py-2 rounded-xl bg-white shadow">
            <h1 className="text-lg font-bold text-blue-900">
              Pesanan Saya 📦
            </h1>
          </div>
        </div>

        {/* FILTER */}
        <div className="bg-white rounded-2xl shadow p-4 grid md:grid-cols-3 gap-4">
          
          {/* STATUS */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as any)
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="all">Semua</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="packing">Packing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* PAYMENT */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Pembayaran
            </label>
            <select
              value={paymentFilter}
              onChange={(e) =>
                setPaymentFilter(e.target.value as any)
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="all">Semua</option>
              <option value="COD">COD</option>
              <option value="VA">Bank / VA</option>
            </select>
          </div>

          {/* SEARCH */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Cari Order ID
            </label>
            <input
              type="text"
              placeholder="Contoh: 12"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* ORDER LIST */}
        <div className="mt-8">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
              <div className="text-5xl mb-3">🧾</div>
              <p className="text-gray-500">
                Tidak ada pesanan ditemukan.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {filteredOrders.map((order) => {
                const payment = order.payment_method?.toLowerCase() || "";

                return (
                  <Link
                    key={order.id}
                    href={route("orders.show", order.id)}
                    className="block bg-white rounded-3xl shadow-lg hover:shadow-2xl transition p-6"
                  >
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

                    {/* PAYMENT BADGE */}
                    <div className="mt-2">
                      {payment.includes("cod") ? (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold">
                          💵 COD
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">
                          🏦 Bank / VA
                        </span>
                      )}
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                      {order.order_items.slice(0, 3).map((item) => (
                        <div key={item.id}>
                          • {item.product.name} x {item.quantity}
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex justify-between items-center">
                      <span className="text-sm text-gray-500">Total</span>
                      <span className="text-xl font-extrabold text-blue-700">
                        Rp {Number(order.total).toLocaleString()}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
