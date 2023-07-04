import * as React from 'react'
import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import { Container, ListSubheader } from '@mui/material'
import GroceryItem from '../components/GroceryItem'
import useGroceryService from '../hooks/useGroceryService'
import { GroceryLists } from '../types'
import { camelCaseToCapitalized } from '../src/camelCaseToCapitalized'

const GroceryList: React.FC = () => {
  const {
    getGroceryListsQuery,
    updateGroceryMutation,
    deleteGroceryMutation, // Add deleteGroceryMutation
  } = useGroceryService()
  const { data: groceryLists, isLoading, isError } = getGroceryListsQuery
  const [checked, setChecked] = React.useState<number[]>([0])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching groceries</div>
  }

  console.log(groceryLists)

  const handleToggle = (value: number) => async () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)

    try {
      await updateGroceryMutation.mutateAsync({
        id: value,
        is_purchased: currentIndex === -1, // Toggle the value
      })
    } catch (error) {
      console.error('Error updating grocery:', error)
      // Handle error if necessary
    }
  }

  const handleDelete = (id: number) => {
    try {
      deleteGroceryMutation.mutateAsync(id)
    } catch (error) {
      console.error('Error deleting grocery:', error)
      // Handle error if necessary
    }
  }

  return (
    <Paper elevation={3}>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {/* hard coding the categories for ordering */}
        {['pendingGroceries', 'purchasedGroceries'].map((key) => (
          <li key={`section-${key}`}>
            <ul>
              <ListSubheader>{`${camelCaseToCapitalized(key)}`}</ListSubheader>
              {groceryLists[key as keyof GroceryLists].map((item) => (
                <GroceryItem
                  key={`item-${key}-${item}`}
                  checked={checked}
                  handleToggle={handleToggle}
                  handleDelete={handleDelete} // Pass the handleDelete function
                  value={item}
                />
              ))}
            </ul>
          </li>
        ))}
      </List>
    </Paper>
  )
}

const GroceryApp: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <GroceryList />
    </Container>
  )
}

export default GroceryApp
