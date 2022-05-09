import React, {useEffect, useState, useRef} from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
  Chip,
  Grid,
} from "@mui/material";
import { makeStyles } from "@mui/styles";


const useStyle = makeStyles((theme) => ({
  center: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
  },
  video: {
    flexGrow: 1,
    borderRadius: "2rem",
    color: "white",
    backgroundColor: "black",
    webkitTransform: `scaleX(-1)`,
    transform: `scaleX(-1)`,
  },
  liveIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1rem",
    zIndex: 10,
  },
}));


const SceneCreator = (props) => {
  const classes = useStyle();
  const [count, setCount] = useState(-1);
  const tick = () => setCount(count - 1);
  const canvasRef = useRef(null);
  let title = "SCENE CREATOR"
  let canvas, ctx;
 

  useEffect(() => {
    console.log("LOADING")
    canvas = canvasRef.current;
    ctx = canvasRef.current.getContext("2d");
    setBG("bg2.png")
  }, []); //gets triggered once

  let scenes = [
    {
      title: "Scene 1",
      text: "This is the first scene. Observe!",
      sprite: "raccoon.png",
      spritePosX: 100,
      spritePosY: 100,
      bg: "bg2.png",
      audio: "path",
    },
    {
      title: "Scene 2",
      text: "This is the second scene. Observe!",
      sprite: "greenMan.png",
      spritePositionX: 100,
      spritePositionY: 100,
      bg: "bg2.png",
      audio: "path",
    },
  ];

  
  
  let sceneNum = 0;

  //let ctx = canvas.getContext("2d");
  //let title = document.getElementById("sceneTitle");
  //let sceneText = document.getElementById("sceneText");
  
  function nextScene() {
    let currScene = scenes[sceneNum];
    loadScene(currScene);
    sceneNum++;
  }
  
  function prevScene() {
    let currScene = scenes[--sceneNum];
    loadScene(currScene);
  }
  
  let spritePath = "./img/sprite/";
  function drawSprite(sprite, posX, posY) {
    let spriteImg = new Image();
    spriteImg.src = spritePath + sprite;
    console.log(spriteImg);
    if (spriteImg.complete) {
      ctx.drawImage(spriteImg, posX, posY);
    } else {
      spriteImg.onload = function () {
        ctx.drawImage(spriteImg, posX, posY);
      };
    }
  }
  
  function loadScene(scene) {
    console.log("loaddd");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //title.textContent = scene.title;
    //sceneText.textContent = scene.text;
    drawSprite(scene.sprite, scene.spritePosX, scene.spritePosY);
    setBG(scene.bg);
  }
  
  let bgPath = "../assets/img/bg/";
  function setBG(bgName) {
    console.log("HERE")
    let bg = bgPath + bgName;
    canvas.style.background = "url(" + bg + ")";
    canvas.style.backgroundSize = "100% 100%";
  }


  const renderScene = () => {
    return (
      <Box p={2}>
        <Typography variant="h4">
          {title}
        </Typography>
        <canvas
          ref={canvasRef}
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            width: 800,
            height: 500,
          }}
        />
        <Button onClick={() => nextScene()}>NEXT BUTTON</Button>
        <Button onClick={() => prevScene()}>PREV BUTTON</Button>
      </Box>
    );
  };

  return (
    <>
      {renderScene()}
    </>
  );
};

export default SceneCreator;
