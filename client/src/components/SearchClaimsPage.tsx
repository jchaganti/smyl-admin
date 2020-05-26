import { MenuItem, Select, TextField, Grid, InputAdornment } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
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
import Receipt from '@material-ui/icons/Receipt';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import { default as Search, default as SearchIcon } from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { toNumber, toString } from 'lodash';
import MaterialTable, { Icons } from 'material-table';
import React, { forwardRef, FunctionComponent, useCallback, useRef, useState } from 'react';
import { searchClaimsData } from '../utils/demo-data';
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}


interface ClaimData {
  date: Date,
  purchaseID: number | string,
  fullName: string;
  retailer: string;
  category: string;
  cashbackValue: number | undefined;
  amount: number;
  status: string;
  bill: string;
}

enum ACTIONS {
  NONE = 'NONE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT'
}

const claims: ClaimData[] = searchClaimsData.map((claim: any) => {
  const { date, purchaseID, retailer, bill, category, cashbackValue, amount, status } = claim;
  return {
    date: date.toLocaleDateString('en-IN'),
    purchaseID,
    fullName: `${claim.userFirstName} ${claim.userLastName}`,
    retailer,
    category,
    bill,
    amount,
    cashbackValue,
    status
  }
});


const tableIcons: Icons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};


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
      width: '100%',
    },
    margin: {
      margin: theme.spacing(1),
    }
  })
));

const roleLabels: { [key: string]: string } = {
  'CURATOR': 'Curator',
  'PAYMENT_MANAGER': 'Payment manager'
}
type CategoryMap = { [key: string]: string };
const SearchClaimsPage: FunctionComponent = () => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [purchaseID, setPurchaseID] = useState<any>(null);
  const [action, setAction] = useState<ACTIONS>(ACTIONS.NONE);
  //TODO: Check why state updates aren't working
  // const [selectedCategories, setSelectedCategories] = useState<CategoryMap>({});

  const _selectedCategories = useRef<CategoryMap>({});

  const handleClickOpen = (purchaseID: any, action: ACTIONS) => {
    setOpen(true);
    setPurchaseID(purchaseID);
    setAction(action);
  };

  const handleClose = () => {
    setOpen(false);
    setPurchaseID(null);
    setAction(ACTIONS.NONE);
  };

  interface ITableData {
    columns: any[];
    data: any[];
  }
  const [state, setState] = useState<ITableData>({
    columns: [
      { title: 'Claim date', field: 'date' },
      { title: 'Purchase ID', field: 'purchaseID' },
      { title: 'User', field: 'fullName' },
      { title: 'Retailer', field: 'retailer' },
      {
        title: 'Category', field: 'category', 
      },
      {  title: 'Amount', field: 'amount', },
      {
        title: 'Cashback', field: 'cashbackValue', render: (rowData: ClaimData) => {
          return <span style={{ color: 'green' }}> {rowData.cashbackValue} </span>
        }
      },
      { title: 'Status', field: 'status',}
    ],
    data: claims,

  });

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            className={classes.margin}
            id="input-with-icon-textfield"
            label="Search users"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <MaterialTable
            icons={tableIcons}
            title="Search claims"
            columns={state.columns}
            data={state.data}
            options={{ actionsColumnIndex: -1 }}
            actions={[
              {
                icon: () => <Receipt />,
                tooltip: 'Show the bill',
                onClick: (event, rowData: ClaimData | ClaimData[]) => {
                  const bill = (rowData as ClaimData).bill;
                  window.open(bill)
                }
              }

            ]}
          />

        </Grid>

      </Grid>
    </div>
  );
}

export default SearchClaimsPage;