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

// if we receive a post request, we will save this to our local system.
app.post("/", (req, res) => {
  console.log(req.body);

  console.log(`${__dirname}`);
  // var f = new File(`${__dirname}` + req.body.file);


  let jsonPath = path.join(__dirname, 'files', 'jsons', req.body.file);
 
  try {

    fs.writeFileSync(jsonPath, JSON.stringify(req.body.json), {encoding:'utf8',flag:'w'});
    res.send( {success: true} );
    // file written successfully
  } catch (err) {
    console.error(err);
  }
});