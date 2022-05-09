import React from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import Slide from "./index"

function getImgSrc(fileName) {
    if(fileName !== "Select image...") {
        return require("../files/images/"+fileName)["default"];
    }
    else return "";
}

const Sidebar = (props) => {
    const data = JSON.parse(props.data);
  return (
    <div>
    {
        
        data.map((jsonEntry, i) => 
        <div>
            <button width = "200">
                <div>
                    <img src = {getImgSrc(jsonEntry["image"])} height = "50"/>
                    <br/>
                    Slide {i + 1}
                </div>
            </button>
            <br/>
        </div>
        )   
    }
    </div>
  );
};

export default Sidebar;