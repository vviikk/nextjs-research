import * as React from 'react'
import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import {
  Container,
  ListSubheader,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment, // Import Box component
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
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

  const handleEdit = async (id: number, name: string) => {
    try {
      await updateGroceryMutation.mutateAsync({
        id,
        name,
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
    <Paper
      elevation={3}
      // center on page
      sx={{
        marginTop: '15rem',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // alignItems: 'center',
          gap: '1rem',
          p: '1rem',
        }}
      >
        <Box>
          <TextField
            label="Add Grocery"
            value={newGroceryName}
            onChange={(e) => setNewGroceryName(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    color="primary"
                    onClick={handleAddGrocery}
                  >
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box>
          <List
            sx={{
              width: '100%',
              // maxWidth: 360,
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              maxHeight: 300,
              '& ul': { padding: 0 },
            }}
            subheader={<li />}
            // disablePadding
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
                      // checked={checked}
                      handleToggle={() => handleToggle(item)}
                      handleDelete={() => handleDelete(item)} // Pass the handleDelete function
                      handleEdit={(name) => handleEdit(item.id, name)}
                      grocery={item}
                    />
                  ))}
                </ul>
              </li>
            ))}
          </List>
        </Box>
      </Box>
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
