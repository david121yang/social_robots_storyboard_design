import React from "react";
import { Box, CircularProgress, Grid } from "@mui/material";

const PageLoader = (props) => {
  return (
    <Grid container>
        <Box display="flex" flexDirection="column" alignItems="center">
          {props.children || <CircularProgress size="3rem" />}
        </Box>
    </Grid>
  );
};

export default PageLoader;
