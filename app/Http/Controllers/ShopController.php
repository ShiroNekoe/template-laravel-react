<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

class ShopController extends Controller
{
     public function index()
    {
        return Inertia::render('Admin/Products', [
            'products' => Product::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'price' => 'required|integer',
            'stock' => 'required|integer',
            'description' => 'nullable'
        ]);

        Product::create($data);
        return redirect()->back();
    }

    public function update(Request $request, Product $product)
    {
        $product->update($request->all());
        return redirect()->back();
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->back();
    }
}
