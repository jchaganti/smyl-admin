import { FormControl, Grid, InputLabel, MenuItem, Select, TextField, Paper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MaterialTable, { Icons } from 'material-table';
import React, { forwardRef, FunctionComponent, useState } from 'react';
import ButtonWithLoader from './ButtonWithLoader';
import { users, merchantToCategoryMapping, curatorToRetailer, myRetailers } from '../utils/demo-data';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { ROLES } from '../models';
import { difference } from 'lodash';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

interface TableData {
  retailer: string;
  categories: string;
}

const rows: TableData[] = myRetailers.map(retailer => {
  const _categories = Object.keys(merchantToCategoryMapping[retailer]);
  const categories = _categories && _categories.join(', ') || '';
  return {retailer, categories} as TableData;
});

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => (
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    table: {
      minWidth: 650,
    },
  })
));

const roleLabels: { [key: string]: string } = {
  'CURATOR': 'Curator',
  'PAYMENT_MANAGER': 'Payment manager'
}
const AddProductPage: FunctionComponent = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };



  return (
    <div className={classes.root}>
      <Tabs value={value} onChange={handleChange} indicatorColor="primary"
        textColor="primary" aria-label="add user">
        <Tab label="Assigned retailers" {...a11yProps(0)} />
        <Tab label="Add new product" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Grid container spacing={3}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Retailer</TableCell>
                  <TableCell align="left">Categories</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.retailer}>
                    <TableCell component="th" scope="row" style={{ width: 80 }}>
                      {row.retailer}
                    </TableCell>
                    <TableCell align="left" style={{ width: 320 }}>{row.categories}</TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField 
            required 
            fullWidth
            margin="normal"
            id="productLink"
            name="productLink" 
            label="Product link" 
            variant="outlined"  
            onChange={() => {}} 
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            required 
            fullWidth
            margin="normal"
            id="imageLink"
            name="imageLink" 
            label="Image link" 
            variant="outlined"  
            onChange={() => {}} 
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            required 
            fullWidth
            margin="normal"
            id="mrp"
            name="mrp" 
            label="M.R.P" 
            variant="outlined"  
            onChange={() => {}} 
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            required 
            fullWidth
            margin="normal"
            id="discountedPrice"
            name="discountedPrice" 
            label="Discounted price" 
            variant="outlined"  
            onChange={() => {}} 
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            required 
            fullWidth
            margin="normal"
            id="tags"
            name="tags" 
            label="Tags" 
            variant="outlined"  
            onChange={() => {}} 
          />
        </Grid>
      </Grid>
      <Grid container style={{marginTop: '2rem'}} spacing={10} justify="space-evenly">
          <Grid item xs={6}>
          </Grid>
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
              label='Submit'
              loading={false}
              disabled={false}
              onClick={() => { }}
              className={'submit'}
            />
          </Grid>

        </Grid>
      </TabPanel>
    </div>
  );
}

export default AddProductPage;