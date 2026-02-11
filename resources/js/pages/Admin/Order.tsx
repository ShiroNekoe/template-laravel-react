export default function AdminOrders({ orders }: { orders: any[] }) {
  const statusOptions = ['pending', 'paid', 'packing', 'shipped', 'completed'];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Kelola Order</h2>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span>Order #{order.id} - {order.user.name}</span>
              <form method="POST" action={route('admin.orders.updateStatus', order.id)}>
                <input type="hidden" name="_method" value="POST" />
                <select name="status" defaultValue={order.status} className="border px-2 py-1 rounded">
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button type="submit" className="ml-2 px-2 py-1 bg-blue-600 text-white rounded">Update</button>
              </form>
            </div>

            <div className="space-y-1">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="mt-2 font-bold">
              Total: Rp {order.total.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
