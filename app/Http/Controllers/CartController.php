<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CartItem;


class CartController extends Controller
{
  public function index()
    {
        return Inertia::render('Cart', [
            'cart' => CartItem::with('product')
                ->where('user_id', auth()->id())
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $item = CartItem::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'product_id' => $request->product_id
            ],
            [
                'quantity' => \DB::raw('quantity + 1')
            ]
        );

        return redirect()->back();
    }

    public function destroy(CartItem $cartItem)
    {
        $cartItem->delete();
        return redirect()->back();
    }
}
