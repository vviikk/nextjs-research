import * as React from 'react'
import {
  TextField,
  Button,
  createTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'

interface AddGroceryDialogProps {
  open: boolean
  onClose: () => void
  onCreateGrocery: (name: string) => void
}

const AddGroceryDialog: React.FC<AddGroceryDialogProps> = ({
  open,
  onClose,
  onCreateGrocery,
}) => {
  const [newGroceryName, setNewGroceryName] = React.useState('')

  const handleCreateGrocery = () => {
    if (newGroceryName.trim() !== '') {
      onCreateGrocery(newGroceryName)
      setNewGroceryName('')
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreateGrocery} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddGroceryDialog
