<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

class ProductController extends Controller
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
            'description' => 'nullable',
            'image' => 'nullable',  
        ]);

         if ($request->hasFile('image')) {
        $path = $request->file('image')->store('products', 'public');
        $data['image'] = $path;
        }

        Product::create($data);
        return redirect()->back();

       

    }

        public function update(Request $request, Product $product)
        {
            $data = $request->validate([
                'name' => 'required',
                'price' => 'required|integer',
                'stock' => 'required|integer',
                'description' => 'nullable',
                'image' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
            ]);

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                $data['image'] = $path;
            }

            $product->update($data);

            return redirect()->back();
        }   


    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->back();
    }
}
