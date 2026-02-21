<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/product/index-products', [
            'products' => Product::latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/product/create-products');
    }


    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'price' => 'required|integer',
            'stock' => 'required|integer',
            'description' => 'nullable',
            'image' => 'nullable',  
        ]);

         if ($request->hasFile('image')) {
        $path = $request->file('image')->store('products', 'public');
        $data['image'] = $path;
        }

        Product::create($data);
        return redirect()->route('admin.products.index');

    }


        public function edit(Product $product)
        {
            return Inertia::render('Admin/product/update-products', [
                'product' => $product
            ]);
        }


      public function update(Request $request, Product $product)
{
    $data = $request->validate([
        'name' => 'required|string',
        'price' => 'required|numeric',
        'stock' => 'required|integer',
        'description' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
    ]);

    if ($request->hasFile('image')) {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $data['image'] = $request->file('image')->store('products', 'public');
    }

    $product->update($data);

    return redirect()
        ->route('admin.products.index')
        ->with('success', 'Produk berhasil diupdate');
}


    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->back();
    }
}
