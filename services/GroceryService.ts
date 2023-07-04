import { Grocery } from '../types'

class GroceryService {
  private serverUrl: string = '/api'

  constructor(serverUrl: string = '/api') {
    this.serverUrl = serverUrl

    // // iterate over properties of this class and bind them to the class
    // // this is necessary to ensure that `this` is bound correctly when
    // // these methods are called
    Object.getOwnPropertyNames(GroceryService.prototype)
      .filter((key) => typeof this[key] === 'function')
      .forEach((key) => {
        this[key] = this[key].bind(this)
      })
  }

  async fetchGroceries(): Promise<Grocery[]> {
    const response = await fetch(`${this.serverUrl}/groceries`)
    if (!response.ok) {
      throw new Error('Error fetching groceries')
    }
    return response.json()
  }

  async createGrocery(grocery: Grocery): Promise<void> {
    const response = await fetch(`${this.serverUrl}/groceries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(grocery),
    })
    if (!response.ok) {
      throw new Error('Error creating grocery')
    }
  }

  async updateGrocery(
    grocery: Partial<Grocery> & Pick<Grocery, 'id'>
  ): Promise<void> {
    const response = await fetch(`${this.serverUrl}/groceries/${grocery.id}`, {
      method: 'PATCH', // Use PATCH method instead of PUT
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(grocery),
    })
    if (!response.ok) {
      throw new Error('Error updating grocery')
    }
  }

  async purchaseGrocery(id: number, is_purchased: boolean): Promise<void> {
    // Use updateGrocery to toggle the is_purchased field
    await this.updateGrocery({
      id,
      is_purchased,
    })
  }

  async deleteGrocery(id: number): Promise<void> {
    const response = await fetch(`${this.serverUrl}/groceries/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Error deleting grocery')
    }
  }
}

export default GroceryService
