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

    $userId = $request->user()->id; // 👉 biar nggak merah- merah

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
        'total' => 0, // kita hitung ulang biar aman
    ]);

    $total = 0;

    foreach ($cartItems as $item) {
        $subtotal = $item->quantity * $item->product->price;
        $total += $subtotal;

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $item->product_id,
            'quantity' => (int) $item->quantity, // DIPAKSA INTEGER biar MySQL diem
            'price' => $item->product->price,
        ]);
    }

    // update total setelah loop (lebih clean)
    $order->update(['total' => $total]);

    // baru kosongin cart
    CartItem::where('user_id', $userId)->delete();
});


    return redirect()->route('payment.success')
        ->with('order_id', $order->id);
}

}
