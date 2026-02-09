<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\CartController;
use App\Models\Product;


Route::get('/', function () {
    return Inertia::render('welcome');
});


// Route::get('/', function () {
//     return Inertia::render('Shop', [
//         'products' => Product::all() 
//     ]);
// });

Route::get('/shop', [ShopController::class, 'index'])->name('shop');

Route::middleware(['auth'])->group(function () {
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy']);
});

// Product Detail
Route::get('/product/{product}', function (Product $product) {
    return Inertia::render('ProductDetail', [
        'product' => $product
    ]);
});

// Admin (pastikan login user ada role admin)
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Admin/Dashboard'));
    Route::resource('/products', ProductController::class);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');



// Auth & Settings
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
