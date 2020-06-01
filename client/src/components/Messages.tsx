import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import React, { FunctionComponent, useState } from 'react';
import { Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';


const ErrorAlert: FunctionComponent<AlertProps> = (props: AlertProps) => {
  const [open, setOpen] = useState<boolean>(true);

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => setOpen(false);
  return (
    <Collapse in={open}>
      <Alert {...props} onClose={handleClose}>{props.children}</Alert>
    </Collapse>
  );
}

interface SnackbarProps {
  onClose?: Function;
  message: string;
}

export const SuccessSnackbar: FunctionComponent<SnackbarProps> = ({ message, onClose }) => {

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    if (onClose) {
      onClose();
    }

  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={true}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}
      action={
        <React.Fragment>
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  )
}
export default ErrorAlert;