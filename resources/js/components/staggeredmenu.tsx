import { useEffect, useRef, useState } from "react";

type Item = {
  label: string;
  onClick: () => void;
  className?: string;
};

interface Props {
  items: Item[];
  user: {
    name: string;
    email: string;
  };
  onClose: () => void;
}

export default function StaggeredMenu({ items, user, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [show, setShow] = useState(false);

  // animasi awal
  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  // stagger item
  useEffect(() => {
    let i = -1;
    const interval = setInterval(() => {
      i++;
      setVisibleIndex(i);
      if (i >= items.length) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [items.length]);

  // klik luar = tutup
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={`absolute right-0 mt-3 w-56 origin-top-right transition-all duration-200 ${
        show ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      {/* ARROW */}
      <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t rotate-45" />

      {/* BOX */}
      <div className="rounded-xl border bg-white shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <p className="font-semibold text-sm text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>

        {/* ITEMS */}
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`w-full text-left px-4 py-2 text-sm transition hover:bg-blue-50 ${
              item.className ?? ""
            } ${
              index <= visibleIndex
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
