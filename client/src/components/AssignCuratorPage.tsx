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
import { users, merchantToCategoryMapping, curatorToRetailer } from '../utils/demo-data';
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
  fullName: string;
  retailers: string;
  otherRetailers: string[];
}

const allRetailers = Object.keys(merchantToCategoryMapping);

const curators = users.filter(user => user.role === ROLES.CURATOR);

const rows: TableData[] = curators.map(curator => {
  const retailers = curatorToRetailer[curator.email];
  const otherRetailers = difference(allRetailers, retailers);
  return {
    'fullName': `${curator.firstName} ${curator.lastName}`,
    'retailers': (retailers && retailers.join(', ')) || '',
    otherRetailers,
    curator
  }
});

const assignedCuratorEmails = Object.keys(curatorToRetailer);

const assignedCurators = curators.filter(curator => assignedCuratorEmails.includes(curator.email));

const assignedCuratorRows = assignedCurators.flatMap(curator =>  {
  const retailers = curatorToRetailer[curator.email];
  return retailers.map(retailer => ({
    'fullName': `${curator.firstName} ${curator.lastName}`,
    'email': curator.email,
    retailer
  }))
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
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const [state, setState] = useState({
    columns: [
      { title: 'Curator name', field: 'fullName' },
      { title: 'Email', field: 'email' },
      { title: 'Retailer', field: 'retailer'},
    ],
    data: assignedCuratorRows,
  });

  return (
    <div className={classes.root}>
      <Tabs value={value} onChange={handleChange} indicatorColor="primary"
        textColor="primary" aria-label="add user">
        <Tab label="Assign curator" {...a11yProps(0)} />
        <Tab label="Manage curators" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
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
                {rows.map((row) => (
                  <TableRow key={row.fullName}>
                    <TableCell component="th" scope="row" style={{ width: 160 }}>
                      {row.fullName}
                    </TableCell>
                    <TableCell align="center" style={{ width: 320 }}>{row.retailers}</TableCell>
                    <TableCell align="center">
                      <Select
                        labelId="other-retailer-select-label"
                        id="other-retailer-select"
                        required
                        displayEmpty
                        fullWidth
                        onChange={() => { }}
                      >
                        {row.otherRetailers.map(otherRetailer =>
                          <MenuItem value={otherRetailer}>{otherRetailer}</MenuItem>
                        )}
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
              loading={false}
              disabled={false}
              onClick={() => { }}
              className={'submit'}
            />
          </Grid>

        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MaterialTable
          icons={tableIcons}
          title="Manage curators"
          columns={state.columns}
          data={state.data}
          editable={{
            onRowDelete: (oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  setState((prevState) => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                  });
                }, 600);
              }),
          }}
        />
      </TabPanel>
    </div>
  );
}

export default AssignCuratorPage;