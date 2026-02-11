import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

type Order = {
  id: number;
  status: "pending" | "packing" | "shipped" | "completed";
  total: number;
  user: { name: string };
  created_at: string;
};

type Props = {
  orders: {
    pending: Order[];
    packing: Order[];
    shipped: Order[];
    completed: Order[];
  };
};

export default function AdminOrdersDashboard({ orders }: Props) {
  return (
    <AppLayout breadcrumbs={[{ title: 'Admin Orders', href: '/admin/orders' }]}>
      <Head title="Admin Order Flow" />

      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Order Flow</h1>

        <div className="grid grid-cols-4 gap-4">
          {(["pending", "packing", "shipped", "completed"] as const).map(
            (status) => (
              <div key={status} className="border p-4 rounded-xl">
                <h2 className="font-semibold capitalize mb-2">
                  {status}
                </h2>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {orders[status].length === 0 ? (
                    <p className="text-sm text-gray-400">Kosong.</p>
                  ) : (
                    orders[status].map((order) => (
                      <Link
                        key={order.id}
                        href={route("admin.orders.show", order.id)}
                        className="block border p-3 rounded-lg hover:bg-gray-50"
                      >
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-xs text-gray-500">
                          {order.user.name}
                        </p>
                        <p className="text-sm">
                          Rp {Number(order.total).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )
          )}
        </div>

        <div className="flex gap-2">
          <Link href="/admin/dashboard" className="px-4 py-2 border rounded-md">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
