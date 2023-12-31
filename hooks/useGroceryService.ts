import {
  useQueryClient,
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query'
import GroceryService from '../services/GroceryService'
import { useRef } from 'react'

const useGroceryService = (): {
  service: GroceryService
  getGroceryListsQuery: UseQueryResult<GroceryLists, Error>
  createGroceryMutation: UseMutationResult<void, Error, Partial<Grocery>>
  updateGroceryMutation: UseMutationResult<
    void,
    Error,
    Partial<Grocery> & Pick<Grocery, 'id'>
  >
  deleteGroceryMutation: UseMutationResult<void, Error, number>
} => {
  const serviceRef = useRef<GroceryService>()

  if (!serviceRef.current) {
    serviceRef.current = new GroceryService()
  }

  const service = serviceRef.current
  const queryClient = useQueryClient()

  const getGroceryListsQuery = useQuery<Grocery[], Error, GroceryLists>({
    queryKey: ['groceries'],
    queryFn: service.fetchGroceries,
    select: (data: Grocery[]) => {
      const purchasedGroceries = data.filter((grocery) => grocery.is_purchased)
      const pendingGroceries = data.filter((grocery) => !grocery.is_purchased)
      return {
        purchasedGroceries,
        pendingGroceries,
      }
    },
  })

  const createGroceryMutation = useMutation<void, Error, Partial<Grocery>>({
    mutationFn: service.createGrocery,
    onSuccess: () => {
      queryClient.invalidateQueries(['groceries'])
    },
  })

  const updateGroceryMutation = useMutation<
    void,
    Error,
    Partial<Grocery> & Pick<Grocery, 'id'>
  >({
    mutationFn: service.updateGrocery,
    onSuccess: () => {
      queryClient.invalidateQueries(['groceries'])
    },
  })

  const deleteGroceryMutation = useMutation<void, Error, number>({
    mutationFn: service.deleteGrocery,
    onSuccess: () => {
      queryClient.invalidateQueries(['groceries'])
    },
  })

  return {
    service,
    getGroceryListsQuery,
    createGroceryMutation,
    updateGroceryMutation,
    deleteGroceryMutation,
  }
}

export default useGroceryService
