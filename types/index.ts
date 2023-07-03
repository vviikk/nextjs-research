export interface Grocery {
  id: number
  name: string
  is_purchased: boolean
}

export interface GroceryLists {
  purchasedGroceries: Grocery[]
  pendingGroceries: Grocery[]
}
