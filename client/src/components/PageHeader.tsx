import { Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { FunctionComponent, useState } from 'react';


const useStyles = makeStyles((theme: Theme) => (
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    }
  })
));
interface PageHeaderProps {
  title: string;
  subTitle: string
}
const PageHeader: FunctionComponent<PageHeaderProps> = ({ title, subTitle }) => {
  const classes = useStyles();


  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography component="h1" variant="h5">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {subTitle}
          </Typography>
        </Grid>

      </Grid>

    </div>
  )
}

export default PageHeader;