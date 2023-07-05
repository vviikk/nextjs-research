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
  const { getGroceryListsQuery } = useGroceryService()
  const { data: groceryLists, isLoading, isError } = getGroceryListsQuery

  if (isLoading) {
    return <div>Loading...</div>
  }

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
        maxWidth: '500px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          p: '1rem',
          paddingBottom: '5rem',
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
              <li key={`section-${key}`} data-testid={key}>
                <ul>
                  <ListSubheader>{`${camelCaseToCapitalized(
                    key
                  )}`}</ListSubheader>
                  {groceryLists[key as keyof GroceryLists].map((item) => (
                    <GroceryItem
                      key={`item-${key}-${item.id}`}
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
