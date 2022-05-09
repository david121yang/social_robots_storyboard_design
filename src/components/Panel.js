import React from "react";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyle = makeStyles(() => ({
  panel: {
    height: "100vh",
  },
}));

const Panel = (props) => {
  const classes = useStyle();
  return (
    <Grid
      item
      container
      className={`${classes.panel} ${props.className}`}
      justify={props.justify ?? "center"}
      alignItems={props.alignItems ?? "center"}
      {...props}
    >
      {props.children}
    </Grid>
  );
};

export default Panel;
