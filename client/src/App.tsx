// prettier-ignore
import { ApolloProvider } from '@apollo/react-hooks';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppSharpIcon from '@material-ui/icons/ExitToAppSharp';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import { createBrowserHistory } from 'history';
import React, { FunctionComponent, useState } from 'react';
import { Route, Router } from 'react-router-dom';
import AddProductPage from './components/AddProductPage';
import AddUserPage from './components/AddUserPage';
import AssignCuratorPage from './components/AssignCuratorPage';
import CashbackRulesPage from './components/CashbackRulesPage';
import { MainListItems } from './components/ListItems';
import ProcessClaimsPage from './components/ProcessClaimsPage';
import SearchClaimsPage from './components/SearchClaimsPage';
import SignInPage from './components/SignInPage';
import client, { getAccessToken, saveInLocalStorage, removeFromLocalStorage } from './graphql/client';
import { withRoot } from './withRoot';
import jwtDecode from 'jwt-decode';
import { ROLES } from './models';
import { getRole } from './utils';
import AddRetailerPage from './components/AddRetailer';


const history = createBrowserHistory();


const Copyright: FunctionComponent = () => {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://material-ui.com/">
				Your Website
      </Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}


const drawerWidth = 240;

interface RoutesProps {
	accessToken: string;
}

const DEFAULT_COMPONENT = {
	[ROLES.ADMIN]: AddRetailerPage,
	[ROLES.CURATOR]: AddProductPage,
	[ROLES.PAYMENT_MANAGER]: ProcessClaimsPage,
}

function Routes({ accessToken }: RoutesProps) {
	const classes = useStyles();
	const role = getRole(accessToken);
	return (
		<div className={classes.content}>
			{role === ROLES.ADMIN && <Route exact={true} path='/add-retailer' component={AddRetailerPage} />}
			{role === ROLES.ADMIN && <Route exact={true} path='/add-cashback-rules' component={CashbackRulesPage} />}
			{role === ROLES.ADMIN && <Route exact={true} path='/add-users' component={AddUserPage} />}
			{role === ROLES.ADMIN && <Route exact={true} path='/assign-curators' component={AssignCuratorPage} />}
			{(role === ROLES.ADMIN || role === ROLES.CURATOR) && <Route exact={true} path='/add-product' component={AddProductPage} />}
			{(role === ROLES.ADMIN || role === ROLES.PAYMENT_MANAGER) && <Route exact={true} path='/manage-claims' component={ProcessClaimsPage} />}
			{(role === ROLES.ADMIN || role === ROLES.PAYMENT_MANAGER) && <Route exact={true} path='/search-claims' component={SearchClaimsPage} />}
			<Route exact={true} path='/' component={DEFAULT_COMPONENT[role]} />
		</div>
	);
}

type AppProps = {

}
const App: FunctionComponent<AppProps> = (props: AppProps) => {
	const classes = useStyles();
	const [open, setOpen] = React.useState(true);
	const [accessToken, setAccessToken] = useState<string>(getAccessToken());
	const handleAccessToken = (accessToken: string) => {
		saveInLocalStorage(accessToken);
		setAccessToken(accessToken);
	}
	const signOut = () => {
		removeFromLocalStorage();
		setAccessToken('');
	}

	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
	const role: string = getRole(accessToken);
	return (
		<ApolloProvider client={client}>
			{accessToken ? (
				<Router history={history}>
					<div className={classes.root}>
						<CssBaseline />
						<AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
							<Toolbar className={classes.toolbar}>
								<IconButton
									edge="start"
									color="inherit"
									aria-label="open drawer"
									onClick={handleDrawerOpen}
									className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
								>
									<MenuIcon />
								</IconButton>
								<Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
									Smyl admin panel
          			</Typography>
								<IconButton color="inherit">
									<ExitToAppSharpIcon onClick={signOut} />
								</IconButton>
							</Toolbar>
						</AppBar>
						<Drawer
							variant="permanent"
							classes={{
								paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
							}}
							open={open}
						>
							<div className={classes.toolbarIcon}>
								<IconButton onClick={handleDrawerClose}>
									<ChevronLeftIcon />
								</IconButton>
							</div>
							<Divider />
							<List><MainListItems role={role} /></List>
						</Drawer>
						<main className={classes.content}>
							<div className={classes.appBarSpacer} />
							<Container maxWidth="lg" className={classes.container}>
								<Routes accessToken={accessToken} />
								<Box pt={4}>
									<Copyright />
								</Box>
							</Container>
						</main>

					</div>
				</Router>
			) : <SignInPage setAccessToken={handleAccessToken} />}

		</ApolloProvider>
	);
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		display: 'flex',
	},
	toolbar: {
		paddingRight: 24, // keep right padding when drawer closed
	},
	toolbarIcon: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: 36,
	},
	menuButtonHidden: {
		display: 'none',
	},
	title: {
		flexGrow: 1,
	},
	drawerPaper: {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerPaperClose: {
		overflowX: 'hidden',
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		width: theme.spacing(7),
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9),
		},
	},
	appBarSpacer: {
		...theme.mixins.toolbar
	},
	content: {
		flexGrow: 1,
		height: '100vh',
		overflow: 'auto',
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	paper: {
		padding: theme.spacing(2),
		display: 'flex',
		overflow: 'auto',
		flexDirection: 'column',
	},
	fixedHeight: {
		height: 240,
	},
}));

export default withRoot(App);
