import React from 'react'
import {
  useQueryClient,
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query'
import GroceryClient from '../services/GroceryService'
import { Grocery } from '../../types/Grocery'

const useGroceryService = (): {
  service: GroceryClient
  getGroceriesQuery: UseQueryResult<Grocery[], Error>
  createGroceryMutation: UseMutationResult<void, Error, Grocery>
  updateGroceryMutation: UseMutationResult<void, Error, Grocery>
  deleteGroceryMutation: UseMutationResult<void, Error, number>
} => {
  const serviceRef = React.useRef<GroceryClient>()

  if (!serviceRef.current) {
    serviceRef.current = new GroceryClient()
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
