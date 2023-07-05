import React, { useState } from 'react'
import {
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  TextField,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import EditIcon from '@mui/icons-material/Edit'
import useGroceryService from '../hooks/useGroceryService'
import { Grocery } from '../types'

interface GroceryItemProps {
  grocery: Grocery
}

const GroceryItem: React.FC<GroceryItemProps> = ({ grocery }) => {
  const { updateGroceryMutation, deleteGroceryMutation } = useGroceryService()
  const [editMode, setEditMode] = useState(false)
  const [editedName, setEditedName] = useState(grocery.name)

  const handleToggle = async () => {
    try {
      await updateGroceryMutation.mutateAsync({
        id: grocery.id,
        is_purchased: !grocery.is_purchased,
      })
    } catch (error) {
      console.error('Error updating grocery:', error)
      // Handle error if necessary
    }
  }

  const handleDelete = async () => {
    try {
      await deleteGroceryMutation.mutateAsync(grocery.id)
    } catch (error) {
      console.error('Error deleting grocery:', error)
      // Handle error if necessary
    }
  }

  const handleEdit = async () => {
    if (editMode) {
      try {
        await updateGroceryMutation.mutateAsync({
          id: grocery.id,
          name: editedName,
        })
      } catch (error) {
        console.error('Error updating grocery:', error)
        // Handle error if necessary
      }
    }
    setEditMode(!editMode)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value)
  }

  return (
    <ListItem data-testid={`grocery-item-${grocery.id}`}>
      {editMode ? (
        <TextField fullWidth value={editedName} onChange={handleNameChange} />
      ) : (
        <>
          <Checkbox checked={grocery.is_purchased} onChange={handleToggle} />
          <ListItemText
            primary={grocery.name}
            primaryTypographyProps={{
              style: {
                textDecoration: grocery.is_purchased ? 'line-through' : 'none',
              },
            }}
          />
        </>
      )}
      <IconButton
        edge="end"
        aria-label={editMode ? 'save' : 'edit'}
        onClick={handleEdit}
      >
        {editMode ? <SaveIcon /> : <EditIcon />}
      </IconButton>
      <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}

export default GroceryItem
