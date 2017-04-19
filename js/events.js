"use strict"

const readyEvents = function()
{
  const menuButtons = document.getElementsByClassName("MENU");
  for(let i=0; i<menuButtons.length; i++) {
    menuButtons.item(i).addEventListener("click", function(e)
        {
          document.getElementById("container").style["top"] = "0vh";
        });
  }

  //OPTIONS
  document.getElementById("OPTIONS").addEventListener("click", function(e)
      {
        document.getElementById("container").style["top"] = "-100vh";
      });
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
          const id = e.target.parentNode.getElementsByTagName("span")[0].id;
          document.getElementById("info"+id).style["display"] = "block";
        });
  }
  const infoPages = document.getElementsByClassName("info");
  for(let i=0; i<infoPages.length; i++) {
    infoPages.item(i).addEventListener("click", function(e)
        {
          let elem = e.target;
          while(!elem.classList.contains("info")) elem = elem.parentNode;
          elem.style["display"] = "none";
        });
  }

  //STATS
  document.getElementById("STATS").addEventListener("click", function(e)
      {
        document.getElementById("container").style["top"] = "-200vh";
        loadStats()
      });
  document.getElementById("NEXT").addEventListener("click", function(e)
      {
        newStatsPage(true);
      });
  document.getElementById("PREV").addEventListener("click", function(e)
      {
        newStatsPage(false);
      });

  //CREDITS
  document.getElementById("CREDITS").addEventListener("click", function(e)
      {
        document.getElementById("container").style["top"] = "-300vh";
      });

}
document.addEventListener("DOMContentLoaded", readyEvents);
