import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Fab,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Grocery } from '../types'
import useGroceryService from '../hooks/useGroceryService'

interface AddGroceryDialogProps {
  onClose?: () => void
}

const AddGroceryDialog: React.FC<AddGroceryDialogProps> = ({ onClose }) => {
  const [newGroceryName, setNewGroceryName] = useState('')
  const [open, setOpen] = useState(false)
  const { createGroceryMutation } = useGroceryService()

  const handleCreateGrocery = async () => {
    if (newGroceryName.trim() !== '') {
      const newGrocery: Partial<Grocery> = {
        name: newGroceryName,
        is_purchased: false,
      }

      try {
        await createGroceryMutation.mutateAsync(newGrocery)
        setOpen(false)
      } catch (error) {
        console.error('Error adding item:', error)
      }

      setNewGroceryName('')
    }
  }

  const handleFabClick = () => {
    setOpen(true)
  }

  const handleCloseDialog = () => {
    setNewGroceryName('')
    setOpen(false)
    // onClose()
  }

  const { isLoading, isError } = createGroceryMutation

  return (
    <>
      <Fab
        color="primary"
        aria-label="Add"
        onClick={handleFabClick}
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Add Grocery</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Grocery Name"
            fullWidth
            value={newGroceryName}
            onChange={(e) => setNewGroceryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateGrocery} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddGroceryDialog
