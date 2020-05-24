import React, { useCallback, useMemo, useState, FunctionComponent } from 'react';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export interface ButtonWithLoaderProps {
  onClick: any;
  loading: boolean;
  disabled: boolean;
  label: string;
  className: string;
}
const ButtonWithLoader: FunctionComponent<ButtonWithLoaderProps> =  
  ({ onClick, loading, disabled, label, className }: ButtonWithLoaderProps) => {
  const classes = useStyles();
  console.log('ClassName', className)  
  return (
    <Button
      type='submit'
      variant="contained"
      onClick={onClick}
      fullWidth
      className={classes.submit}
      disabled={loading || disabled}>
      {loading && <CircularProgress size={24} />}
      {!loading && label}
    </Button>

  );
}
  

  const useStyles = makeStyles((theme) => ({
    submit: {
      margin: theme.spacing(3, 0, 2),
      backgroundColor: theme.palette.primary.main,
    },
  }));
export default ButtonWithLoader;