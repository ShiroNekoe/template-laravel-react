import { router, Head } from "@inertiajs/react";

export default function CheckoutPayment({ cart }: { cart: any[] }) {
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Head title="Pilih Pembayaran" />

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-4">Pilih Metode Pembayaran</h1>

        <div className="mb-4">
          <p className="text-gray-600">Total:</p>
          <p className="text-lg font-bold">
            Rp {total.toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() =>
              router.post(route("order.store"), { method: "COD" })
            }
            className="bg-green-600 text-white py-3 rounded-xl font-semibold"
          >
            Bayar COD
          </button>

          <button
            onClick={() =>
              router.post(route("order.store"), { method: "VA" })
            }
            className="bg-blue-600 text-white py-3 rounded-xl font-semibold"
          >
            Transfer / VA
          </button>
        </div>
      </div>
    </div>
  );
}
