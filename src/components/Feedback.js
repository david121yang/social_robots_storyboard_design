import React from "react";
import {
  Grid,
  useTheme,
  Button
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import {useSetRecoilState } from "recoil";

const useStyle = makeStyles((theme) => ({
  title: {
    fontWeight: 600,
  },
  loaderTitle: {
    fontSize: "1rem",
  },
  largeIcon: {
    fontSize: "8em",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    padding: theme.spacing(2),
    justifyContent: "center",
  },
  distribution: {
    height: "15vh",
  },
  card: {
    width: "100%",
  },
  flex: {
    display: "flex",
  },
  grow: {
    flexGrow: 1,
  },
  media: {
    height: "100%",
    width: "100%",
  },
}));

const Feedback = () => {
  const classes = useStyle();
  const theme = useTheme();

  return (
    <Grid container>
      <Grid item xs={1} />
        <Grid item xs={1}>
          <h1>THANK YOU FOR FINISHING THE STUDY</h1>
          </Grid> 
          
          
      <Grid item xs={1} />
      <Grid item xs={1}>
          <h3>Please click the sign out button.</h3>
          </Grid> 
          <Button variant="contained" color="primary">
               SIGN OUT
            </Button>
    </Grid>
  );
};

export default Feedback;
