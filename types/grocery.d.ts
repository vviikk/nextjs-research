interface Grocery {
  id: number
  name: string
  is_purchased: boolean
  amount: number
}

interface GroceryLists {
  purchasedGroceries: Grocery[]
  pendingGroceries: Grocery[]
}
