import AppLayout from "@/layouts/app-layout"
import { Head, Link } from "@inertiajs/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

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
  id: number
  name: string
  stock: number
}

type TrendingProduct = {
  id: number
  name: string
  total_sold: number
}

type Props = {
  stats?: {
    total_products: number
    out_of_stock: number
    total_users: number
    pending_orders: number
    today_income: number
    monthly_income: number
    today_growth: number
    monthly_growth: number
  }
  latestProducts?: Product[]
  trendingProducts?: TrendingProduct[]
  salesChart?: {
    date: string
    total: number
  }[]
}

const formatRupiah = (value: number = 0) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value) || 0)

export default function Dashboard({
  stats,
  latestProducts = [],
  trendingProducts = [],
  salesChart = [],
}: Props) {

  const safeStats = {
    total_products: stats?.total_products ?? 0,
    out_of_stock: stats?.out_of_stock ?? 0,
    total_users: stats?.total_users ?? 0,
    pending_orders: stats?.pending_orders ?? 0,
    today_income: stats?.today_income ?? 0,
    monthly_income: stats?.monthly_income ?? 0,
    today_growth: stats?.today_growth ?? 0,
    monthly_growth: stats?.monthly_growth ?? 0,
  }

  const GrowthBadge = ({ value }: { value: number }) => {
    const numeric = Number(value) || 0
    const positive = numeric >= 0

    return (
      <Badge
        variant="outline"
        className={`flex items-center gap-1 ${
          positive ? "text-green-600" : "text-red-500"
        }`}
      >
        {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(numeric)}%
      </Badge>
    )
  }

  return (
    <AppLayout breadcrumbs={[{ title: "Dashboard", href: "/admin/dashboard" }]}>
      <Head title="Dashboard" />

      <div className="p-6 space-y-8">

        {/* STATS GRID */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <Card>
            <CardHeader>
              <CardTitle>Total Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{safeStats.total_products}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stok Habis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-500">
                {safeStats.out_of_stock}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Hari Ini</CardTitle>
              <GrowthBadge value={safeStats.today_growth} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {formatRupiah(safeStats.today_income)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Bulan Ini</CardTitle>
              <GrowthBadge value={safeStats.monthly_growth} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {formatRupiah(safeStats.monthly_income)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CHART + TRENDING */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* CHART */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Grafik Penjualan</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {salesChart.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value: any) =>
                        new Date(value).getDate().toString()
                      }
                    />
                    <YAxis
                      width={90}
                      domain={[0, "auto"]}
                      tickFormatter={(value: any): string => {
                        const num = Number(value)

                        if (num >= 1000000) return (num / 1000000).toFixed(1) + "jt"
                        if (num >= 1000) return (num / 1000).toFixed(0) + "rb"

                        return num.toString()
                      }}
                    />
                    <Tooltip
                      formatter={(value: any) =>
                        formatRupiah(Number(value))
                      }
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
                  Belum ada data
                </div>
              )}
            </CardContent>
          </Card>

          {/* TRENDING */}
          <Card>
            <CardHeader>
              <CardTitle>Produk Trending 🔥</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingProducts.length > 0 ? (
                trendingProducts.map((p, index) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center border-b pb-2 last:border-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold w-6">
                        {index === 0 && "🥇"}
                        {index === 1 && "🥈"}
                        {index === 2 && "🥉"}
                        {index > 2 && `#${index + 1}`}
                      </span>

                      <Link
                        href={`/admin/products/${p.id}`}
                        className="text-sm hover:underline"
                      >
                        {p.name}
                      </Link>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {Number(p.total_sold) || 0} terjual
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  Belum ada data
                </p>
              )}
            </CardContent>
          </Card>

        </div>

        {/* PRODUK TERBARU */}
        <Card>
          <CardHeader>
            <CardTitle>Produk Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto space-y-2">
            {latestProducts.length > 0 ? (
              latestProducts.map((p) => (
                <div key={p.id} className="flex justify-between border-b pb-2 last:border-none">
                  <span>{p.name}</span>
                  <span className={p.stock === 0 ? "text-red-500" : ""}>
                    Stok: {p.stock}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">Belum ada produk</p>
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
  )
}