import * as React from 'react'
import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import { Container, ListSubheader } from '@mui/material'
import GroceryItem from '../components/GroceryItem'
import { QueryClient, useQuery } from '@tanstack/react-query'
import { Grocery } from '../types'
import useGroceryService from '../hooks/useGroceryService'

const fetchGroceries = async (): Promise<Grocery[]> => {
  const response = await fetch('/api/groceries')
  if (!response.ok) {
    throw new Error('Error fetching groceries')
  }
  return response.json()
}

const GroceryList: React.FC = () => {
  const { getGroceriesQuery } = useGroceryService()
  const { data: groceries, isLoading, isError } = getGroceriesQuery
  const [checked, setChecked] = React.useState<number[]>([0])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching groceries</div>
  }

  console.log(groceries)

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  return (
    <Paper elevation={3}>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {['To Buy', 'Purchased'].map((sectionId) => (
          <li key={`section-${sectionId}`}>
            <ul>
              <ListSubheader>{`${sectionId}`}</ListSubheader>
              {groceries.map((item) => (
                <GroceryItem
                  key={`item-${sectionId}-${item}`}
                  checked={checked}
                  handleToggle={handleToggle}
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
