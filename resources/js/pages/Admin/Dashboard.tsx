import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts"

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
    today_income: number;
    monthly_income: number;
  };
  latestProducts: Product[];
  salesChart: {
    date: string;
    total: number;
  }[];
};

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function Dashboard({
  stats,
  latestProducts = [],
  salesChart = [],
}: Props) {
  const safeStats = {
    total_products: stats?.total_products ?? 0,
    out_of_stock: stats?.out_of_stock ?? 0,
    total_users: stats?.total_users ?? 0,
    pending_orders: stats?.pending_orders ?? 0,
    today_income: stats?.today_income ?? 0,
    monthly_income: stats?.monthly_income ?? 0,
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Admin Dashboard", href: "/admin/dashboard" }]}>
      <Head title="Admin Dashboard" />

      <div className="p-6 space-y-6">

        {/* STATS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {safeStats.total_products}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stok Habis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-500">
                {safeStats.out_of_stock}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Penghasilan Hari Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
               {formatRupiah(safeStats.today_income)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Penghasilan Bulan Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
               {formatRupiah(safeStats.monthly_income)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CHART */}
        <Card>
          <CardHeader>
            <CardTitle>Grafik Penjualan Bulan Ini</CardTitle>
          </CardHeader>
        <CardContent className="h-[300px]">
          {salesChart && salesChart.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesChart}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tickFormatter={(value: any) => {
                    const date = new Date(value);
                    return date.getDate().toString(); // HARUS string
                  }}
                />

                <YAxis
                  tickFormatter={(value: any) =>
                    new Intl.NumberFormat("id-ID").format(Number(value))
                  }
                />

                <Tooltip
                  formatter={(value: any) =>
                    `Rp ${new Intl.NumberFormat("id-ID").format(Number(value))}`
                  }
                  labelFormatter={(label: any) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("id-ID");
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Belum ada data penjualan bulan ini
            </div>
          )}
        </CardContent>
        </Card>

        {/* PRODUK TERBARU */}
        <Card>
          <CardHeader>
            <CardTitle>Produk Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto space-y-2">
            {latestProducts.length > 0 ? (
              latestProducts.map((p) => (
                <div key={p.id} className="flex justify-between border-b pb-2">
                  <span>{p.name}</span>
                  <span className={p.stock === 0 ? "text-red-500" : ""}>
                    Stok: {p.stock}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                Belum ada produk
              </p>
            )}
          </CardContent>
        </Card>

        {/* QUICK ACTION */}
        <div>
          <Link
            href="/"
            className="inline-block px-4 py-2 border rounded-md hover:bg-muted"
          >
            Lihat Toko
          </Link>
        </div>

      </div>
    </AppLayout>
  );
}
