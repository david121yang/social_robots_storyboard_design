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
import axios from "axios"
import { useLocation} from "react-router-dom";
import "../App.css"
import { Slide, Sidebar } from "../components/index"

const client = axios.create({
  baseURL: "http://localhost:5000/"
});


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

const EditSessionPage = () => {
  const classes = useStyle();
  const [context, setContext] = useRecoilState(currentContext);
  const [session, setSession] = useRecoilState(sessionState);
  const location = useLocation();

  const selectText = "Select image...";
  const emptyEntry = {
    image: selectText,
    text: "",
  };

  // states:
  // filename and entire json data
  // image name, image source data, and accompanying text for specific slide in view
  const [fileName, setFileName] = useState("");
  const [jsonData, setJsonData] = useState([]);
  const [imgOption, setImageOption] = useState("Select image:")
  const [imgSrc, setImgSrc] = useState("");
  const[index, setIndex] = useState(0);
  const [jsonText, setJsonText] = useState("");
  const handleChange = (event) => {
    setJsonText(event.target.value);
    jsonData[index]["text"] = event.target.value;
  };

  // trigger warning if user attempts to leave session page
  useEffect(() => {
    window.onbeforeunload = () => true;
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    setFileName(context["name"]);
    if (location.pathname === "/edit" && context["status"] === "new") {
      // if new, we will create an empty json entry to put into our file json.

      jsonData.push(JSON.parse(JSON.stringify(emptyEntry)));
      console.log("making new project")
      setSession({
        ...session,
        startDate: new Date(),
        currentTask: "",
        taskProgress: {},
      });
    } else if (location.pathname == "/edit" && context["status"] === "load") {
      // if loaded, we just load in the file.
      console.log("loading saved project");
      // newFile = false;
      const data = require("../files/jsons/" + context["name"]);
      for(var i = 0; i < data.length; i++) {
        jsonData.push(data[i]);
      }


      setSession({
        ...session,
        startDate: new Date(),
        currentTask: "",
        taskProgress: {},
      });
    }
    setup();
    // we overwrite context with none afterwards, as we have finished loading our json in.
    setContext({status: "none", name: context["name"]});
  }, []);


// Loads all images in the files/images folder, and returns as a list of strings.
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

// navigation functions for slides
function prev() {
  const temp = index;
  saveJSONEntry(temp);
  if (temp > 0) {
    setIndex(temp - 1)
    goTo(temp - 1);
  }
}

function next() {
  const temp = index;
  saveJSONEntry(temp);
  if (temp < jsonData.length - 1) {
    setIndex(temp + 1);
    goTo(temp + 1);
  }
}

function goTo(newIndex) {
  setIndex(newIndex);
  updateSlide(newIndex);
}

// react jsons are a little finicky, so here we pop until we reach the right index, add a new entry,
// and add the slides we popped back.
function addToJson(index) {
  var toAdd = [];
  const jsonLen = jsonData.length;
  for(var i = index + 1; i < jsonLen; i++) {
    toAdd.push(jsonData.pop());
  }
  var newEntry = JSON.parse(JSON.stringify(emptyEntry));
  jsonData.push(newEntry);
  const addLen = toAdd.length;
  for(var i = 0; i < addLen; i++) {
    jsonData.push(toAdd.pop());
  }
}

function addSlide() {
  const temp = index;
  saveJSONEntry(temp);
  addToJson(temp);
  
  setIndex(temp + 1);
  updateSlide(temp + 1);
}

// react jsons are a little finicky, so here we pop from our json until we reach the right index, then add everything
// but the slide we want to delete back.
function deleteFromJson(index) {
  var toAdd = [];
  const jsonLen = jsonData.length;
  for(var i = index; i < jsonLen; i++) {
   
    toAdd.push(jsonData.pop());
  }
  

  for(var i = toAdd.length - 2; i >= 0; i--) {
    jsonData.push(toAdd[i]);
  }
}

function deleteSlide() {
  const temp = index;
  saveJSONEntry(temp);
  jsonData[temp] = JSON.parse(JSON.stringify(emptyEntry));
  if (jsonData.length > 1) {
    deleteFromJson(temp);
  }

  const newIndex = Math.min(temp, jsonData.length - 1);
  setIndex(newIndex);
  updateSlide(newIndex);
  
}

// sends post request to server to save file.
function saveToFile() {
  console.log(fileName);
  async function postRequest(fileName, jsonData) {
    const res = await client.post("/", {
      file: fileName,
      json: jsonData
    });
    if(res.data.success) alert("File saved successfully.");
  }

  const temp = index;
  saveJSONEntry(temp);
  var sanitizedJson = [];
  for (var i = 0; i < jsonData.length; i++) {
    if (jsonData[i]["image"] !== selectText) {
      sanitizedJson.push(jsonData[i]);
    }
  }

  postRequest(fileName, sanitizedJson);

  // setJsonData(require("../files/jsons/" + fileName));
  
}

// updates the locally stored json entry.
function saveJSONEntry(index) {
  // var sel = document.getElementById("imageSelect");
  jsonData[index]["image"] = imgOption;

  jsonData[index]["text"] = jsonText;
}

// given our index, we update what we see in the browser, specifically the image selected and the text
function updateSlide(index) {
  document.getElementById("selectImg").value = imgOption;
  setImageOption(jsonData[index]["image"]);
  updateImage(jsonData[index]["image"])
  setJsonText(jsonData[index]["text"]);
}

let updateImageSelect = (e) => {
  jsonData[index]["image"] = e.target.value;
  updateSlide(index);
  // populateSideBar();
}

// if our file name isn't "Select image..." we will render, otherwise we don't set our source as anything.
function updateImage(fileName) {
  if (fileName !== selectText) {
    setImgSrc(getImgSrc(fileName));
  } else {
    setImgSrc("");
  }
}

// given a filename, we return the source of the image, unless it is our selectText, where we return an empty string,
// so our image won't render.
function getImgSrc(fileName) {
  if(fileName !== selectText) {
      return require("../files/images/"+fileName)["default"];
  }
  else return "";
}

function setup() {
  // populateImageSelect();
  updateSlide(index);
};


  return (
   
    <div className="App">
      
      <header className="header">Edit JSON</header>{" "}
      <div className="image">
        <div>
          <select id = "selectImg" onChange={updateImageSelect}>
            <option value = {imgOption}>{imgOption}</option>
            {loadImages().map((imgOption) => <option value = {imgOption}>{imgOption}</option>)}
          </select>
        </div>
        <div style={{ minHeight: 500 }}>
          <img id="jsonImg" height="500" alt="" src = {imgSrc} />
        </div>
      </div>
      <div id="text">
        <textarea id="jsonText" rows="4" cols="50" value = {jsonText} onChange ={handleChange}/>
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
      <div className="sidebar" id="sidebar">
      {
        /* Maps data from json data into buttons with slides. */
        jsonData.map((jsonEntry, i) => 
        <div>
            <button width = "200" onClick = {() => goTo(i)}>
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
    </div>
 
  );
};

export default EditSessionPage;
