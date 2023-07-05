import { useState } from 'react'
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

import useGroceryService from '@/hooks/useGroceryService'

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
        amount: 1,
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
        data-testid="add-grocery-button" // Add data-testid attribute
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        data-testid="add-grocery-dialog"
      >
        {' '}
        <DialogTitle>Add Grocery</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Grocery Name"
            fullWidth
            value={newGroceryName}
            onChange={(e) => setNewGroceryName(e.target.value)}
            data-testid="grocery-name-input" // Add data-testid attribute
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} data-testid="cancel-button">
            Cancel
          </Button>{' '}
          <Button
            onClick={handleCreateGrocery}
            variant="contained"
            data-testid="add-button" // Add data-testid attribute
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddGroceryDialog
