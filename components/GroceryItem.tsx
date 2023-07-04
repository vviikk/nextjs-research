import * as React from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { Grocery } from '../types'

interface GroceryItemProps {
  // checked: boolean
  handleToggle: () => void
  handleDelete: () => void
  grocery: Grocery
}

const GroceryItem: React.FC<GroceryItemProps> = ({
  // checked,
  handleToggle,
  handleDelete,
  grocery,
}) => {
  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemIcon>
        <Checkbox checked={grocery.is_purchased} onClick={handleToggle} />
      </ListItemIcon>
      <ListItemText primary={grocery.name} />
    </ListItem>
  )
}

export default GroceryItem
