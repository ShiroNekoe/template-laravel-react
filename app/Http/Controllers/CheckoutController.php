<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    // STEP 1 — halaman pilih metode pembayaran
    public function payment()
    {
        $cartItems = CartItem::where('user_id', auth()->id())
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Keranjang kosong bro.');
        }

        return inertia('CheckoutPayment', [
            'cartItems' => $cartItems
        ]);
    }

    // STEP 2 — proses pembayaran + buat order
    public function process(Request $request)
{
    $data = $request->validate([
        'payment_method' => 'required|in:cod,transfer'
    ]);

    $userId = $request->user()->id; 

    $cartItems = CartItem::where('user_id', $userId)
        ->with('product')
        ->get();

    if ($cartItems->isEmpty()) {
        return redirect()->route('cart.index')
            ->with('error', 'Keranjang kosong.');
    }

    $order = null;

DB::transaction(function () use ($cartItems, &$order, $data, $userId) {

    $order = Order::create([
        'user_id' => $userId,
        'status' => $data['payment_method'] === 'cod' ? 'pending' : 'paid',
        'total' => 0,
    ]);

    $total = 0;

    foreach ($cartItems as $item) {
        $subtotal = $item->quantity * $item->product->price;
        $total += $subtotal;

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $item->product_id,
            'quantity' => (int) $item->quantity,
            'price' => $item->product->price,
        ]);

        $affected = DB::update(
            "UPDATE products 
             SET stock = stock - ? 
             WHERE id = ? AND stock >= ?",
            [(int) $item->quantity, $item->product_id, (int) $item->quantity]
        );

        if ($affected === 0) {
            throw new \Exception("Stok gak cukup: Product #{$item->product_id}");
        }
    }

    $order->update(['total' => $total]);

    CartItem::where('user_id', $userId)->delete();
});



    return redirect()->route('payment.success')
        ->with('order_id', $order->id);
}

}
