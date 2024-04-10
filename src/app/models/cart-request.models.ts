import { ItemCarrito } from "./Itemcarrito-request.models";

export interface Cart {
    items: ItemCarrito[];
    totalAmount: number;
  }