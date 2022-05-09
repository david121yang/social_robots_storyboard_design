import React, { useEffect } from "react";
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
import { Slide } from "../components/Slide.js";


/** File currently not in use */

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

const SessionPage = () => {
  const classes = useStyle();
  const [context, setContext] = useRecoilState(currentContext);
  const [session, setSession] = useRecoilState(sessionState);
  const location = useLocation();

  // trigger warning if user attempts to leave session page
  useEffect(() => {
    window.onbeforeunload = () => true;
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    if (location.pathname === "/session" && context === "new") {
      console.log("setting session date")
      setSession({
        ...session,
        startDate: new Date(),
        currentTask: "",
        taskProgress: {},
      });
      setContext("manager")
    } else if (location.pathname == "/session" && context == "load") {
      console.log("loading saved project")
      setSession({
        ...session,
        startDate: new Date(),
        currentTask: "",
        taskProgress: {},
      });
      setContext("manager")
    }
  }, [location]);


  // const renderManagerPanel = () => {
  //   return (
  //     <Grid container>
  //       <SceneManager />
  //     </Grid>
  //   );
  // };

  // const renderCreatorPanel = () => {
  //   return (
  //     <Grid container>
  //       <SceneCreator />
  //     </Grid>
  //   );
  // };

const selectText = "Select image...";
const emptyEntry = {
  image: selectText,
  text: "",
};


var newFile = false;
var fileName = "test.json";
var jsonData = [];
jsonData.push(JSON.parse(JSON.stringify(emptyEntry)));

if (!newFile) {
  jsonData = require("../files/jsons/" + fileName);
}

var index = 0;

function loadImages() {
  function importAll(r) {
    return r.keys();
  }

  const images = importAll(
    require.context("../files/images/", false, /\.(png|jpe?g|svg)$/)
  );

  for (var i = 0; i < images.length; i++) {
    images[i] = images[i].substring(2);
  }
  return images;
}

function prev() {
  saveJSONEntry();
  if (index > 0) goTo(index - 1);
}

function next() {
  saveJSONEntry();
  if (index < jsonData.length - 1) goTo(index + 1);
}

function goTo(newIndex) {
  index = newIndex;
  updateSlide();
}

function addSlide() {
  saveJSONEntry();
  var newEntry = JSON.parse(JSON.stringify(emptyEntry));
  jsonData.splice(index + 1, 0, newEntry);
  index = index + 1;
  updateSlide();
}

function deleteSlide() {
  saveJSONEntry();
  jsonData[index] = JSON.parse(JSON.stringify(emptyEntry));
  if (jsonData.length > 1) {
    jsonData.splice(index, 1);
  }
  index = Math.min(index, jsonData.length - 1);
  updateSlide();
}

function saveToFile() {
  saveJSONEntry();
  var sanitizedJson = [];
  for (var i = 0; i < jsonData.length; i++) {
    if (jsonData[i]["image"] !== selectText) {
      sanitizedJson.push(jsonData[i]);
    }
  }
  var fileContent = JSON.stringify(sanitizedJson);
  var bb = new Blob([fileContent], { type: "text/plain" });
  var a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(bb);
  a.click();
}

function saveJSONEntry() {
  var sel = document.getElementById("imageSelect");
  var text = sel.options[sel.selectedIndex].text;
  jsonData[index]["image"] = text;

  jsonData[index]["text"] = document.getElementById("jsonText").value;
}

function updateSlide() {
  var imageSelect = document.getElementById("imageSelect");
  imageSelect.value = jsonData[index]["image"];

  document.getElementById("jsonText").value = jsonData[index]["text"];

  updateImage();

  document.getElementById("indexPos").innerHTML =
    index + 1 + " of " + jsonData.length;

  populateSideBar();
}

function updateImageSelect() {
  var sel = document.getElementById("imageSelect");
  var text = sel.options[sel.selectedIndex].text;
  jsonData[index]["image"] = text;
  updateImage();
  populateSideBar();
}

function updateImage() {
  if (jsonData[index]["image"] !== selectText) {
    document.getElementById("jsonImg").style.display = "inline";
    var imgSrc = require("../files/images/" + jsonData[index]["image"]);
    console.log(imgSrc);
    document.getElementById("jsonImg").src = imgSrc;
  } else {
    document.getElementById("jsonImg").style.display = "none";
  }
}

function populateImageSelect() {
  var images = loadImages();
  var imageSelect = document.getElementById("imageSelect");
  imageSelect.options.length = 0;
  var emptyOption = document.createElement("option");
  emptyOption.value = selectText;
  emptyOption.text = selectText;
  imageSelect.appendChild(emptyOption);
  for (const val of images) {
    var option = document.createElement("option");
    option.value = val;
    option.text = val;
    imageSelect.appendChild(option);
  }
}

function populateSideBar() {
  var sidebar = document.getElementById("sidebar");
  while (sidebar.firstChild) {
    sidebar.removeChild(sidebar.firstChild);
  }

  for (var i = 0; i < jsonData.length; i++) {
    var slideButton = document.createElement("button");

    var div = document.createElement("div");
    div.style.minHeight = "50px";
    div.style.minWidth = "100px";
    var previewImg = document.createElement("img");
    if (jsonData[i]["image"] !== selectText) {
      previewImg.style.display = "inline";
      var imgSrc = require("../files/images/" + jsonData[i]["image"]);
      previewImg.src = imgSrc;
    } else {
      previewImg.style.display = "none";
    }
    previewImg.height = 50;
    div.innerHTML = "Slide " + (i + 1);
    div.appendChild(document.createElement("br"));
    div.appendChild(previewImg);
    slideButton.appendChild(div);
    (function (_i) {
      slideButton.addEventListener("click", function () {
        goTo(_i);
      });
    })(i);
    sidebar.appendChild(slideButton);
    sidebar.appendChild(document.createElement("br"));
  }
}

window.onload = function setup() {
  populateImageSelect();
  document.getElementById("imageSelect").value = jsonData[index]["image"];
  document.getElementById("jsonText").value = jsonData[index]["text"];
  populateSideBar();
};

  return (
   
    <div className="App">
      <div className="sidebar" id="sidebar"></div>
      <header className="header">Edit JSON</header>{" "}
      <div className="image">
        <div>
          <select id="imageSelect" onChange={updateImageSelect}></select>
        </div>
        <div style={{ minHeight: 500 }}>
          <img id="jsonImg" height="500" alt="" />
        </div>
      </div>
      <div id="text">
        <textarea id="jsonText" rows="4" cols="50" />
      </div>
      <div className="buttons">
        {" "}
        <div id="indexPos">
          {index + 1} of {jsonData.length}
        </div>
        <div name="buttons">
          <button onClick={prev}>Prev</button>
          <button onClick={next}>Next</button>
          <br />
          <button onClick={addSlide}>Add Slide</button>
          <button onClick={deleteSlide}>Delete Slide</button>
          <br />
          <button onClick={saveToFile}>Save to File</button>
        </div>
      </div>
    </div>
 
  );
};

export default SessionPage;
