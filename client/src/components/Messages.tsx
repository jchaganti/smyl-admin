import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import React, { FunctionComponent } from 'react';
import { Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';


const ErrorAlert:FunctionComponent<AlertProps>  = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface SnackbarProps {
  onClose?: Function;
  message: string;
}

export const  SuccessSnackbar:FunctionComponent<SnackbarProps> = ({ message, onClose}) => {

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    if(onClose) {
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