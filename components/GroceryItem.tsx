import * as React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import CommentIcon from '@mui/icons-material/Comment'
import { Avatar, ListItemAvatar } from '@mui/material'
import { Grocery } from '../types'

type GrocerytItemProps = {
  value: Grocery
  checked: number[]
  handleToggle: (value: number) => () => void
}

const GroceryItem: React.FC<GrocerytItemProps> = ({
  value: grocery,
  checked,
  handleToggle,
}) => {
  const labelId = `checkbox-list-label-${grocery}`

  return (
    <ListItem
      key={`item-${grocery.id}`}
      secondaryAction={
        <IconButton edge="end" aria-label="comments">
          <CommentIcon />
        </IconButton>
      }
      disablePadding
      style={{ textDecoration: grocery.is_purchased ? 'line-through' : 'none' }}
    >
      <ListItemButton role={undefined} onClick={handleToggle(grocery.id)} dense>
        <ListItemAvatar>
          <Avatar
            alt={`Avatar n°${grocery.id + 1}`}
            src={`https://generative-placeholders.glitch.me/image?width=600&height=300&random=${Math.random()}`}
          />
        </ListItemAvatar>
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
