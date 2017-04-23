"use strict"

const playSound = function(file)
{
  if(localStorage.getItem("sound")==="on") {
    const audio = new Audio("media/sound/"+file+".wav");
    audio.play();
  }
}
const playVideo = function(file, func)
{
	if(localStorage.getItem("video")==="on") {
  const video = document.createElement("video");
  video.setAttribute("src", "media/video/"+file+".mp4");
  document.body.appendChild(video);
  video.play();
  video.onended = function()
  {
    document.body.removeChild(video);
	console.log(func);
  };
	} else {
		//func():
	}
}
const stopIntro = function()
{
	document.getElementById("INTRO").muted = true;
}

const readyEvents = function()
{
  //NAVIGATION
  const asideButtons = document.getElementsByClassName("ASIDEPAGE");
  for(let i=0; i<asideButtons.length; i++) {
    asideButtons.item(i).addEventListener("click", function(e)
        {
          playSound("morse");
          if(e.target.id==="STATS") loadStats();
          if(e.target.id==="OPTIONS") initOptions();
          let offset = document.getElementById(e.target.id+"PAGE").offsetTop;
          offset = 100*parseInt(Math.round(offset/window.innerHeight));
          document.getElementById("container").style["top"] = (-offset)+"vh";
        });
  }
  const menuButtons = document.getElementsByClassName("MENU");
  for(let i=0; i<menuButtons.length; i++) {
    menuButtons.item(i).addEventListener("click", function(e)
        {
          playSound("morse");
          document.getElementById("container").style["top"] = "0vh";
        });
  }

  //OPTIONS
  const optionButtons = document.getElementsByTagName("svg");
  for(let i=0; i<optionButtons.length; i++) {
    optionButtons.item(i).addEventListener("click", function(e)
        {
          let elem = e.target;
          while(!elem.classList.contains("OPTIONKEY")) elem = elem.parentNode;
          toggleOption(elem);
        });
  }
  const infoButtons = document.getElementsByTagName("sub");
  for(let i=0; i<infoButtons.length; i++) {
    infoButtons.item(i).addEventListener("click", function(e)
        {
          playSound("bubble");
          const id = e.target.parentNode.getElementsByTagName("span")[0].id;
          document.getElementById("info"+id).style["display"] = "block";
        });
  }
  const infoPages = document.getElementsByClassName("info");
  for(let i=0; i<infoPages.length; i++) {
    infoPages.item(i).addEventListener("click", function(e)
        {
          playSound("pop");
          let elem = e.target;
          while(!elem.classList.contains("info")) elem = elem.parentNode;
          elem.style["display"] = "none";
        });
  }
  document.getElementById("PLAYPRACTICE").addEventListener("click", function()
      {
		stopIntro();
        playSound("practice");
        playVideo("start", function()
		{
			gamePractice();
		});
      });
  const soloButtons = document.getElementsByClassName("PLAYSOLO");
  for(let soloButton of soloButtons) {
	  soloButton.addEventListener("click", function(e)
      {
		stopIntro();
        playSound("solo");
        playVideo("start", function()
		{
			gameSolo(e.target.name);
		});
      });
  }
  document.getElementById("PLAYMULTI").addEventListener("click", function()
      {
		stopIntro();
        playSound("multi");
        playVideo("start", function()
		{
			gameMulti();
		});
      });

  //INIT
  initOptions();
  initStats();

  //Haut, haut, bas, bas, gauche, droite, gauche, droite, B, A
  let k = [38, 38, 40, 40, 37, 39, 37, 39];
  let n = 0;
  document.addEventListener("keydown", function(e) {
    if(e.keyCode===k[n++]) {
      if(n===k.length) {
        KONAMI = !KONAMI;
        document.body.classList.toggle("KONAMI");
        n = 0;
        return false;
      }
    } else {
      n = 0;
    }
  });
  
  const musics = document.getElementsByClassName("MUSIC");
  for(let music of musics) {
	music.muted = true;
  }
  if(localStorage.getItem("music")==="on") {
	document.getElementById("INTRO").muted = false;
  }
}
document.addEventListener("DOMContentLoaded", readyEvents);
