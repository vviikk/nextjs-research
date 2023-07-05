export interface Grocery {
  id: number
  name: string
  is_purchased: boolean
  amount: number
}

export interface GroceryLists {
  purchasedGroceries: Grocery[]
  pendingGroceries: Grocery[]
}
