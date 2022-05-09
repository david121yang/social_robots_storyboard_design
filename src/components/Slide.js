import React from "react";
import { Box, CircularProgress, Grid } from "@mui/material";



const Slide = (props) => {
    console.log(props.image);
    const imgSrc = require("../files/images/" + props.image)["default"];
  return (
    <button><div height = "50" width = "100"><img src = {imgSrc} height = "50"></img><br/>Slide {props.num}</div></button>
  );
};

export default Slide;