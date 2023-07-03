import { Grocery } from '../../types'

class GroceryService {
  private serverUrl: string
  constructor(serverUrl: string = '/api') {
    this.serverUrl = serverUrl
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
      method: 'PUT',
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
    // use updateGrocery to toggle the is_purchased field
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
