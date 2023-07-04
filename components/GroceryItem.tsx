import * as React from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import DeleteIcon from '@mui/icons-material/Delete'
import { Grocery } from '../types'
import IconButton from '@mui/material/IconButton'

type GroceryItemProps = {
  value: Grocery
  handleToggle: (value: number) => () => void
  handleDelete: (id: number) => void // Add the handleDelete function
}

const GroceryItem: React.FC<GroceryItemProps> = ({
  value: grocery,
  handleToggle,
  handleDelete,
}) => {
  const labelId = `checkbox-list-label-${grocery}`

  return (
    <ListItem
      key={`item-${grocery.id}`}
      secondaryAction={
        <>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => handleDelete(grocery.id)} // Call handleDelete when the delete button is clicked
          >
            <DeleteIcon />
          </IconButton>
        </>
      }
      disablePadding
      style={{ textDecoration: grocery.is_purchased ? 'line-through' : 'none' }}
    >
      <ListItemButton role={undefined} onClick={handleToggle(grocery.id)} dense>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={grocery.is_purchased}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText id={labelId} primary={grocery.name} />
      </ListItemButton>
    </ListItem>
  )
}

export default GroceryItem
