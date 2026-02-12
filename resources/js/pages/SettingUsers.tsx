import { Head, useForm } from "@inertiajs/react";

export default function Settings({ user }: any) {
  const { data, setData, put, processing } = useForm({
    name: user.name,
    address: user.address || "",
    phone: user.phone || "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(route("settings.update"));
  }

  return (
    <div className="p-6 space-y-4">
      <Head title="Settings" />

      <h1 className="text-xl font-bold">User Settings</h1>

      <form onSubmit={submit} className="space-y-3">
        <input
          value={data.name}
          onChange={e => setData("name", e.target.value)}
          className="border p-2 w-full"
          placeholder="Name"
        />

        <textarea
          value={data.address}
          onChange={e => setData("address", e.target.value)}
          className="border p-2 w-full"
          placeholder="Alamat pengiriman"
        />

        <input
          value={data.phone}
          onChange={e => setData("phone", e.target.value)}
          className="border p-2 w-full"
          placeholder="Nomor HP"
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
