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
import React, { FunctionComponent, useEffect } from 'react';
import { Route, Router, useHistory } from 'react-router-dom';
import HomePage from './components/HomePage';
import { mainListItems } from './components/ListItems';
import SignInPage from './components/SignInPage';
import CashbackRulesPage from './components/CashbackRulesPage';
import AddUserPage from './components/AddUserPage'
import AssignCuratorPage from './components/AssignCuratorPage'
import client, { getAccessToken } from './graphql/client';
import { withRoot } from './withRoot';


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

function Routes() {
	const classes = useStyles();

	return (
		<div className={classes.content}>
			<Route exact={true} path='/' component={AssignCuratorPage} />
			<Route exact={true} path='/home' component={HomePage} />
		</div>
	);
}

type AppProps = {

}
const App: FunctionComponent<AppProps> = (props: AppProps) => {
	const classes = useStyles();
	const [open, setOpen] = React.useState(true);
	const accessToken = getAccessToken();

	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

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
									<ExitToAppSharpIcon />
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
							<List>{mainListItems}</List>
						</Drawer>
						<main className={classes.content}>
							<div className={classes.appBarSpacer} />
							<Container maxWidth="lg" className={classes.container}>
								<Routes />
								<Box pt={4}>
									<Copyright />
								</Box>
							</Container>
						</main>

					</div>
				</Router>
			) : <SignInPage />}

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
