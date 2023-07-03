import * as React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import CommentIcon from '@mui/icons-material/Comment'

type GrocerytItemProps = {
  value: number
  checked: number[]
  handleToggle: (value: number) => () => void
}

const GroceryItem: React.FC<GrocerytItemProps> = ({
  value,
  checked,
  handleToggle,
}) => {
  const labelId = `checkbox-list-label-${value}`

  return (
    <ListItem
      key={value}
      secondaryAction={
        <IconButton edge="end" aria-label="comments">
          <CommentIcon />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checked.indexOf(value) !== -1}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
      </ListItemButton>
    </ListItem>
  )
}

export default GroceryItem
