<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\OrderItem;
use Inertia\Inertia;    
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $todayIncome = Order::whereDate('created_at', now())
            ->where('status', 'paid')
            ->sum('total');

        $monthlyIncome = Order::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->where('status', 'paid')
            ->sum('total');

        $salesChart = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as total')
            )
            ->where('status', 'paid')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

           $trendingProducts = OrderItem::select(
        'products.id',
        'products.name',
        DB::raw('SUM(order_items.quantity) as total_sold')
        )
        ->join('products', 'products.id', '=', 'order_items.product_id')
        ->join('orders', 'orders.id', '=', 'order_items.order_id')
        ->whereIn('orders.status', ['paid', 'completed', 'shipped'])
        ->groupBy('products.id', 'products.name')
        ->orderByDesc('total_sold')
        ->take(5)
        ->get()
        ->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'total_sold' => (int) $item->total_sold,
            ];
        });


        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_orders' => Order::count(),                                               
                'total_products' => Product::count(),
                'out_of_stock' => Product::where('stock', 0)->count(),
                'total_users' => User::count(),
                'pending_orders' => Order::where('status', 'pending')->count(),
                'today_income' => $todayIncome,
                'monthly_income' => $monthlyIncome,
                
            ],
             'trendingProducts' => $trendingProducts, 
            'latestProducts' => Product::latest()->take(5)->get(),
            'salesChart' => $salesChart,
        ]);
    }
}
