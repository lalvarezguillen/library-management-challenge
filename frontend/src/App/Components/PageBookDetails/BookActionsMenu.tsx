import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from 'material-ui-popup-state/hooks'

interface Props {
  onEdit: () => void;
  onCheck: () => void;
  onDelete: () => void;
}

const BookActionsMenu = (props: Props) => {
  const { onEdit, onCheck, onDelete } = props;
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })

  const checkBook = () => {
    popupState.close();
    onCheck();
  }

  const deleteBook = () => {
    popupState.close();
    onDelete();
  }

  return (
    <div>
      <Button variant="contained" {...bindTrigger(popupState)}>
        Actions
      </Button>
      <Menu {...bindMenu(popupState)}>
        <MenuItem onClick={checkBook}>Check In</MenuItem>
        <MenuItem onClick={onEdit}>Edit</MenuItem>
        <MenuItem onClick={deleteBook}>Delete</MenuItem>
      </Menu>
    </div>
  )
}

export default BookActionsMenu;