import { useEffect, useReducer, useState } from 'react'
import {
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  TextField,
  Box,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import EditIcon from '@mui/icons-material/Edit'
import useGroceryService from '../hooks/useGroceryService'

interface GroceryItemProps {
  grocery: Grocery
}

type PatchGrocery = Partial<Grocery> & Pick<Grocery, 'id' | 'amount'>

type Action =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_AMOUNT'; payload: number }

const initialState = (grocery: Grocery): PatchGrocery => ({
  id: grocery.id,
  name: grocery.name,
  amount: grocery.amount,
})

const reducer = (state: PatchGrocery, action: Action): PatchGrocery => {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload }
    case 'SET_AMOUNT':
      return { ...state, amount: action.payload }
    default:
      return state
  }
}

const useEdit = (grocery: Grocery) => {
  const { updateGroceryMutation } = useGroceryService()
  const [state, dispatch] = useReducer(reducer, grocery, initialState)
  const [editMode, setEditMode] = useState(false)
  const [isInvalid, setIsInvalid] = useState<boolean>()

  useEffect(() => {
    if (state.name?.trim() === '' || !state.amount || state.amount < 1) {
      setIsInvalid(true)
      return
    }
    // Validation passed, clear the error
    setIsInvalid(false)
  }, [state.name, state.amount])

  const handleEdit = async () => {
    if (editMode) {
      try {
        await updateGroceryMutation.mutateAsync({
          id: state.id,
          name: state.name,
          amount: state.amount,
        })
      } catch (error) {
        console.error('Error updating grocery:', error)
        // Handle error if necessary
      }
    }
    setEditMode(!editMode)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_NAME', payload: e.target.value })
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_AMOUNT', payload: parseInt(e.target.value) })
  }

  return {
    state,
    editMode,
    handleEdit,
    handleNameChange,
    handleAmountChange,
    isInvalid,
  }
}

const GroceryItem: React.FC<GroceryItemProps> = ({ grocery }) => {
  const { updateGroceryMutation, deleteGroceryMutation } = useGroceryService()
  const {
    state,
    editMode,
    handleEdit,
    handleNameChange,
    handleAmountChange,
    isInvalid,
  } = useEdit(grocery)

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

  return (
    <ListItem data-testid={`grocery-item-${grocery.id}`}>
      {editMode ? (
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '45%' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            fullWidth
            value={state.name}
            onChange={handleNameChange}
            error={state.name?.trim() === ''}
            required
            label="Name"
            size="small"
          />
          <TextField
            fullWidth
            type="number"
            value={state.amount}
            onChange={handleAmountChange}
            error={typeof state.amount != 'number' || state.amount < 1}
            helperText="Must be greater than 0"
            required={true}
            label="Amount"
            size="small"
          />
        </Box>
      ) : (
        <>
          <Checkbox checked={grocery.is_purchased} onChange={handleToggle} />
          <ListItemText
            primary={`${grocery.name} (x ${grocery.amount})`}
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
        disabled={editMode && isInvalid}
        data-testid={`${editMode ? 'save' : 'edit'}-button`}
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
