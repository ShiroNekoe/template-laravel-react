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
  { key: "packing", label: "Dikemas" },
  { key: "shipped", label: "Dikirim" },
  { key: "completed", label: "Selesai" },
];

export default function OrderDetail({ order }: Props) {
  const currentIndex = STATUS_FLOW.findIndex(s => s.key === order.status);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Head title={`Order #${order.id}`} />

      <Link href={route("orders.index")} className="text-blue-600 text-sm">
        ← Back
      </Link>

      <h1 className="text-2xl font-bold mt-2">Order #{order.id}</h1>
      <p className="text-gray-500">Status: <b>{order.status}</b></p>
      <p className="text-lg font-semibold mt-1">
        Total: Rp {Number(order.total).toLocaleString()}
      </p>

      {/* TIMELINE */}
      <div className="mt-6 flex items-center justify-between">
        {STATUS_FLOW.map((step, i) => {
          const done = i <= currentIndex;
          return (
            <div key={step.key} className="flex flex-col items-center w-full">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all
                  ${done ? "bg-blue-600" : "bg-gray-300"}`}
              >
                {done ? "✓" : i + 1}
              </div>

              {i < STATUS_FLOW.length - 1 && (
                <div
                  className={`h-1 w-full mt-2 ${
                    done ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}

              <p className="mt-2 text-sm font-semibold">{step.label}</p>
            </div>
          );
        })}
      </div>

      {/* ITEMS */}
      <div className="mt-8 border rounded-xl p-4">
        <h2 className="font-bold mb-2">Items</h2>
        {order.order_items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm py-1">
            <span>
              • {item.product.name} x {item.quantity}
            </span>
            <span>
              Rp {Number(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
