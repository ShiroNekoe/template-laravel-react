import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

type Product = {
  id: number;
  name: string;
  stock: number;
};

type Props = {
  stats: {
    total_products: number;
    out_of_stock: number;
    total_users: number;
    pending_orders: number;
  };
  latestProducts: Product[];
};

export default function Dashboard({ stats, latestProducts }: Props) {
  return (
    <AppLayout breadcrumbs={[{ title: 'Admin Dashboard', href: '/admin/dashboard' }]}>
      <Head title="Admin Dashboard" />

      <div className="p-4 space-y-4">

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4">
          <div className="border p-4 rounded-xl">
            <p className="text-sm text-muted-foreground">Total Produk</p>
            <p className="text-2xl font-bold">{stats.total_products}</p>
          </div>

          <div className="border p-4 rounded-xl">
            <p className="text-sm text-muted-foreground">Stok Habis</p>
            <p className="text-2xl font-bold">{stats.out_of_stock}</p>
          </div>

          <div className="border p-4 rounded-xl">
            <p className="text-sm text-muted-foreground">Total User</p>
            <p className="text-2xl font-bold">{stats.total_users}</p>
          </div>

          <div className="border p-4 rounded-xl">
            <p className="text-sm text-muted-foreground">Order Pending</p>
            <p className="text-2xl font-bold">{stats.pending_orders}</p>
          </div>
        </div>

        {/* Produk Terbaru */}
        <div className="border p-4 rounded-xl max-h-64 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2 sticky top-0 bg-white pb-2">
            Produk Terbaru
        </h2>

        <div className="space-y-2">
            {latestProducts.map((p) => (
            <div key={p.id} className="flex justify-between border-b pb-2">
                <span>{p.name}</span>
                <span className={p.stock === 0 ? "text-red-500" : ""}>
                Stok: {p.stock}
                </span>
            </div>
            ))}
        </div>
        </div>


        {/* Quick Actions */}
        <div className="flex gap-2">

          <Link href="/" className="px-4 py-2 border rounded-md">
            Lihat Toko
          </Link>
        </div>

      </div>
    </AppLayout>
  );
}
