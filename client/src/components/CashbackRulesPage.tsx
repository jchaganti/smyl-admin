import React, { FunctionComponent, useState, ChangeEvent, useRef, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Paper, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { isUndefined } from 'lodash';
import usePrevious from '../hooks/usePrevious';
import ButtonWithLoader from './ButtonWithLoader';
import {merchantToCategoryMapping} from '../utils/demo-data';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }
}));

const CashbackRulesPage: FunctionComponent = (props) => {
  const [retailer, setRetailer] = useState<string>();
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [category, setCategory] = useState<string>();
  const [cashback, setCashback] = useState<number>();
  const [submissionInProgress, setSubmissionInProgress] = useState<boolean>(false);
  const classes = useStyles();
  const previousRetailer = usePrevious(retailer);

  //TODO: Fix any below
  const handleRetailerChange = (e: ChangeEvent<{}>, newValue: any) => {
    setRetailer(newValue);
    if (!!newValue) {
      setCategoryOptions(Object.keys(merchantToCategoryMapping[newValue]));
    } else {
      setCategoryOptions([]);
    }
    setCategory('');
    setCashback(undefined);
  }
  //TODO: Fix any below
  const handleCategoryChange = (e: ChangeEvent<{}>, newValue: any) => {
    setCategory(newValue);
    if (newValue) {
      const value = merchantToCategoryMapping[retailer as string][newValue];
      if (value && !isUndefined(value.cashBackPercent)) {
        setCashback(value.cashBackPercent);
      }
    } else {
      setCashback(undefined);
    }
  }

  const handleCashbackChange = (e: any) => {
    console.log('New cashback:', e.currentTarget.value)
    setCashback(e.currentTarget.value);
  }

  const handleSignIn = useCallback((e: any) => {
    setSubmissionInProgress(true);
    console.log(retailer, category, cashback)
    e.preventDefault();
    setTimeout(() => {
      setSubmissionInProgress(false);

    }, 2000);
  }, [cashback, retailer, category]);

  const handleCancel = useCallback((e: any) => {
    
  }, []);

  const submitDisabled = useMemo<boolean>(() => {
    return isUndefined(cashback) || !retailer || !category;
  }, [cashback, retailer, category]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3} justify="space-evenly">
        <Grid item xs>
          <h4>Add cashback rules for a retailer and their category.</h4>
        </Grid>

      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={5}>
          <Autocomplete
            id="combo-box-cashback-retailers"
            options={Object.keys(merchantToCategoryMapping)}
            style={{ width: 300 }}
            onChange={handleRetailerChange}
            renderInput={(params) => <TextField {...params} label="Retailer" variant="outlined" />}
          />
        </Grid>
        <Grid item xs={5}>
          <Autocomplete
            id="combo-box-cashback-categories"
            options={categoryOptions}
            style={{ width: 300 }}
            onChange={handleCategoryChange}
            renderInput={(params) => {
              //TODO: Below is a hack to be removed later
              if (categoryOptions.length === 0 || (!isUndefined(previousRetailer) && previousRetailer != retailer)) {
                const _props = params.inputProps as any;
                if (_props.value) {
                  _props.value = '';
                  _props.ref.current.value = '';
                }
              }
              return (
                <TextField {...params} label="Category" variant="outlined" />
              )
            }}
          />
        </Grid>
        <Grid item xs={2}>
          {<TextField label="Cashback %" variant="outlined" value={cashback || ''} focused={!isUndefined(cashback)} onChange={handleCashbackChange} />}
        </Grid>
      </Grid>
      <Grid container spacing={10} justify="space-evenly">

        <Grid item xs={6}>
          
        </Grid>
        <Grid item xs={3}>
          <ButtonWithLoader
            label='Cancel'
            loading={false}
            disabled={false}
            onClick={handleCancel}
            className={'cancel'}
          />
        </Grid>
        <Grid item xs={3}>
          <ButtonWithLoader
            label='Submit'
            loading={submissionInProgress}
            disabled={submitDisabled}
            onClick={handleSignIn}
            className={'submit'}
          />
        </Grid>


      </Grid>
    </div>
  )
}

export default CashbackRulesPage;