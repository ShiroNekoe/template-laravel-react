import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { toast } from "sonner";
import { useState } from "react";

type OrderItem = {
  id: number;
  product: { name: string };
  quantity: number;
  price: number;
};

type Props = {
  order: {
    id: number;
    status: "pending" | "paid" | "packing" | "shipped" | "completed";
    payment_method: string;
    total: number;
    created_at: string;
    user: { name: string; email: string; address: string; phone: string };
    items: OrderItem[];
  };
};

const STATUS_FLOW = ["pending", "paid", "packing", "shipped", "completed"] as const;

export default function AdminOrderDetail({ order }: Props) {
  const currentIndex = STATUS_FLOW.indexOf(order.status);
  const [processing, setProcessing] = useState(false);

  const updateStatus = (nextStatus: typeof STATUS_FLOW[number]) => {
    setProcessing(true);

    router.post(route("admin.orders.updateStatus", order.id), {
      status: nextStatus,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(`Status berhasil diubah ke ${nextStatus} 🚀`);
      },
      onError: () => {
        toast.error("Gagal mengubah status ❌");
      },
      onFinish: () => {
        setProcessing(false);
      }
    });
  };

  const nextStatus =
    currentIndex < STATUS_FLOW.length - 1
      ? STATUS_FLOW[currentIndex + 1]
      : null;

  return (
    <AppLayout breadcrumbs={[
      { title: "Orders", href: "/admin/orders" },
      { title: `Order #${order.id}`, href: "#" },
    ]}>
      <Head title={`Order #${order.id}`} />

      <div className="p-4 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>

          {nextStatus && (
            <button
              disabled={processing}
              onClick={() => updateStatus(nextStatus)}
              className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {processing ? "Updating..." : `Set to ${nextStatus}`}
            </button>
          )}
        </div>

        {/* TIMELINE */}
        <div className="border p-4 rounded-xl">
          <h2 className="font-semibold mb-3">Timeline</h2>

          <div className="flex items-center justify-between">
            {STATUS_FLOW.map((status, i) => {
              const done = i <= currentIndex;

              return (
                <div key={status} className="flex-1 text-center">
                  <div
                    className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center 
                    ${done ? "bg-black text-white" : "bg-gray-200"}`}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  <p className="mt-2 capitalize text-sm">{status}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* INFO ORDER */}
        <div className="grid grid-cols-2 gap-5">
          <div className="border p-5 rounded-xl">
            <p className="text-sm text-muted-foreground">Customer</p>
            <p className="font-semibold">{order.user.name}</p>
            <p className="text-sm">{order.user.email}</p>
            <p className="text-sm">{order.user.phone}</p>
            <p className="text-sm">{order.user.address}</p>
          </div>

          <div className="border p-4 rounded-xl">
            <p className="text-sm text-muted-foreground">Payment</p>
            <p className="font-semibold">{order.payment_method}</p>
            <p className="text-sm">
              Rp {Number(order.total).toLocaleString()}
            </p>
          </div>
        </div>

        {/* ITEMS */}
        <div className="border p-4 rounded-xl">
          <h2 className="font-semibold mb-2">Order Items</h2>

          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x Rp {Number(item.price).toLocaleString()}
                  </p>
                </div>
                <p className="font-semibold">
                  Rp {(item.quantity * item.price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}