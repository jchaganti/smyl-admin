import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React, { FunctionComponent,  useCallback, useMemo, useState } from 'react';
import ButtonWithLoader from '../components/ButtonWithLoader';
import { signInMutation } from '../graphql/mutations';
import { useMutation } from '@apollo/react-hooks';
import ErrorAlert from '../components/Messages';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Smyl Labs
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface SignInProps {
  setAccessToken: Function;
}

const SignIn: FunctionComponent<SignInProps> = ({setAccessToken}) => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<string>();
  const [signInProgress, setSignInProgress] = useState<boolean>(false);
  const classes = useStyles();
  const [signIn] = useMutation(signInMutation);
  //TODO: Fix any type below
  const handleChange = useCallback((e: any, handler: Function) => {
    handler(e.currentTarget.value.trim());
  }, []);

  const handleEmailChange = useCallback((e: any) => handleChange(e, setEmail), []);

  const handlePasswordChange = useCallback((e: any) => handleChange(e, setPassword), []);

  const handleSignIn = useCallback(async (e: any) =>  {
    e.preventDefault();
    setSignInProgress(true);
    try {
      const {data:{signIn:{token}}} = await signIn({variables: {email, password}});
      setAccessToken(token);
      setError('')
    } catch(e) {
      setError(e.message.replace('GraphQL error: ', ''));
    } finally {
      setSignInProgress(false);
    }
    
  }, [email, password]);

  const submitDisabled = useMemo<boolean>(() => {
    return !email || !password;
  }, [email, password]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && <ErrorAlert severity="error">{error}</ErrorAlert>}
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={handleEmailChange}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={handlePasswordChange}
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <ButtonWithLoader
            label='Sign In'
            loading={signInProgress}
            disabled={submitDisabled}
            onClick={handleSignIn}
            className={'submit'}
          >
            
          </ButtonWithLoader>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}


export default SignIn;