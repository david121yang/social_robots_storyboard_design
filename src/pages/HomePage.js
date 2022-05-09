import React, {useEffect, useRef}  from "react";
import { Grid, Button } from "@mui/material";
import { Link as RouterLink, useLocation} from "react-router-dom";
import Lottie from "lottie-react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { currentContext, sessionState } from "../services/state";

const HomePage = (props) => { 
  
  const setContext = useSetRecoilState(currentContext)
  const frameRef = useRef()
  const [session, setSession] = useRecoilState(sessionState);
  const location = useLocation();


  useEffect(() => {
    //what to do on page load
  }, []);

  return (
    <Grid container spacing={1} display="flex" direction="row" alignItems="center" justifyItems="center" ref={frameRef}>
        <Grid item>
          <Button
            size="large"
            variant="outlined"
            component={RouterLink}
            to="/session"
            onClick={() => setContext("new")}
          >
            NEW PROJECT
          </Button>
      </Grid>
      <Grid item>
          <Button
            size="large"
            variant="outlined"
            component={RouterLink}
            to="/session"
            onClick={() => setContext("load")}
          >
            LOAD PROJECT
          </Button>
      </Grid>
    </Grid>
  );
};

export default HomePage;

