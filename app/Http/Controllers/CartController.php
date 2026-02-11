<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CartItem as Cart;
use App\Models\Product; 
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index()
    {
        $cart = Cart::with('product')
            ->where('user_id', auth()->id())
            ->get();

        return Inertia::render('Cart', [
            'cartItems' => $cart,
        ]);
    }

   public function store(Request $request)
{
    $data = $request->validate([
        'product_id' => 'required|exists:products,id',
    ]);

    $cart = Cart::firstOrCreate(
        [
            'user_id' => auth()->id(),
            'product_id' => $data['product_id'],
        ],
        ['quantity' => 1] // 🔥 SESUAI DB
    );

    if (!$cart->wasRecentlyCreated) {
        $cart->increment('quantity');
    }

    return redirect()->back();
}


    public function update(Request $request, \App\Models\CartItem $cartItem)
{
    abort_if($cartItem->user_id !== auth()->id(), 403);

    $data = $request->validate([
        'quantity' => 'required|integer|min:1',
    ]);

    $cartItem->update([
        'quantity' => $data['quantity'],
    ]);

    return redirect()->back();
}


    public function destroy(Cart $cartItem)
    {
        $cartItem->delete();
        return redirect()->back();
    }

    public function checkout(Request $request)
{
    $cartItems = auth()->user()->cartItems()->with('product')->get();
    if ($cartItems->isEmpty()) return redirect()->back();

    DB::transaction(function() use ($cartItems) {
        $total = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);

        $order = Order::create([
            'user_id' => auth()->id(),
            'total' => $total,
        ]);

        foreach ($cartItems as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->product->price,
            ]);
        }

        // Kosongkan cart
        auth()->user()->cartItems()->delete();
    });

    return redirect()->route('orders.index')->with('success', 'Order berhasil dibuat!');
}
}
