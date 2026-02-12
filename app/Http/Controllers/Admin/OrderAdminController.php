<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderAdminController extends Controller
{
 public function index()
{
    return inertia('Admin/AdminOrdersDashboard', [
        'orders' => [
            'pending' => Order::with('user')->where('status', 'pending')->latest()->get(),
            'paid' => Order::with('user')->where('status', 'paid')->latest()->get(),
            'packing' => Order::with('user')->where('status', 'packing')->latest()->get(),
            'shipped' => Order::with('user')->where('status', 'shipped')->latest()->get(),
            'completed' => Order::with('user')->where('status', 'completed')->latest()->get(),
        ],
    ]);
}


    public function show(Order $order)
{
    $order->load(['user', 'items.product']);

    return inertia('Admin/AdminOrderDetail', [
        'order' => $order,
    ]);
}

public function updateStatus(Request $request, Order $order)
{
    $request->validate([
        'status' => 'required|in:pending,paid,packing,shipped,completed',
    ]);

    $order->update([
        'status' => $request->status,
    ]);

    return back();
}

}
