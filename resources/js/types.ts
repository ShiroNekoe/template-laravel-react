export type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    description?: string | null;
    image?: string | null;
};

export type CartItem = {
    id: number;
    quantity: number;
    product: Product;
};

type AuthUser = {
  id: number;
  name: string;
  email: string;
  roles?: string[];
} | null;
