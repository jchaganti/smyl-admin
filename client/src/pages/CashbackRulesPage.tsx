import React, { FunctionComponent, useState, ChangeEvent, useRef, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Paper, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { isUndefined, toNumber, isEqual } from 'lodash';
import usePrevious from '../hooks/usePrevious';
import ButtonWithLoader from '../components/ButtonWithLoader';
import { merchantToCategoryMapping } from '../utils/demo-data';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { getAllRetailers } from '../graphql/queries';
import { addCashbackMutation } from '../graphql/mutations';
import PageHeader from '../components/PageHeader';
import ErrorAlert, { SuccessSnackbar } from '../components/Messages';
import { ApolloClient } from 'apollo-boost';
import { RetailersData, Retailer, Category } from '../models';
import { cast } from '../utils';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    paddingLeft: '1rem',
    paddingTop: '1rem'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  container: {
    marginLeft: '2rem'
  }
}));

const CashbackRulesPage: FunctionComponent = (props) => {
  const classes = useStyles();
  const client: ApolloClient<any> = useApolloClient();

  const [retailer, setRetailer] = useState<Retailer>();
  const previousRetailer: Retailer = cast(usePrevious(retailer));
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category>();
  const [cashback, setCashback] = useState<number>();

  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);

  const { data }: RetailersData = cast(useQuery(getAllRetailers));
  const retailers: Retailer [] = data ? data.retailers : [];
  const [addCashback] = useMutation(addCashbackMutation, {
    onCompleted: (data: any) => {
      const newRetailer: Retailer | undefined = retailers.find((_retailer: Retailer) => (retailer && retailer.id === _retailer.id));
      const newCategory: Category | undefined = newRetailer && newRetailer.categories && newRetailer.categories.find((_category: Category) => (category && _category.name === category.name));
      if(newCategory) {
        newCategory.cashbackPercent = toNumber(cashback);
        client.writeData({
          data: {
            retailers
          }
        });
      }
    }
  });

  //TODO: Fix any below
  const handleRetailerChange = (e: ChangeEvent<{}>, newRetailer: any) => {
    setRetailer(newRetailer);
    if (!!newRetailer) {
      setCategoryOptions(newRetailer.categories);
    } else {
      setCategoryOptions([]);
    }
    setCategory(undefined);
    setCashback(undefined);
  }
  //TODO: Fix any below
  const handleCategoryChange = (e: ChangeEvent<{}>, newCategory: any) => {
    setCategory(newCategory);
    if (newCategory) {
      setCashback(newCategory.cashbackPercent);
    } else {
      setCashback(undefined);
    }
  }

  const handleCashbackChange = (e: any) => {
    setCashback(e.currentTarget.value);
  }

  const handleSubmitCashback = useCallback(async (e: any) => {
    setActionInProgress(true);
    e.preventDefault();
    if(retailer && category) {
      try {
        const { data: { addCashback: { status, error } } } = await addCashback({ variables: { retailerId: retailer.id, category: category.name, cashbackPercent: toNumber(cashback) } });
        if (!status) {
          setError(error);
        } else {
          setMessage(`The cashback of ${cashback} has been added/updated for retailer ${retailer.name} for the category ${category.name}`); 
          setRetailer(undefined);
          setCategory(undefined);
          setCategoryOptions([]);
          setCashback(undefined);
        }
      } catch(e) {
        setError(e.message);
      } finally {
        setActionInProgress(false)
      }
    }
    
    
  }, [cashback, retailer, category]);

  const handleCancel = useCallback((e: any) => {

  }, []);

  const isInValidCashback = toNumber(cashback) >= 100;

  const submitDisabled = useMemo<boolean>(() => {
    return  !retailer || !category || isUndefined(cashback) || isInValidCashback;
  }, [cashback, retailer, category]);

  return (
    <div className={classes.root}>
      <PageHeader title={'Add cashback'} subTitle={'Add percentage of cashback that each retailer would provide for their category'}></PageHeader>
      {error && <ErrorAlert style={{marginTop: '1rem', marginBottom: '1.5rem'}} severity="error">{error}</ErrorAlert>}
      {message && <SuccessSnackbar message={message} onClose={() => setMessage('')}></SuccessSnackbar>}
      <Grid container spacing={5} alignItems={'flex-end'}>
        <Grid item xs={4}>
          <Autocomplete
            id="combo-box-cashback-retailers"
            options={retailers}
            getOptionLabel={(retailer: Retailer) => retailer.name}
            onChange={handleRetailerChange}
            renderInput={(params) => <TextField {...params} label="Retailer" variant="outlined" />}
          />
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            id="combo-box-cashback-categories"
            options={categoryOptions}
            getOptionLabel={(category: Category) => category.name}
            onChange={handleCategoryChange}
            renderInput={(params) => {
              //TODO: Below is a hack to be removed later
              if (categoryOptions.length === 0 || (!isUndefined(previousRetailer) && !isEqual(previousRetailer, retailer))) {
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
        <Grid item xs={2} >
          {<TextField 
            error={isInValidCashback}
            helperText="Should be < 100"
            label="Cashback %" 
            value={cashback || ''} 
            type="number" 
            focused={!isUndefined(cashback)} 
            onChange={handleCashbackChange} 
          />}
        </Grid>
        <Grid item xs={2}>

        </Grid>
        
      </Grid>

      <Grid container spacing={5} style={{marginTop: '2rem'}} alignItems={'flex-end'}>
        <Grid item xs={6}>

        </Grid>
        <Grid item xs={2}>
          <ButtonWithLoader
            label='Cancel'
            loading={false}
            disabled={false}
            onClick={handleCancel}
            className={'cancel'}
          />
        </Grid>
        <Grid item xs={2}>
          <ButtonWithLoader
            label='Submit'
            loading={actionInProgress}
            disabled={submitDisabled}
            onClick={handleSubmitCashback}
            className={'submit'}
          />
        </Grid>
        <Grid item xs={2}>

        </Grid>

      </Grid>


    </div>
  )
}

export default CashbackRulesPage;