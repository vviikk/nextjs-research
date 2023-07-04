import React from 'react'
import {
  useQueryClient,
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
  QueryKey,
} from '@tanstack/react-query'
import GroceryService from '../services/GroceryService'
import { Grocery, GroceryLists } from '../types'

const useGroceryService = (): {
  service: GroceryService
  getGroceryListsQuery: UseQueryResult<GroceryLists, Error>
  createGroceryMutation: UseMutationResult<void, Error, Grocery>
  updateGroceryMutation: UseMutationResult<
    void,
    Error,
    Partial<Grocery> & Pick<Grocery, 'id'>
  >
  deleteGroceryMutation: UseMutationResult<void, Error, number>
} => {
  const serviceRef = React.useRef<GroceryService>()

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

  const createGroceryMutation = useMutation<void, Error, Grocery>({
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
