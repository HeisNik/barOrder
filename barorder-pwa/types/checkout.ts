export type CheckoutLineItemInput = {
  menuItemId: string;
  quantity: number;
};

export type CheckoutRequest = {
  barId: string;
  items: CheckoutLineItemInput[];
};

export type CheckoutResponse = {
  checkoutUrl: string;
};
