export default function Orders({ orders }: { orders: any[] }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.length === 0 ? <p>Belum ada order bro.</p> : null}

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <span>Order #{order.id}</span>
              <span>Status: {order.status}</span>
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
