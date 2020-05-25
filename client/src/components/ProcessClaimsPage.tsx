import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, TextField } from '@material-ui/core';
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
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MaterialTable, { Icons } from 'material-table';
import React, { forwardRef, FunctionComponent, useMemo, useState, useCallback, useRef } from 'react';
import { claimsData } from '../utils/demo-data';
import { toNumber, toString, cloneDeep } from 'lodash';

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
  categories: string[];
  bill: string;
  cashbackValue: number | undefined;
}

enum ACTIONS {
  NONE = 'NONE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT'
}

const claims: ClaimData[] = claimsData.map((claim: any) => {
  const { date, purchaseID, retailer, bill } = claim;

  const categories = (claim.categories && Object.keys(claim.categories)) || [];
  return {
    date: date.toLocaleDateString('en-IN'),
    purchaseID,
    fullName: `${claim.userFirstName} ${claim.userLastName}`,
    retailer,
    categories,
    bill,
    amount: undefined,
    cashbackValue: undefined
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
  })
));

const roleLabels: { [key: string]: string } = {
  'CURATOR': 'Curator',
  'PAYMENT_MANAGER': 'Payment manager'
}
type CategoryMap = { [key: string]: string };
const ProcessClaimsPage: FunctionComponent = () => {
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

  const handleCategoryChange = (event: any, rowData: ClaimData) => {
    const selectedCategory = event.target.value as string;
    const { purchaseID } = rowData;
    //TODO: Check why state updates aren't working
    // setSelectedCategories({
    //   ...selectedCategories,
    //   [toString(purchaseID)]: selectedCategory
    // });
    const categories: CategoryMap = _selectedCategories.current;
    categories[toString(purchaseID)] = selectedCategory;

  };
  const handleAmountChange = useCallback((event: any, rowData: ClaimData) => {
    const amount = toNumber(event.currentTarget.value);
    const { purchaseID } = rowData;
    const category = _selectedCategories.current[toString(purchaseID)];
    const claimData: any = claimsData.find(claimData => claimData.purchaseID === purchaseID);
    const categoriesData = claimData.categories;
    const categoryData = categoriesData[category];
    if (categoryData) {
      const cashBackPercent = categoryData.cashBackPercent;
      const cashbackValue = Math.round(amount * (cashBackPercent / 100));
      const claimsCpy: ClaimData[] = [...state.data];
      const newClaimData: any = claimsCpy.find(claimData => claimData.purchaseID === purchaseID);
      newClaimData.cashbackValue = cashbackValue;
      const newState = { columns: state.columns, data: claimsCpy }
      console.log('@@@ newState', newState)
      setState(newState);
    }
  }, [purchaseID]);

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
        title: 'Category', field: 'categories', render: (rowData: ClaimData) => {
          const labelId = `category-select-label-${rowData.purchaseID}`;
          const id = `id-${rowData.purchaseID}`;
          return <Select
            labelId={labelId}
            id={id}
            required
            displayEmpty
            fullWidth
            onChange={(e) => handleCategoryChange(e, rowData)}
          >
            {rowData.categories.map(category =>
              <MenuItem key={category} value={category}>{category}</MenuItem>
            )}
          </Select>
        }
      },
      {
        title: 'Amount', field: 'amount', render: (rowData: ClaimData) => {
          const labelId = `amount-select-label-${rowData.purchaseID}`;
          const id = `amount-id-${rowData.purchaseID}`;
          return <TextField
            required
            fullWidth
            style={{marginTop: '-8px'}}
            margin="normal"
            id={id}
            type="number"
            name={labelId}
            label="Bill"
            onChange={e => handleAmountChange(e, rowData)}
          />
        }
      },
      {
        title: 'Cashback', field: 'cashbackValue', render: (rowData: ClaimData) => {
          return <span style={{ color: 'green' }}> {rowData.cashbackValue} </span>
        }
      },
    ],
    data: claims,

  });

  const dialogTitle = useMemo<string>(() => {
    return action !== ACTIONS.NONE
      ? `Do you really want to ${action.toLowerCase()} the claim with purchase ID ${purchaseID}?`
      : ''
  }, [action, purchaseID]);

  return (
    <div className={classes.root}>
      <MaterialTable
        icons={tableIcons}
        title="Process claims"
        columns={state.columns}
        data={state.data}
        actions={[
          {
            icon: () => <Check />,
            tooltip: 'Approve the claim',
            onClick: (event, rowData: ClaimData | ClaimData[]) => {
              const purchaseID = (rowData as ClaimData).purchaseID;
              handleClickOpen(purchaseID, ACTIONS.APPROVE);
            }
          },
          {
            icon: () => <Clear />,
            tooltip: 'Reject the claim',
            onClick: (event, rowData: ClaimData | ClaimData[]) => {
              const purchaseID = (rowData as ClaimData).purchaseID;
              handleClickOpen(purchaseID, ACTIONS.REJECT);
            }
          },
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Note that this action can not be reversed. So {dialogTitle.toLowerCase()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ProcessClaimsPage;