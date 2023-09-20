import { Cart } from '../types/cartTypes';

export const addDecimals = (num: number): number => {
  return Number((Math.round(num * 100) / 100).toFixed(2));
};

export const updateCart = (state: Cart) => {
  // Calculate the items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Calculate the shipping price: if order is over 100 then 0 otherwise 10
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

  // Calculate the tax price
  state.taxPrice = addDecimals(0.21 * state.itemsPrice);

  // Calculate the total price
  state.totalPrice = Number(
    (state.itemsPrice + state.shippingPrice + state.taxPrice).toFixed(2)
  );

  // Save the cart to localStorage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
