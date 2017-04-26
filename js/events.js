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
    if(audiofile) playSound(audiofile);
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

  // KONAMI: UP|UP|DOWN|DOWN|LEFT|RIGHT|LEFT|RIGHT
  const inputKonami = [38, 38, 40, 40, 37, 39, 37, 39];
  // NYANCAT: N|Y|A|N|C|A|T
  const inputNyanCat = [78,89,65,78,67,65,84];
  // Hell: S|I|X|S|I|X|S|I|X
  const inputHell = [83,73,88,83,73,88,83,73,88];

  let inputs = [];
  document.addEventListener("keydown", function(e) {
    if(e.keyCode===inputKonami[inputs[0]++]) {
      if(inputs[0]===inputKonami.length) {
        inputs[0] = 0;
        if(KONAMI) {
          KONAMI = false;
          document.body.classList.remove("KONAMI");
          playSound("konami_off");
        } else {
          KONAMI = true;
          document.body.classList.add("KONAMI");
          playSound("konami_on");
        }
      }
    } else {
      inputs[0] = 0;
    }
    if(e.keyCode===inputNyanCat[inputs[1]++]) {
      if(inputs[1]===inputNyanCat.length) {
        inputs[1] = 0;
        playGameTransition("nyancat", null, function(){});
      }
    } else {
      inputs[1] = 0;
    }
    if(e.keyCode===inputHell[inputs[2]++]) {
      if(inputs[2]===inputHell.length) {
        inputs[2] = 0;
        if(HELL) {
          HELL = false;
          document.body.classList.remove("HELL");
          playSound("hell_off");
        } else {
          HELL = true;
          document.body.classList.add("HELL");
          playSound("hell_on");
        }
      }
    } else {
      inputs[2] = 0;
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
