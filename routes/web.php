<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Product;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderAdminController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CheckoutController;

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

Route::middleware('auth')->group(function(){
  Route::middleware('auth')->group(function () {

    Route::get('/orders', [OrderController::class, 'index'])
        ->name('orders.index');

    // STEP 1 — halaman pilih metode pembayaran
    Route::get('/checkout/payment', [CheckoutController::class, 'payment'])
        ->name('checkout.payment');

    // STEP 2 — proses pembayaran (COD / Transfer)
    Route::post('/checkout/process', [CheckoutController::class, 'process'])
        ->name('checkout.process');

    // STEP 3 — hasil pembayaran
    Route::get('/payment/success', fn () =>
        Inertia::render('PaymentSuccess')
    )->name('payment.success');

    Route::get('/payment/failed', fn () =>
        Inertia::render('PaymentFailed')
    )->name('payment.failed');
    
    Route::get('/payment/pending', fn () =>
        Inertia::render('PaymentPending')
    )->name('payment.pending');
    
    

    // Simpan order (opsional, kalau mau pisah dari checkout)
    Route::post('/orders', [OrderController::class, 'store'])
        ->name('order.store');

         Route::get('/orders/{order}', [OrderController::class, 'show'])
        ->name('orders.show');
});

    });


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

        Route::get('/orders', [OrderAdminController::class, 'index'])
            ->name('orders.index');

        Route::get('/orders/{order}', [OrderAdminController::class, 'show'])
            ->name('orders.show'); // <-- DETAIL PAGE

        Route::post('/orders/{order}/status', [OrderAdminController::class, 'updateStatus'])
            ->name('orders.updateStatus'); // <-- UPDATE STATUS
});

/*
|--------------------------------------------------------------------------
| AUTH & SETTINGS
|--------------------------------------------------------------------------
*/
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
