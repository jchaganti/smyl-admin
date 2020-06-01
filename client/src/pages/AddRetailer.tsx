import { Grid, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { FunctionComponent, useState, useCallback, useMemo } from 'react';
import ButtonWithLoader from '../components/ButtonWithLoader';
import PageHeader from '../components/PageHeader';
import { useMutation } from '@apollo/react-hooks';
import { createRetailerMutation } from '../graphql/mutations';
import { isEmpty, uniqBy, lowerCase } from 'lodash';
import ErrorAlert, { SuccessSnackbar } from '../components/Messages';


const useStyles = makeStyles((theme: Theme) => (
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      paddingLeft: '1rem',
      paddingTop: '1rem'
    },
    container: {
      marginLeft: '2rem'
    }
  })
));

const AddRetailerPage: FunctionComponent = () => {
  const classes = useStyles();
  const [name, setName] = useState<string>();
  const [category, setCategory] = useState<string>();
  const [categories, setCategories] = useState<string []>();
  const [invalidCategories, setInValidCategories] = useState<boolean>(false);
  const [message, setMessage]  = useState<string>();
  const [error, setError] = useState<string>();
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);

  const [addRetailer] = useMutation(createRetailerMutation);
  
  const handleChange = useCallback((e: any, handler: Function) => {
    handler(e.currentTarget.value.trim());
  }, []);

  const handleNameChange = useCallback((e: any) => handleChange(e, setName), []);

  const submitDisabled = useMemo<boolean>(() => {
    return !name || !categories || isEmpty(categories);
  }, [name, categories]);

  const handleCategoriesChange = useCallback((e: any) => {
    const category: string = e.currentTarget.value.trim();
    setCategory(category);
    if(category && category.match(/^\w+(,\w+)*$/g)) {
      const categories = category.split(',');
      setCategories(uniqBy(categories, lowerCase));
      setInValidCategories(false);
    } else {
      setInValidCategories(true);
      setCategories(undefined);
    }
  }, []);

  const handleAddCategory = async (e: any) => {
    e.preventDefault();
    setActionInProgress(true);
    try {
      const {data: {createRetailer: {status, error}}} = await addRetailer({variables: {name, categories}});
      if(!status) {
        setError(error);
      } else {
        setMessage(`The retailer ${name} has been successfully added`);
        setCategories(undefined);
        setName('');
        setError('');
        setCategory('');
      }
    } catch(e) {
      setError(e.message.replace('GraphQL error: ', ''));
    } finally {
      setActionInProgress(false);
    }
  }
  return (
    <div className={classes.root}>
      <PageHeader title={'Add retailer'} subTitle={'Add retailer and their categories'}></PageHeader>
      {error && <ErrorAlert severity="error">{error}</ErrorAlert>}
      {message && <SuccessSnackbar message={message} onClose={() => setMessage('')}></SuccessSnackbar>}
      <Grid container spacing={3} className={classes.container}>
        <Grid item xs={8}>
          <TextField
            required
            fullWidth
            margin="normal"
            id="name"
            name="name"
            label="Retailer"
            variant="outlined"
            value={name}
            onChange={handleNameChange}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            error={invalidCategories}
            helperText="Categories should be comma separated alphanumeric values"
            required
            fullWidth
            margin="normal"
            id="categories"
            name="categories"
            label="Categories"
            variant="outlined"
            value={category}
            onChange={handleCategoriesChange}
          />
        </Grid>

      </Grid>
      <Grid container style={{ marginTop: '1rem' }} className={classes.container} spacing={10} justify="flex-start">
        <Grid item xs={3}>
          <ButtonWithLoader
            label='Cancel'
            loading={false}
            disabled={false}
            onClick={() => { }}
            className={'cancel'}
          />
        </Grid>
        <Grid item xs={3}>
          <ButtonWithLoader
            label='Add'
            loading={actionInProgress}
            disabled={submitDisabled}
            onClick={handleAddCategory}
            className={'submit'}
          />
        </Grid>

      </Grid>
    </div>
  )
}

export default AddRetailerPage;