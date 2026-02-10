<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Product;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\DashboardController;

/*
|--------------------------------------------------------------------------
| PUBLIC (USER)
|--------------------------------------------------------------------------
*/

Route::get('/', fn () => redirect()->route('shop'))->name('home');

Route::get('/shop', [ShopController::class, 'index'])->name('shop');

Route::get('/product/{product}', function (Product $product) {
    return Inertia::render('ProductDetail', [
        'product' => $product,
    ]);
})->name('product.show');

Route::middleware('auth')->get('/settings', function () {
    return Inertia::render('Settings');
})->name('settings');

Route::post('/logout', function () {
    Auth::logout();
    return redirect()->route('shop');
})->name('logout');


/*
|--------------------------------------------------------------------------
| CART (HARUS LOGIN)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::put('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');
});

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('dashboard');

        Route::resource('/products', ProductController::class);
});

/*
|--------------------------------------------------------------------------
| AUTH & SETTINGS
|--------------------------------------------------------------------------
*/
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
