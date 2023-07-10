import { BaseService } from './BaseService'

class GroceryService extends BaseService {
  constructor(serverUrl: string = process.env.API_URL || '/api') {
    super({ baseURL: serverUrl, slug: 'groceries' })
  }

  async fetchGroceries(): Promise<Grocery[]> {
    return this.get<Grocery[]>('/')
  }

  async createGrocery(grocery: Partial<Grocery>): Promise<void> {
    await this.post<void>('/', grocery)
  }

  async updateGrocery(
    grocery: Partial<Grocery> & Pick<Grocery, 'id'>
  ): Promise<void> {
    await this.patch<void>(grocery)
  }

  async purchaseGrocery(id: number, is_purchased: boolean): Promise<void> {
    await this.updateGrocery({ id, is_purchased })
  }

  async deleteGrocery(id: number): Promise<void> {
    await this.delete<void>(id)
  }
}

export default GroceryService
