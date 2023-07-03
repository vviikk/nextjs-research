import React from 'react'
import {
  useQueryClient,
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query'
import GroceryService from '../services/GroceryService'
import { Grocery } from '../../types'

const useGroceryService = (): {
  service: GroceryService
  getGroceriesQuery: UseQueryResult<Grocery[], Error>
  createGroceryMutation: UseMutationResult<void, Error, Grocery>
  updateGroceryMutation: UseMutationResult<void, Error, Grocery>
  deleteGroceryMutation: UseMutationResult<void, Error, number>
} => {
  const serviceRef = React.useRef<GroceryService>()

  if (!serviceRef.current) {
    serviceRef.current = new GroceryService()
  }

  const service = serviceRef.current
  const queryClient = useQueryClient()

  const getGroceriesQuery = useQuery<Grocery[], Error>({
    queryKey: ['groceries'],
    queryFn: service.fetchGroceries,
  })

  const createGroceryMutation = useMutation<void, Error, Grocery>({
    mutationFn: service.createGrocery,
    onSuccess: () => {
      queryClient.invalidateQueries(['groceries'])
    },
  })

  const updateGroceryMutation = useMutation<void, Error, Grocery>({
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
    getGroceriesQuery,
    createGroceryMutation,
    updateGroceryMutation,
    deleteGroceryMutation,
  }
}
export default useGroceryService
