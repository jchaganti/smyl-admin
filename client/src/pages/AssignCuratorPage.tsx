import { useMutation, useQuery } from '@apollo/react-hooks';
import { Grid, MenuItem, Paper, Select } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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
import { differenceWith } from 'lodash';
import MaterialTable, { Icons } from 'material-table';
import React, { forwardRef, FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import ButtonWithLoader from '../components/ButtonWithLoader';
import ErrorAlert, { SuccessSnackbar } from '../components/Messages';
import PageHeader from '../components/PageHeader';
import { assignRetailerToCuratorMutation, deleteUserMutation, unassignRetailerToCuratorMutation } from '../graphql/mutations';
import { getAllRetailers, getCurators } from '../graphql/queries';
import { CuratorsData, Retailer, RetailersData, User } from '../models';
import { cast } from '../utils';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

interface AssignedRowsData {
  curatorId: string;
  fullName: string;
  retailers: string;
  otherRetailers: Retailer[];
}

interface UnAssignedRowsData {
  curator: User;
  retailer: Retailer;
}

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
      minWidth: 650,
    },
  })
));

const roleLabels: { [key: string]: string } = {
  'CURATOR': 'Curator',
  'PAYMENT_MANAGER': 'Payment manager'
}
const AssignCuratorPage: FunctionComponent = () => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState(0);
  const [assignedRows, setAssignedRows] = useState<AssignedRowsData []>([]);
  const unAssignedRowData: UnAssignedRowsData [] = []
  const [curatorToRetailer, setCuratortoRetailer] = useState<{[key: string]: string}>({});
  const [unAssignState, setUnAssignState] = useState({
    columns: [
      { title: 'Curator name', field: 'fullName', render: (rowData: UnAssignedRowsData) => `${rowData.curator.firstName} ${rowData.curator.lastName}` },
      { title: 'Retailer', field: 'retailer', render: (rowData: UnAssignedRowsData) => rowData.retailer.name},
    ],
    data: unAssignedRowData,
  })
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);

  const handleRetailerChange = useCallback((e: any, curatorId: string) => {
    setCuratortoRetailer(prevCuratorToRetailer => ({
      ...prevCuratorToRetailer,
      [curatorId]: e.target.value
    }));
  }, []);

  
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentTab(newValue);
  };

  const submitDisabled = useMemo<boolean>(() => {
    return Object.keys(curatorToRetailer).length === 0;
  }, [curatorToRetailer]);

  const { data: curatorsData }: CuratorsData = cast(useQuery(getCurators));
  const { data: retailersData }: RetailersData = cast(useQuery(getAllRetailers));
  
  const populateRows = (curators: User [], allRetailers: Retailer []) => {
    const assignedRows: AssignedRowsData[] = curators.map(curator => {
      const curatorRetailers: Retailer [] = cast(curator.retailers);
      const otherRetailers = differenceWith(allRetailers, curatorRetailers, (retailer, curatorRetailer) => retailer.id === curatorRetailer.id);
      const curatorRetailerNames = curatorRetailers.map(retailer => retailer.name);
      return {
        'fullName': `${curator.firstName} ${curator.lastName}`,
        'retailers': (curatorRetailerNames && curatorRetailerNames.join(', ')) || '',
        otherRetailers,
        curatorId: curator.id
      }
    });
    setAssignedRows(assignedRows);

    const unAssignedRows: UnAssignedRowsData [] = cast(curators.flatMap(curator =>  {
      const {retailers} = curator;
      return retailers?  retailers.map(retailer => ({ curator, retailer })): {curator, retailer: {}}
    }));

    setUnAssignState({
      ...unAssignState,
      data: unAssignedRows
    })
  }

  useEffect(() => {
    if(curatorsData && retailersData) {
      const {curators} = curatorsData;
      const { retailers: allRetailers} = retailersData;
      if(curators && allRetailers) {
        populateRows(curators, allRetailers);
      }
    }
  }, [curatorsData, retailersData]);


  const [assignRetailerToCurator] = useMutation(assignRetailerToCuratorMutation);

  const [unAssignRetailerToCurator] = useMutation(unassignRetailerToCuratorMutation);

  const handleAssignCurator = useCallback(async (e: any) => {
    setActionInProgress(true);
    e.preventDefault();
    try {
      const promises: Promise<any> [] = Object.keys(curatorToRetailer).map(curatorId => assignRetailerToCurator({variables: {curatorId, retailerId: curatorToRetailer[curatorId]}}));
      const results = await Promise.all(promises);      
      setMessage('Retailers have been assigned for ' + results.length + ' curators');
      const {curators} = curatorsData;
      const { retailers: allRetailers} = retailersData;
      curators.forEach(curator => {
        const retailerId = curatorToRetailer[curator.id];
        if(retailerId && curator.retailers) {
          const retailer = allRetailers.find(retailer => retailer.id === retailerId);
          if(retailer) {
            curator.retailers.push(retailer);
          } else {
            console.error('Retailer not found');
          }
          
        }
      });
      populateRows(curators, allRetailers);
      setCuratortoRetailer({});
    } catch (e) {
      setError(e.message);
    } finally {
      setActionInProgress(false);
    }


  }, [curatorToRetailer]);

  return (
    <div className={classes.root}>
      <PageHeader title={'Assign/Unassign retailer'} subTitle={'Assign/Unassign a retailer to a curator.'}></PageHeader>
      {error && <ErrorAlert style={{ marginTop: '1rem', marginBottom: '1.5rem' }} severity="error">{error}</ErrorAlert>}
      {message && <SuccessSnackbar message={message} onClose={() => setMessage('')}></SuccessSnackbar>}
      <Tabs value={currentTab} onChange={handleChange} indicatorColor="primary"
        textColor="primary" aria-label="add user">
        <Tab label="Assign retailer" {...a11yProps(0)} />
        <Tab label="Unassign retailer" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={currentTab} index={0}>
        <Grid container spacing={3}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Curator name</TableCell>
                  <TableCell align="center">Current retailers</TableCell>
                  <TableCell align="center">Other retailers</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignedRows.map((row) => (
                  <TableRow key={row.fullName}>
                    <TableCell component="th" scope="row" style={{ width: 160 }}>
                      {row.fullName}
                    </TableCell>
                    <TableCell align="left">{row.retailers}</TableCell>
                    <TableCell align="center" style={{ width:200 }}>
                      <Select
                        labelId="other-retailer-select-label"
                        id="other-retailer-select"
                        required
                        displayEmpty
                        fullWidth
                        onChange={(e) => { handleRetailerChange(e, row.curatorId) }}
                      >
                        {row.otherRetailers.map(otherRetailer =><MenuItem value={otherRetailer.id}>{otherRetailer.name}</MenuItem>)}
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
              loading={actionInProgress}
              disabled={submitDisabled}
              onClick={handleAssignCurator}
              className={'submit'}
            />
          </Grid>

        </Grid>
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <MaterialTable
          icons={tableIcons}
          title="Manage curators"
          columns={unAssignState.columns}
          data={unAssignState.data}
          editable={{
            onRowDelete: async (rowData: UnAssignedRowsData) => {
                  const { curator, retailer } = rowData;
                  try {
                    const { data: { unassignRetailerToCurator: { status, error } }, errors } = await unAssignRetailerToCurator({ variables: { curatorId: curator.id, retailerId: retailer.id } });
                    if (status) {
                      setMessage(`The retailer ${retailer.name} has been successfully unassigned for the curator ${curator.firstName} ${curator.lastName}`);
                      const {curators} = curatorsData;
                      const { retailers: allRetailers} = retailersData;
                      const newCurator = curators.find(_curator => _curator.id === curator.id);
                      if(newCurator)  {
                        const {retailers} = newCurator;
                        if(retailers) {
                          const indx = retailers.findIndex(_retailer => _retailer.id ===  retailer.id);
                          if(indx > -1) {
                            retailers.splice(indx, 1);
                            populateRows(curators, allRetailers);
                          }
                        }
                      }
                    } else {
                      console.log('@@@ Errors001', errors)
                      if(errors) {
                        setError(errors[0].message);
                      }
                      setError(error);
                    }
                  }
                  catch(e) {
                    setError(e.message);
                  }
              }
                
          }}
        />
      </TabPanel>
    </div>
  );
}

export default AssignCuratorPage;