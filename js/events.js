"use strict"

const playSound = function(file)
{
  if(localStorage.getItem("sound")==="on") {
    const audio = new Audio("media/sound/"+file+".wav");
    audio.play();
  }
}
const playGameTransition = function(videofile, audiofile, func)
{
  if(localStorage.getItem("transition")==="on") {
    playSound(audiofile);
    const video = document.createElement("video");
    video.setAttribute("src", "media/video/"+videofile+".mp4");
    document.body.appendChild(video);
    video.play();
    setTimeout(func, 1000);
    video.onended = function()
    {
      document.body.removeChild(video);
    };
  } else {
    func();
  }
}
const playPageTransition = function(audiofile, func)
{
  playSound(audiofile);
  if(localStorage.getItem("transition")==="on") {
    const transition1 = document.getElementById("transition1");
    transition1.classList.add("transition11");
    setTimeout(function()
        {
          transition1.classList.add("transition12");
        }, 100);
    transition1.addEventListener("transitionend", function(e)
        {
          func();
          transition1.classList.remove("transition1");
          const transition2 = document.getElementById("transition2");
          transition2.classList.add("transition21");
          setTimeout(function()
              {
                transition2.classList.add("transition22");
                transition1.classList.remove("transition11");
                transition1.classList.remove("transition12");
              }, 100);
          transition2.addEventListener("transitionend", function(e)
              {
                transition2.classList.remove("transition21");
                transition2.classList.remove("transition22");
              });
        });
  } else {
    func();
  }
}
const stopIntro = function()
{
  document.getElementById("INTRO").muted = true;
}
const playIntro = function()
{
  document.getElementById("INTRO").muted = false;
}

const readyEvents = function()
{
  //NAVIGATION
  const asideButtons = document.getElementsByClassName("ASIDEPAGE");
  for(let i=0; i<asideButtons.length; i++) {
    asideButtons.item(i).addEventListener("click", function(e)
        {
          playPageTransition("morse", function()
              {
                if(e.target.id==="STATS") loadStats();
                if(e.target.id==="OPTIONS") initOptions();
                let offset = document.getElementById(e.target.id+"PAGE").offsetTop;
                offset = 100*parseInt(Math.round(offset/window.innerHeight));
                document.getElementById("container").style["top"] = (-offset)+"vh";
              });
        });
  }
  const menuButtons = document.getElementsByClassName("MENU");
  for(let i=0; i<menuButtons.length; i++) {
    menuButtons.item(i).addEventListener("click", function(e)
        {
          playPageTransition("morse", function()
              {
                document.getElementById("container").style["top"] = "0vh";
              });
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
        playGameTransition("start", "practice", function()
            {
              document.getElementById("gamewrapper").style["display"] = "";
              document.getElementById("wrapper").style["display"] = "none";
              GAME.practice();
            });
      });
  const soloButtons = document.getElementsByClassName("PLAYSOLO");
  for(let soloButton of soloButtons) {
    soloButton.addEventListener("click", function(e)
        {
          stopIntro();
          playGameTransition("start", "solo", function()
              {
                document.getElementById("gamewrapper").style["display"] = "";
                document.getElementById("wrapper").style["display"] = "none";
                GAME.solo(e.target.name);
              });
        });
  }
  document.getElementById("PLAYMULTI").addEventListener("click", function()
      {
        stopIntro();
        playGameTransition("start", "multi", function()
            {
              document.getElementById("gamewrapper").style["display"] = "";
              document.getElementById("wrapper").style["display"] = "none";
              GAME.solo();
            });
      });

  //INIT
  initOptions();
  initStats();

  ////UP, UP, DOWN, DOWN, LEFT, RIGHT, LEFT, RIGHT
  let k = [38, 38, 40, 40, 37, 39, 37, 39];
  let n = 0;
  document.addEventListener("keydown", function(e) {
    if(e.keyCode===k[n++]) {
      if(n===k.length) {
        n = 0;
        if(KONAMI) {
          KONAMI = false;
          document.body.classList.remove("KONAMI");
          playSound("konami_off");
        } else {
          KONAMI = true;
          document.body.classList.add("KONAMI");
          playSound("konami_on");
        }
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
