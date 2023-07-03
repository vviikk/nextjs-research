import fetchMock from 'jest-fetch-mock'

import GroceryService from './GroceryService'
import { Grocery } from '../../types'

fetchMock.enableMocks()

describe('GroceryService', () => {
  let groceryService: GroceryService

  beforeEach(() => {
    groceryService = new GroceryService('http://localhost:3010/api')
  })

  beforeEach(() => {
    fetchMock.resetMocks()
  })

  describe('fetchGroceries', () => {
    it('should fetch groceries successfully', async () => {
      const mockResponse: Grocery[] = [
        { id: 1, name: 'Milk', is_purchased: true },
        { id: 2, name: 'Eggs', is_purchased: false },
        { id: 3, name: 'Bread', is_purchased: false },
      ]

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

      const result = await groceryService.fetchGroceries()

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3010/api/groceries'
      )
      expect(result).toEqual(mockResponse)
    })

    it('should throw an error when fetching groceries fails', async () => {
      fetchMock.mockRejectOnce(new Error('Error fetching groceries'))

      await expect(groceryService.fetchGroceries()).rejects.toThrow(
        'Error fetching groceries'
      )
    })
  })

  describe('createGrocery', () => {
    it('should create a grocery successfully', async () => {
      const grocery: Grocery = { id: 1, name: 'Milk' }

      fetchMock.mockResponseOnce(JSON.stringify({}))

      await groceryService.createGrocery(grocery)

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3010/api/groceries',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(grocery),
        }
      )
    })

    it('should throw an error when creating a grocery fails', async () => {
      const grocery: Grocery = { id: 1, name: 'Milk', is_purchased: true }

      fetchMock.mockRejectOnce(new Error('Error creating grocery'))

      await expect(groceryService.createGrocery(grocery)).rejects.toThrow(
        'Error creating grocery'
      )
    })
  })

  // Other test cases for updateGrocery, purchaseGrocery, deleteGrocery...
})
