import React, {useEffect, useRef, useState}  from "react";
import { Grid, Button } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate} from "react-router-dom";
import Lottie from "lottie-react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { currentContext, sessionState } from "../services/state";
import axios from "axios"
import "../App.css"
const { readdirSync } = require('fs')

const client = axios.create({
  baseURL: "http://localhost:5000/"
});

/*
  This should probably be overhauled for the most part, because of the structure that we store our interventions in.
  I'm thinking it should probably be each intervention has its own folder, so that modifying a JSON won't change it in other areas.
 */
const InterventionPage = (props) => { 
  
  const setContext = useSetRecoilState(currentContext)
  const frameRef = useRef()
  const [session, setSession] = useRecoilState(sessionState);
  
  const location = useLocation();
  const navigate = useNavigate();
  const [interventions, setInterventions] = useState([]);
  const [intOption, setIntOption] = useState("");
  const [index, setIndex] = useState(0);

  var sessions = [];
  var sessionsData = [];

  useEffect(() => {
    //what to do on page load
    async function getFolders() {
      const res = await client.get("/interventions");
      if(res.data.success) return res.data.result;
      else return []
    }
    getFolders().then(function(result) {
      setInterventions(JSON.parse(result));
    });
    
  }, []);

  const selectText = "No interventions";
const emptyEntry = {
  sessions: [],
};

function loadInterventions() {
  return interventions;
}

function loadSessions() {
  function importAll(r) {
    return r.keys();
  }

  const interventions = importAll(
    require.context("../files/interventions/", false, /\.(json)$/)
  );

  for (var i = 0; i < interventions.length; i++) {
    interventions[i] = interventions[i].substring(2);
  }
  console.log(interventions);
  return interventions;
}

function getIntervSessions(folderName) {
  if(folderName == "") return [];
  
  var jsons = require("../files/interventions/" + folderName + "/order.json");
  var data = [];
  for (var i = 0; i < jsons.length; i++) {
    data.push(jsons[i]);
  }
  return data;
}

function getIntervData(sessions, folderName) {
  var data = [];
  for (var i = 0; i < sessions.length; i++) {
    data.push(require("../files/interventions/" + folderName + "/" + sessions[i]));
  }
  return data;
}

// var index = 0;

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

function goTo(newIndex) {
  setIndex(newIndex);
  updateSession(intOption, newIndex);
}

function prev() {
  if (index > 0) goTo(index - 1);
}

function next() {

  sessions = getIntervSessions(intOption);
  if (index < sessions.length - 1) goTo(index + 1);
}

function deleteSlide() {
  sessions = getIntervSessions(intOption);
  async function deleteRequest(fileName, folderName) {
    const res = await client.post("/deleteSession", {
      folder: folderName,
      file: fileName
    });
    if(!res.data.success) alert("Failed to delete.");
  }
  let proceed = window.confirm("Are you sure you want to delete " + sessions[index] + "?");
  if (proceed) {
    deleteRequest(sessions[index], intOption).then(alert("Deleted succesfully."));
  }
}

function addIntervention() {
  async function postRequest(folderName) {
    const res = await client.post("/intervention", {
      folder: folderName
    });
    if(!res.data.success) alert("Failed to delete.");
  }
  let intName = prompt("Enter intervention name:", "");
  if(intName != null) {
    postRequest(intName).then(alert("Added " + intName + " successfully."))
  }
}

function deleteIntervention() {
  // sessions = getIntervSessions(intOption);
  async function deleteRequest(folderName) {
    const res = await client.post("/deleteIntervention", {
      folder: folderName
    });
    if(!res.data.success) alert("Failed to delete.");
  }
  let proceed = window.confirm("Are you sure you want to delete " + intOption + "?");
  if (proceed) {
    deleteRequest(intOption).then(alert("Deleted successfully."));
  }
}

function updateSession(intOption, index) {

  sessions = getIntervSessions(intOption);
  sessionsData = getIntervData(sessions, intOption);
  // console.log(intOption);
  document.getElementById("intervTitle").innerHTML = sessions[index];
  
  updateImage(intOption, index);
  // console.log(sessions);
  document.getElementById("sessionPos").innerHTML =
    "Session " + (index + 1) + " of " + sessions.length;
}

let updateIntervSelect = (e) => {
  setIntOption(e.target.value);
  setIndex(0);
  
  updateSession(e.target.value, 0);

  document.getElementById("intervTitle").innerHTML = sessions[index];
}

// function updateIntervSelect() {

//   var sel = document.getElementById("intervSelect");
//   var text = sel.options[sel.selectedIndex].text;
//   index = 0;
//   intervSessions = getIntervSessions(text);
//   intervData = getIntervData(intervSessions);
//   updateImage();
//   document.getElementById("intervTitle").innerHTML = intervSessions[index];
// }

function updateImage(intOption, index) {
  sessions = getIntervSessions(intOption);

  sessionsData = getIntervData(sessions, intOption);

  if (sessionsData.length == 0 || sessionsData[index][0]["image"] == selectText) {
    document.getElementById("intervImg1").style.display = "none";
  }
  else {
    document.getElementById("intervImg1").style.display = "inline";
    var imgSrc = require("../files/images/" + sessionsData[index][0]["image"])['default'];
    document.getElementById("intervImg1").src = imgSrc;
  }
}

function populateIntervSelect() {
  // var interventions = loadInterventions();
  // var intervSelect = document.getElementById("intervSelect");
  // intervSelect.options.length = 0;
  // // var emptyOption = document.createElement("option");
  // // emptyOption.value = selectText;
  // // emptyOption.text = selectText;
  // // imageSelect.appendChild(emptyOption);
  // for (const val of interventions) {
  //   var option = document.createElement("option");
  //   option.value = val;
  //   option.text = val;
  //   intervSelect.appendChild(option);
  // }
}

function view() {

    // set context to the name of the json we are viewing.
    setContext({folder: intOption, name: sessions[index]});
    navigate("/view");
}

// we set our context to a JSON with status and name, where status indicates if it's an existing json or a new one.
// name is the name of the file that we would save to. This way, EditSessionPage will know what it's looking for.
function edit() {
  sessions = getIntervSessions(intOption);

  setContext({status: "load", folder: intOption, name: sessions[index]});
  navigate("/edit");
}

function newEdit() {
  // prompt user to enter a name for our json, then set context and go to edit.
  let fileName = prompt("Enter filename:", "test.json");
  if(fileName != null) {
    if (!fileName.endsWith(".json")) {
      fileName = fileName + ".json"
    }
  
    async function postRequest(fileName, folderName, index) {
      const res = await client.post("/new", {
        file: fileName,
        folder: folderName,
        index: index
      });
      if(!res.data.success) alert("Failed to create new file.");
    }
    postRequest(fileName, intOption, index).then(function(result) {
      setContext({status: "new", folder: intOption, name: fileName});
      navigate("/edit");
    });  
  }
  
}

window.onload = function setup() {
  populateIntervSelect();
  
  // updateIntervSelect();
  updateSession("", 0);
  // document.getElementById("jsonText").value = jsonData[index]["text"];
  // populateSideBar();
};


  return (
    <div className="App">
      <div className="sidebar" id="sidebar"></div>
      <header className="header">View Interventions</header>{" "}
      <div className="image">
        <div>
          <select id="intervSelect" onChange={updateIntervSelect}>
            <option value = {intOption}>{intOption}</option>
            {loadInterventions().map((intOption) => <option value = {intOption}>{intOption}</option>)}
          </select>
        </div>
        <div>
          <div id="intervTitle"></div>
        </div>
        <div style={{ minHeight: 500 }}>
          <img id="intervImg1" height="500" alt="" />
        </div>
        <div className="Session Operations">
          <button id = "viewSession" component={RouterLink} to = "/session" onClick={view}>View</button>
          <button id = "editSession" component={RouterLink} to = "/session" onClick={edit}>Edit</button>
          
          <br />
          <button id = "editSession" component={RouterLink} to = "/session" onClick={newEdit}>Add Session</button>
          <button onClick={deleteSlide}>Delete Session</button>
        </div>
      </div>
      <br></br>
      <div className="Intervention Operations">
        <div id="sessionPos">Session {index + 1} of 1</div>{" "}
        <div name="buttons">
          <button onClick={prev}>Prev Session</button>
          <button onClick={next}>Next Session</button>
          <br />

          <button onClick={addIntervention}>Add Intervention</button>
          <button onClick={deleteIntervention}>Delete Intervention</button>
        </div>
      </div>
    </div>
  );
};

export default InterventionPage;

