import React, { useEffect, useState } from "react";
import {
  Paper,
  Grid,
  Step,
  Stepper,
  StepLabel,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRecoilState } from "recoil";
import { SceneCreator, SceneManager } from "../components";
import { sessionState, currentContext } from "../services/state";
import { useLocation} from "react-router-dom";
import "../App.css"

const useStyle = makeStyles((theme) => ({
  paper: {
    width: "100%",
    height: "100%",
  },
  logoutButton: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  navigation: {
    width: "100%",
    backgroundColor: "green",
    alignSelf: "flex-end",
    borderRadius: 0,
  },
}));

const ViewSessionPage = () => {
  const classes = useStyle();
  const [context, setContext] = useRecoilState(currentContext);
  const [session, setSession] = useRecoilState(sessionState);
  const location = useLocation();

  const selectText = "Select image...";
  const emptyEntry = {
    image: selectText,
    text: "",
  };

  const [fileName, setFileName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [jsonData, setJsonData] = useState([]);
  const [imgSrc, setImgSrc] = useState("");
  const [jsonText, setJsonText] = useState("");
  const[index, setIndex] = useState(0);
  // var newFile = false;

  // trigger warning if user attempts to leave session page
  useEffect(() => {
    window.onbeforeunload = () => true;
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    if (location.pathname === "/view") {
      // loads in our json file.
      console.log("loading saved project");
      console.log(context);
      // newFile = false;
      setFileName(context["file"]);
      setFolderName(context["folder"]);
      const data = require("../files/interventions/" + context["folder"] + "/" + context["file"]);
      for(var i = 0; i < data.length; i++) {
        jsonData.push(data[i]);
      }

      setImgSrc(getImgSrc(jsonData[index]["image"]))
      setJsonText(jsonData[index]["text"])
      console.log(data);

      setSession({
        ...session,
        startDate: new Date(),
        currentTask: "",
        taskProgress: {},
      });
    }
    // setup();
  }, []);

function getImgSrc(fileName) {
    return require("../files/images/" + fileName)["default"];
}

function prev() {
  const temp = index;
  if (temp > 0) {
    setIndex(temp - 1);
    update(temp - 1);
  }
  
}

function next() {
  const temp = index;
  if (temp < jsonData.length - 1) {
    setIndex(temp + 1);
    update(temp + 1);
  }
}

function update(index) {
  setImgSrc(getImgSrc(jsonData[index]["image"]));

  setJsonText(jsonData[index]["text"]);
}

  return (
   
    <div className="App">
      <header className="header">View JSON</header>{" "}
      <div className="image">
        <img
          id="jsonImg"
          src={imgSrc}
          height="500"
          alt=""
        />
      </div>
      <div id="jsonText">{jsonText}</div><br />
      <div className="buttons">
        {" "}
        <button onClick={prev}>Prev</button>
        {" "}
        {index + 1} of {jsonData.length}
        {" "}
        <button onClick={next}>Next</button>
      </div>
    </div>
 
  );
};

export default ViewSessionPage;
