import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

                {/* TOP STATS (biar keliatan pro) */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {[
                        { title: "Total Produk", value: "128", link: "/admin/products" },
                        { title: "Stok Habis", value: "7", link: "/admin/products" },
                        { title: "Total User", value: "342", link: "#" },
                        { title: "Order Pending", value: "12", link: "#" },
                    ].map((item, i) => (
                        <Link
                            key={i}
                            href={item.link}
                            className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border p-4 hover:bg-sidebar/10 transition"
                        >
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                            <div className="relative z-10">
                                <h3 className="text-sm text-muted-foreground">{item.title}</h3>
                                <p className="text-2xl font-bold">{item.value}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* MAIN AREA */}
                <div className="grid grid-cols-3 gap-4 flex-1">

                    {/* Produk terbaru */}
                    <div className="col-span-2 border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-4">
                        <h2 className="text-lg font-semibold mb-3">Produk Terbaru</h2>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />

                        <div className="relative z-10 space-y-2">
                            <div className="flex justify-between border-b pb-2">
                                <span>MacBook M2</span>
                                <span className="text-muted-foreground">Stok: 12</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>Logitech Mouse</span>
                                <span className="text-muted-foreground">Stok: 0</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>Mechanical Keyboard</span>
                                <span className="text-muted-foreground">Stok: 34</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-4">
                        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />

                        <div className="relative z-10 flex flex-col gap-2">
                            <Link
                                href="/admin/products/create"
                                className="px-4 py-2 rounded-md bg-primary text-white text-center"
                            >
                                + Tambah Produk
                            </Link>

                            <Link
                                href="/admin/products"
                                className="px-4 py-2 rounded-md border text-center"
                            >
                                Kelola Produk
                            </Link>

                            <Link
                                href="/"
                                className="px-4 py-2 rounded-md border text-center"
                            >
                                Lihat Toko (User View)
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </AppLayout>
    );
}
