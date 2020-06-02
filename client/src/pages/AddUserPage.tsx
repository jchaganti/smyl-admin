import { useMutation, useQuery } from '@apollo/react-hooks';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
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
import React, { forwardRef, FunctionComponent, useCallback, useMemo, useState, useEffect } from 'react';
import ButtonWithLoader from '../components/ButtonWithLoader';
import ErrorAlert, { SuccessSnackbar } from '../components/Messages';
import PageHeader from '../components/PageHeader';
import client from '../graphql/client';
import { signUpMutation, deleteUserMutation } from '../graphql/mutations';
import { getUsers } from '../graphql/queries';
import { User, Users, UsersData } from '../models';
import { cast } from '../utils';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
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
  })
));

const roleLabels: { [key: string]: string } = {
  'CURATOR': 'Curator',
  'PAYMENT_MANAGER': 'Payment manager'
}
const AddUserPage: FunctionComponent = () => {
  const classes = useStyles();

  const [currentTab, setCurrentTab] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [role, setRole] = useState<string>();

  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);

  const handleChange = useCallback((e: any, handler: Function) => {
    handler(e.currentTarget.value.trim());
  }, []);

  const handleEmailChange = useCallback((e: any) => handleChange(e, setEmail), []);

  const handleFirstNameChange = useCallback((e: any) => handleChange(e, setFirstName), []);

  const handleLastNameChange = useCallback((e: any) => handleChange(e, setLastName), []);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleRoleChange = useCallback((e: any) => {
    setRole(e.target.value);
  }, []);

  const submitDisabled = useMemo<boolean>(() => {
    return !firstName || !lastName || !email || !role;
  }, [firstName, lastName, email, role]);

  const { data }: UsersData = cast(useQuery(getUsers));
  const { users }: Users = data || [];

  const [state, setState] = useState({
    columns: [
      { title: 'First name', field: 'firstName' },
      { title: 'Last name', field: 'lastName' },
      { title: 'Email', field: 'email' },
      { title: 'Role', field: 'role', render: (rowData: any) => roleLabels[rowData.role] },
    ],
    data: users,
  });


  useEffect(() => {
    setState({
      ...state,
      data: users && users.filter(user => user.role !== 'ADMIN') || []
    })
  }, [users]);

  const [addUser] = useMutation(signUpMutation, {
    onCompleted: (data: any) => {
      const { signUp: { id, firstName, lastName, email, role } } = data;
      if (id && firstName && lastName && email && role) {
        const user: User = { id, firstName, lastName, email, role }
        client.writeData({
          data: { users }
        });
        setState({
          ...state,
          data: users && [...users, user].filter(user => user.role !== 'ADMIN') || []
        })
      }
    }
  });

  const [deleteUser] = useMutation(deleteUserMutation);

  const handleAddUser = useCallback(async (e: any) => {
    setActionInProgress(true);
    e.preventDefault();
    try {
      const { data: { signUp: { id } }, errors } = await addUser({ variables: { firstName, lastName, email, role } });
      if (!id || errors) {
        if (errors) {
          setError(errors[0].message);
        }
      } else {
        setMessage(`The user with ${firstName} ${lastName} with role ${role} has been added`);
        setFirstName('');
        setLastName('');
        setEmail('');
        setRole('');

      }
    } catch (e) {
      setError(e.message);
    } finally {
      setActionInProgress(false)
    }


  }, [firstName, lastName, email, role]);

  return (
    <div className={classes.root}>
      <PageHeader title={'Add user'} subTitle={'Add user details - first name, last name, email and their role'}></PageHeader>
      {error && <ErrorAlert style={{ marginTop: '1rem', marginBottom: '1.5rem' }} severity="error">{error}</ErrorAlert>}
      {message && <SuccessSnackbar message={message} onClose={() => setMessage('')}></SuccessSnackbar>}
      <Tabs value={currentTab} onChange={handleTabChange} indicatorColor="primary"
        textColor="primary" aria-label="add user">
        <Tab label="Add user" {...a11yProps(0)} />
        <Tab label="Manage users" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={currentTab} index={0}>
        <Grid container spacing={3}>

          <Grid item xs={6}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="firstName"
              label="First name"
              id="firstName"
              value={firstName}
              onChange={handleFirstNameChange}
              autoComplete="current-firstName"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="lastName"
              label="Last name"
              id="lastName"
              value={lastName}
              onChange={handleLastNameChange}
              autoComplete="current-lastName"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              autoComplete="current-email"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl className={classes.formControl}>
              <InputLabel id="user-role-select-filled-label">Role</InputLabel>
              <Select
                labelId="user-role-select-label"
                id="user-role-select"
                required
                displayEmpty
                fullWidth
                onChange={handleRoleChange}
              >
                <MenuItem value={'CURATOR'}>Curator</MenuItem>
                <MenuItem value={'PAYMENT_MANAGER'}>Payment manager</MenuItem>
              </Select>
            </FormControl>
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
              onClick={() => { }}
              className={'cancel'}
            />
          </Grid>
          <Grid item xs={3}>
            <ButtonWithLoader
              label='Submit'
              loading={actionInProgress}
              disabled={submitDisabled}
              onClick={handleAddUser}
              className={'submit'}
            />
          </Grid>


        </Grid>
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <MaterialTable
          icons={tableIcons}
          title="Manage users"
          columns={state.columns}
          data={state.data}
          editable={{
            onRowDelete: async (user: User) => {
              const { id } = user;
              const { data: { deleteUser: { status, error } } } = await deleteUser({ variables: { id } });
              if (status) {
                setMessage('User has been successfully deleted');
                setState((prevState) => {
                  const data = [...prevState.data];
                  data.splice(data.indexOf(user), 1);
                  return { ...prevState, data };
                });
              } else {
                setError(error);
              }
            }
          }}
        />
      </TabPanel>
    </div>
  );
}

export default AddUserPage;