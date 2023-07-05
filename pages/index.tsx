import React from 'react'
import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import { Container, ListSubheader, Box } from '@mui/material'
import GroceryItem from '../components/GroceryItem'
import useGroceryService from '../hooks/useGroceryService'
import { GroceryLists, Grocery } from '../types'
import { camelCaseToCapitalized } from '../src/camelCaseToCapitalized'
import AddGroceryDialog from '../components/AddGroceryDialog'

const GroceryList: React.FC = () => {
  const { getGroceryListsQuery, updateGroceryMutation, deleteGroceryMutation } =
    useGroceryService()
  const { data: groceryLists, isLoading, isError } = getGroceryListsQuery

  const handleToggle = async (item: Grocery) => {
    try {
      await updateGroceryMutation.mutateAsync({
        id: item.id,
        is_purchased: !item.is_purchased,
      })
    } catch (error) {
      console.error('Error updating grocery:', error)
      // Handle error if necessary
    }
  }

  const handleDelete = async (item: Grocery) => {
    try {
      await deleteGroceryMutation.mutateAsync(item.id)
    } catch (error) {
      console.error('Error deleting grocery:', error)
      // Handle error if necessary
    }
  }

  // Loading state
  if (isLoading) {
    return <div>Loading...</div>
  }

  // Error state
  if (isError) {
    return <div>Error fetching groceries</div>
  }

  return (
    <Paper
      elevation={3}
      sx={{
        top: '5rem',
        position: 'relative',
        maxHeight: 'calc(100vh - 10rem)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          p: '1rem',
        }}
      >
        <Box>
          <List
            sx={{
              width: '100%',
              position: 'relative',
              overflow: 'auto',
              '& ul': { padding: 0 },
            }}
            subheader={<li />}
          >
            {/* hard coding the categories for ordering */}
            {['pendingGroceries', 'purchasedGroceries'].map((key) => (
              <li key={`section-${key}`}>
                <ul>
                  <ListSubheader>{`${camelCaseToCapitalized(
                    key
                  )}`}</ListSubheader>
                  {groceryLists[key as keyof GroceryLists].map((item) => (
                    <GroceryItem
                      key={`item-${key}-${item.id}`}
                      handleToggle={() => handleToggle(item)}
                      handleDelete={() => handleDelete(item)}
                      // handleEdit={(name) => handleEdit(item.id, name)}
                      grocery={item}
                    />
                  ))}
                </ul>
              </li>
            ))}
          </List>
        </Box>
        <AddGroceryDialog />
      </Box>
    </Paper>
  )
}

export default GroceryList
