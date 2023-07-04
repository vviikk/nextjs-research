import * as React from 'react'
import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import { Container, ListSubheader, TextField, Button } from '@mui/material'
import GroceryItem from '../components/GroceryItem'
import useGroceryService from '../hooks/useGroceryService'
import { GroceryLists, Grocery } from '../types'
import { camelCaseToCapitalized } from '../src/camelCaseToCapitalized'

const GroceryList: React.FC = () => {
  const {
    getGroceryListsQuery,
    updateGroceryMutation,
    createGroceryMutation,
    deleteGroceryMutation,
  } = useGroceryService()
  const { data: groceryLists, isLoading, isError } = getGroceryListsQuery
  const [newGroceryName, setNewGroceryName] = React.useState('')

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching groceries</div>
  }

  console.log(groceryLists)

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

  const handleAddGrocery = () => {
    if (newGroceryName.trim() !== '') {
      const newGrocery: Grocery = {
        id: Date.now(),
        name: newGroceryName,
        is_purchased: false,
      }

      createGroceryMutation.mutate(newGrocery)
      setNewGroceryName('')
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

  return (
    <Paper elevation={3}>
      <TextField
        label="Add Grocery"
        value={newGroceryName}
        onChange={(e) => setNewGroceryName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleAddGrocery}>
        Add
      </Button>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {/* hard coding the categories for ordering */}
        {['pendingGroceries', 'purchasedGroceries'].map((key) => (
          <li key={`section-${key}`}>
            <ul>
              <ListSubheader>{`${camelCaseToCapitalized(key)}`}</ListSubheader>
              {groceryLists[key as keyof GroceryLists].map((item) => (
                <GroceryItem
                  key={`item-${key}-${item}`}
                  // checked={checked}
                  handleToggle={() => handleToggle(item)}
                  handleDelete={() => handleDelete(item)} // Pass the handleDelete function
                  grocery={item}
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
