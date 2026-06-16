export type CartItem = {
  productId: string;
  handle: string;
  title: string;
  description?: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  image?: string;
  variant?: string;
  quantity: number;
};

export type CartItemInput = Omit<CartItem, 'quantity'>;
