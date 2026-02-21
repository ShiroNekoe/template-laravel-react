import { useState, useMemo } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type Order = {
  id: number;
  status: string;
  total: number;
  created_at: string;
};

type UserDetail = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  orders: Order[];
};

type Props = {
  user: UserDetail;
};

export default function OrderDetailUser({ user }: Props) {
  const [search, setSearch] = useState("");

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  // 🔎 Filter by Order ID
  const filteredOrders = useMemo(() => {
    return user.orders.filter((order) =>
      order.id.toString().includes(search)
    );
  }, [search, user.orders]);

  const getStatusVariant = (status: string) => {
    if (status === "paid") return "default";
    if (status === "pending") return "secondary";
    return "destructive";
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Dashboard", href: "/admin/dashboard" },
        { title: "Users", href: "/admin/users" },
        { title: user.name, href: `/admin/users/${user.id}` },
      ]}
    >
      <Head title={`Detail ${user.name}`} />

      <div className="p-6 space-y-6">

        {/* USER INFO */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi User</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Nama</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">No HP</p>
              <p className="font-medium">{user.phone || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Alamat</p>
              <p className="font-medium">{user.address || "-"}</p>
            </div>
          </CardContent>
        </Card>

        {/* ORDER LIST */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>
              Daftar Order ({user.orders.length})
            </CardTitle>

            <Input
              placeholder="Cari Order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </CardHeader>

          <CardContent className="space-y-4">

            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center border rounded-lg p-4 hover:shadow-sm transition"
                >
                  <div className="space-y-1">
                    <p className="font-semibold">
                      Order #{order.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="font-semibold">
                      {formatRupiah(order.total)}
                    </p>

                    <div className="flex items-center gap-2 justify-end">
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>

                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                Tidak ada order yang cocok dengan pencarian.
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}