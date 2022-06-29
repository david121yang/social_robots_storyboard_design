const express = require("express"),
  app = express(),
  port = process.env.PORT || 5000,
  cors = require("cors");


var fs = require('fs')
var path = require('path');

app.use(cors());
app.listen(port, () => console.log("Backend server live on " + port));
app.use(express.json());

app.get("/", (req, res) => {
  res.send({message: "Server page"});
});

// if we receive a post request to main url to save json to local system
app.post("/", (req, res) => {
  // console.log(req.body);

  // console.log(`${__dirname}`);
  // var f = new File(`${__dirname}` + req.body.file);


  
  try {
    let jsonPath = path.join(__dirname, 'files', 'interventions', req.body.folder, req.body.file);
 
    fs.writeFileSync(jsonPath, JSON.stringify(req.body.json), {encoding:'utf8',flag:'w'});
    res.send( {success: true} );
    // file written successfully
  } catch (err) {
    console.error(err);
  }
});


// get request to get all folders from interventions folder
app.get("/interventions", (req, res) => {
  try {
    let intervPath = path.join(__dirname, 'files', 'interventions');
    const getDirectories = source =>
      fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    const folders = getDirectories(intervPath);
    res.send( {success: true, result: JSON.stringify(folders)} );
    // file written successfully
  } catch (err) {
    console.error(err);
  }
});

// post request to make new file and put into order.json of right intervention folder.
app.post("/new", (req, res) => {

  const selectText = "Select image...";
  const emptyEntry = [{
      image: selectText,
      text: "",
    }];

  try {
    
    //insert file into folder
    let jsonPath = path.join(__dirname, 'files', 'interventions', req.body.folder, req.body.file);
    fs.writeFileSync(jsonPath, JSON.stringify(emptyEntry), {encoding:'utf8',flag:'w'});

    //insert into order.json
    let orderFile = path.join(__dirname, 'files', 'interventions', req.body.folder, "order.json");
    let index = req.body.index;

    let rawdata = fs.readFileSync(orderFile);
    let orderJson = JSON.parse(rawdata);
    orderJson.splice(index, 0, req.body.file);
    fs.writeFileSync(orderFile, JSON.stringify(orderJson), {encoding:'utf8',flag:'w'});

    res.send( {success: true} );

  } catch (err) {
    console.error(err);
  }
});

// deleting a session
app.post("/deleteSession", (req, res) => {

  try {
    let folder = req.body.folder;
    let file = req.body.file;
    let jsonPath = path.join(__dirname, 'files', 'interventions', folder, file);
    fs.unlinkSync(jsonPath);

    let orderFile = path.join(__dirname, 'files', 'interventions', folder, "order.json");

    let rawdata = fs.readFileSync(orderFile);
    let orderJson = JSON.parse(rawdata);
    orderJson = orderJson.filter(data => data != file);
    fs.writeFileSync(orderFile, JSON.stringify(orderJson), {encoding:'utf8',flag:'w'});

    res.send( {success: true} );
  } catch (err) {
    console.error(err);
  }
});

// adding intervention
app.post("/intervention", (req, res) => {

  try {
    let folder = req.body.folder;
    let jsonPath = path.join(__dirname, 'files', 'interventions', folder);

    fs.mkdir(jsonPath, (err) => {
      if (err) {
          return console.error(err);
      }
      console.log('Directory created successfully!');
    });

    let orderFile = path.join(__dirname, 'files', 'interventions', folder, "order.json");

    fs.writeFileSync(orderFile, "[]", {encoding:'utf8',flag:'w'});

    res.send( {success: true} );
  } catch (err) {
    console.error(err);
  }
});

// deleting intervention
app.post("/deleteIntervention", (req, res) => {

  try {
    let folder = req.body.folder;
    let jsonPath = path.join(__dirname, 'files', 'interventions', folder);

    fs.rmSync(jsonPath, { recursive: true, force: true });

    res.send( {success: true} );
  } catch (err) {
    console.error(err);
  }
});

// post request to upload image. not working as of now.
app.post("/image", (req, res) => {

  try {

    res.send( {success: true} );
    // file written successfully
  } catch (err) {
    console.error(err);
  }
});