import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player/youtube";
import { Button, Box, Typography , Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { alertState,  sessionState, currentContext } from "../services/state";


const useStyle = makeStyles(() => ({
  title: {
    fontWeight: 400,

  },
  player: {
    borderRadius: "2rem",
    overflow: "hidden",
    width: "100%",
    height: `${(8 / 12) * (9 / 16) * 100}vw`,
  },
  progress: {
    top: "auto",
    bottom: 0,
  },
}));

const SceneManager = () => {
  const classes = useStyle();
  const session = useRecoilValue(sessionState); //load scenes based on session information
  const setAlert = useSetRecoilState(alertState);
  const [context, setContext] = useRecoilState(currentContext);

  const renderLoadedScenes = () => {
    return (
      <Box
        display="flex"
        height="100%"
        flexDirection="column"
        justifyContent="center"
      >
        <Box m={1} />
        <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="center"
        >
          <Button variant="contained" color="primary">
            LOADED SCENE 1
          </Button>
          <Button variant="contained" color="primary">
            LOADED SCENE 2
          </Button>
        </Grid>
      </Box>
    );
  };

  return (
    <Box p={2} width="100%" height="100%" display="flex" flexDirection="column">
      {renderLoadedScenes}
      <Button
            size="large"
            variant="outlined"
            onClick={() => setContext("creator")}
          >
            ADD SCENE
          </Button>
    </Box>
  );
};

export default SceneManager;
