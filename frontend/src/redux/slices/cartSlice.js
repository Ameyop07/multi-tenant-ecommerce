import { createSlice } from "@reduxjs/toolkit";

const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");

const persist = (items) => localStorage.setItem("cart", JSON.stringify(items));

const sameLine = (a, b) => a.product === b.product && a.variantLabel === b.variantLabel;

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: storedCart },
  reducers: {
    addToCart: (state, action) => {
      const { product, name, variantLabel, quantity, price, image, storeId, storeName, stock } =
        action.payload;
      const line = { product, variantLabel };
      const existing = state.items.find((i) => sameLine(i, line));

      if (existing) {
        existing.quantity += quantity;
        // Refresh display fields in case the product was edited since it was added.
        existing.price = price;
        existing.name = name;
        if (stock !== undefined) existing.stock = stock;
      } else {
        state.items.push({
          product,
          name,
          variantLabel,
          quantity,
          price,
          image,
          storeId,
          storeName,
          stock,
        });
      }
      persist(state.items);
    },
    updateQuantity: (state, action) => {
      const { product, variantLabel, quantity } = action.payload;
      const item = state.items.find((i) => sameLine(i, { product, variantLabel }));
      if (item) item.quantity = Math.max(1, quantity);
      persist(state.items);
    },
    removeFromCart: (state, action) => {
      const { product, variantLabel } = action.payload;
      state.items = state.items.filter((i) => !sameLine(i, { product, variantLabel }));
      persist(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persist([]);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// ---- Selectors ----
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((n, i) => n + i.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
// Checkout is one-store-at-a-time (the server rejects mixed-store orders),
// so the UI needs to know when a cart spans multiple stores.
export const selectCartStoreIds = (state) => [
  ...new Set(state.cart.items.map((i) => i.storeId)),
];
