<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_products' => Product::count(),
                'out_of_stock' => Product::where('stock', 0)->count(),
                'total_users' => User::count(),
                'pending_orders' => 0, // nanti lu bisa ganti kalo udah ada tabel orders
            ],
            'latestProducts' => Product::latest()->take(5)->get([
                'id', 'name', 'stock'
            ]),
        ]);
    }
}
