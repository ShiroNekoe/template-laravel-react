<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Midtrans\Snap;
use Midtrans\Notification;
use Midtrans\Config;

class OrderController extends Controller
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with(['orderItems.product'])
            ->latest()
            ->get();

        return inertia('Orders', [
            'orders' => $orders
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'method' => 'required|in:COD,VA',
        ]);

        $user = $request->user();
        $cart = $user->cartItems()->with('product')->get();

        if ($cart->isEmpty()) {
            return redirect()->route('payment.failed');
        }

        $order = DB::transaction(function () use ($user, $cart, $data) {

            $total = $cart->sum(
                fn ($item) => $item->product->price * $item->quantity
            );

            $order = Order::create([
                'user_id' => $user->id,
                'payment_method' => $data['method'],
                'status' => 'pending',
                'total' => $total,
            ]);

            foreach ($cart as $item) {

                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item->product_id,
                    'quantity'   => (int) $item->quantity,
                    'price'      => $item->product->price,
                ]);

                if ($data['method'] === 'COD') {
                    $affected = DB::update(
                        "UPDATE products 
                         SET stock = stock - ? 
                         WHERE id = ? AND stock >= ?",
                        [$item->quantity, $item->product_id, $item->quantity]
                    );

                    if ($affected === 0) {
                        throw new \Exception("Stock tidak cukup");
                    }
                }
            }

            $user->cartItems()->delete();

            return $order;
        });

        if ($data['method'] === 'COD') {
            return redirect()->route('payment.pending')
                ->with('order_id', $order->id);
        }

        return redirect()->route('orders.pay', $order->id);
    }

    public function pay(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $params = [
            'transaction_details' => [
                'order_id' => 'ORDER-' . $order->id,
                'gross_amount' => (int) $order->total,
            ],
            'customer_details' => [
                'first_name' => $order->user->name,
                'email' => $order->user->email,
            ],
        ];

        $snapToken = Snap::getSnapToken($params);

        return inertia('MidtransPayment', [
            'snapToken' => $snapToken,
            'order' => $order,
        ]);
    }

public function callback(Request $request)
{
    try {

        $notification = new Notification();

        $orderId = str_replace('ORDER-', '', $notification->order_id);
        $order = Order::with('orderItems')->find($orderId);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $transactionStatus = $notification->transaction_status;
        $fraudStatus = $notification->fraud_status ?? null;

        DB::transaction(function () use ($order, $transactionStatus, $fraudStatus) {

            // ✅ PAYMENT SUCCESS
            if (
                $transactionStatus == 'settlement' ||
                ($transactionStatus == 'capture' && $fraudStatus == 'accept')
            ) {

                if ($order->status !== 'paid') {

                    $order->update(['status' => 'paid']);

                    foreach ($order->orderItems as $item) {
                        DB::update(
                            "UPDATE products 
                             SET stock = stock - ? 
                             WHERE id = ? AND stock >= ?",
                            [$item->quantity, $item->product_id, $item->quantity]
                        );
                    }
                }
            }

            // ⏳ MASIH BELUM BAYAR
            elseif ($transactionStatus == 'pending') {
                $order->update(['status' => 'pending']);
            }

            // ❌ GAGAL / EXPIRE
            elseif (in_array($transactionStatus, ['deny', 'expire', 'cancel'])) {
                $order->update(['status' => 'failed']);
            }
        });

        return response()->json(['message' => 'OK'], 200);

    } catch (\Exception $e) {

        \Log::error('Midtrans Callback Error: ' . $e->getMessage());

        return response()->json(['message' => 'Error'], 500);
    }
}

    public function show(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load('orderItems.product');

        return inertia('OrderDetail', [
            'order' => $order,
        ]);
    }
}
