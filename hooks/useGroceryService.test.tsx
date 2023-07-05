import { renderHook, act, waitFor } from '@testing-library/react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useGroceryService from './useGroceryService'
import GroceryService from '../services/GroceryService'

// Mock the GroceryService class
jest.mock('../services/GroceryService')
const MockGroceryService = GroceryService as jest.MockedClass<
  typeof GroceryService
>

describe('useGroceryService', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
  })

  afterEach(() => {
    queryClient.clear()
  })

  it('should fetch groceries on initial load', async () => {
    const mockGroceries: Grocery[] = [
      { id: 1, name: 'Apple', is_purchased: false },
      { id: 2, name: 'Banana', is_purchased: true },
    ]
    const expectedGroceryLists = {
      pendingGroceries: [{ id: 1, is_purchased: false, name: 'Apple' }],
      purchasedGroceries: [{ id: 2, is_purchased: true, name: 'Banana' }],
    }
    MockGroceryService.prototype.fetchGroceries.mockResolvedValue(mockGroceries)

    const wrapper: React.FC = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useGroceryService(), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.getGroceryListsQuery.data).toEqual(
        expectedGroceryLists
      )
      expect(MockGroceryService.prototype.fetchGroceries).toHaveBeenCalledTimes(
        1
      )
    })
  })

  it('should create a grocery', async () => {
    const mockGrocery: Grocery = { id: 1, name: 'Apple', is_purchased: false }
    MockGroceryService.prototype.createGrocery.mockResolvedValue()

    const wrapper: React.FC = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    let hook
    await act(async () => {
      hook = renderHook(() => useGroceryService(), { wrapper })
    })
    const { result } = hook

    await act(async () => {
      await result.current.createGroceryMutation.mutateAsync(mockGrocery)
    })

    expect(MockGroceryService.prototype.createGrocery).toHaveBeenCalledWith(
      mockGrocery
    )
  })

  it('should update a grocery', async () => {
    const mockGrocery: Grocery = { id: 1, name: 'Apple', is_purchased: true }
    MockGroceryService.prototype.updateGrocery.mockResolvedValue()

    const wrapper: React.FC = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useGroceryService(), { wrapper })

    await act(async () => {
      await result.current.updateGroceryMutation.mutateAsync(mockGrocery)
    })

    expect(MockGroceryService.prototype.updateGrocery).toHaveBeenCalledWith(
      mockGrocery
    )
  })

  it('should delete a grocery', async () => {
    const groceryId = 1
    MockGroceryService.prototype.deleteGrocery.mockResolvedValue()

    const wrapper: React.FC = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useGroceryService(), { wrapper })

    await act(async () => {
      await result.current.deleteGroceryMutation.mutateAsync(groceryId)
    })

    expect(MockGroceryService.prototype.deleteGrocery).toHaveBeenCalledWith(
      groceryId
    )
  })
})
