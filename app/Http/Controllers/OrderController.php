<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;

class OrderController extends Controller
{public function store(Request $request)
{
    $data = $request->validate([
        'method' => 'required|in:COD,VA',
    ]);

    $user = $request->user();

    $cart = $user->cartItems()->with('product')->get();

    if ($cart->isEmpty()) {
        return redirect()->route('payment.failed');
    }

    $order = Order::create([
        'user_id' => $user->id,
        'payment_method' => $data['method'],
        'status' => $data['method'] === 'COD' ? 'pending' : 'paid',
        'total' => $cart->sum(fn ($i) => $i->product->price * $i->quantity),
    ]);

    foreach ($cart as $item) {
        OrderItem::create([
            'order_id'   => $order->id,
            'product_id' => $item->product_id,
            'quantity'   => (int) $item->quantity, // ← FIXED (lu salah nama kolom)
            'price'      => $item->product->price,
        ]);
    }

    // kosongin cart
    $user->cartItems()->delete();

    return redirect()->route('payment.success')
        ->with('order_id', $order->id);
}


}
