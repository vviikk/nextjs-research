import * as React from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import EditIcon from '@mui/icons-material/Edit'
import { Checkbox, TextField } from '@mui/material'

interface GroceryItemProps {
  handleToggle: () => void
  handleEdit: (name: string) => void
  handleDelete: () => void
  grocery: {
    id: number
    name: string
    is_purchased: boolean
  }
}

const GroceryItem: React.FC<GroceryItemProps> = ({
  handleToggle,
  handleEdit,
  handleDelete,
  grocery,
}) => {
  const [editMode, setEditMode] = React.useState(false)
  const [editedName, setEditedName] = React.useState(grocery.name)

  const handleEditClick = () => {
    setEditMode(true)
  }

  const handleSaveClick = () => {
    handleEdit(editedName)
    setEditMode(false)
  }

  const handleCancelClick = () => {
    setEditMode(false)
    setEditedName(grocery.name)
  }

  return (
    <ListItem
      secondaryAction={
        <>
          {!editMode ? (
            <>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={handleEditClick}
              >
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </>
          ) : (
            <IconButton edge="end" aria-label="save" onClick={handleSaveClick}>
              <SaveIcon />
            </IconButton>
          )}
        </>
      }
    >
      {!editMode ? (
        <>
          <ListItemIcon>
            <Checkbox checked={grocery.is_purchased} onClick={handleToggle} />
          </ListItemIcon>
          <ListItemText primary={grocery.name} />
        </>
      ) : (
        <TextField
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          autoFocus
          fullWidth
          margin="none"
        />
      )}
    </ListItem>
  )
}

export default GroceryItem
