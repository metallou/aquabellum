"use strict"

const toggleOption = function(option)
{
  const id = option.getElementsByTagName("span")[0].id;
  option.classList.toggle("optionselected");
  if(option.classList.contains("optionselected")) {
    localStorage.setItem(id, "on");
    if(id==="music" || id==="sound") {
      const sounds = document.getElementsByClassName(id.toUpperCase());
      for(let i=0; i<sounds.length; i++) {
        sounds[i].muted = false;
      }
    }
  } else {
    localStorage.setItem(id, "off");
    if(id==="music" || id==="sound") {
      const sounds = document.getElementsByClassName(id.toUpperCase());
      for(let i=0; i<sounds.length; i++) {
        sounds[i].muted = true;
      }
    }
  }
}

const resetOptions = function()
{
  const page = document.getElementById("OPTIONSPAGE");
  const keys = page.getElementsByTagName("span");
  for(let i=0; i<keys.length; i++) {
    if(keys.item(i).classList.contains("KOO")) {
      localStorage.setItem(keys.item(i).id, "on");
    }
  }
  localStorage.setItem("music", "off");
  localStorage.setItem("sound", "off");
}
const resetStats = function()
{
  const page = document.getElementById("OPTIONSPAGE");
  const keys = page.getElementsByTagName("span");
  for(let i=0; i<keys.length; i++) {
    if(!keys.item(i).classList.contains("KOO")) {
      localStorage.setItem(keys.item(i).id, "0");
    }
  }
}

const initOptions = function()
{
  const page = document.getElementById("OPTIONSPAGE");
  const keys = page.getElementsByTagName("span");
  let str;
  if(localStorage.length!=keys.length) {
    console.info("not same items in local storage: reset all");
    localStorage.clear();
    resetOptions();
    resetStats();
  }
  for(let i=0; i<keys.length; i++) {
    str = localStorage.getItem(keys.item(i).id);
    if(keys.item(i).classList.contains("KOO")) {
      if(str!="on" && str!="off") {
        console.info("not valid options: reset options");
        resetOptions();
      }
    } else {
      if(str===null || str===undefined || isNaN(str) || str<0) {
        console.info("not valid stats: reset stats");
        resetStats();
      }
    }
  }

  for(let i=0; i<keys.length; i++) {
    str = localStorage.getItem(keys.item(i).id);
    if(keys.item(i).classList.contains("KOO")) {
      if(str==="on") {
        keys.item(i).parentNode.classList.add("optionselected");
      }
      if(keys.item(i).id==="music" || keys.item(i).id==="sound") {
        const sounds = document.getElementsByClassName(keys.item(i).id.toUpperCase());
        for(let j=0; j<sounds.length; j++) {
          sounds[j].muted = str!="on";
        }
      }
    }
  }
}
