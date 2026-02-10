<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CartItem as Cart;
use App\Models\Product; 

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
}
