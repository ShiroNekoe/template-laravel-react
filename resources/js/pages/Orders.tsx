import { useState } from "react";
import { Head, Link } from "@inertiajs/react";

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

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Head title="My Orders" />

      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {/* FILTER */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status as any)}
            className={`px-3 py-1 rounded-lg text-sm border ${
              statusFilter === status
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700"
            }`}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500">
          Lu belum punya order di status ini.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Link
              key={order.id}
              href={route("orders.show", order.id)}
              className="block border p-4 rounded-xl shadow hover:bg-gray-50 transition"
            >
              <p className="font-semibold">Order #{order.id}</p>
              <p className="text-sm text-gray-500">
                Status:{" "}
                <span className="font-bold capitalize">
                  {order.status}
                </span>
              </p>
              <p className="text-sm">
                Total: Rp {Number(order.total).toLocaleString()}
              </p>

              <div className="mt-2">
                {order.order_items.map((item) => (
                  <div key={item.id} className="text-sm">
                    • {item.product.name} x {item.quantity}
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link
        href={route("shop")}
        className="inline-block mt-4 text-blue-600"
      >
        ← Kembali ke Shop
      </Link>
    </div>
  );
}
