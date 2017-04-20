"use strict"

const initStats = function()
{
  const page = document.getElementById("STATSPAGE");
  const containers = page.getElementsByClassName("statscontainer");
  const inners = page.getElementsByClassName("statsinner");
  const bodys = page.getElementsByTagName("tbody");
  const foots = page.getElementsByTagName("tfoot");
  let trs;
  let key;
  let value;
  //Write page number in tfoot
  for(let i=0; i<foots.length; i++) {
    trs = foots[i].getElementsByTagName("tr");
    value = (i+1)+"/"+foots.length;
    trs[0].children[1].textContent = value;
  }
  //Create buttons
  let div;
  let button;
  for(let i=0; i<containers.length; i++) {
    div = document.createElement("div");
    inners[i].appendChild(div);
    div.classList.add("statsbuttons");
    button = document.createElement("button");
    div.appendChild(button);
    button.classList.add("PREV");
    button.textContent = "PREV";
    button.addEventListener("click", function(){newStatsPage(false)});
    button = document.createElement("button");
    div.appendChild(button);
    button.classList.add("NEXT");
    button.textContent = "NEXT";
    button.addEventListener("click", function(){newStatsPage(true)});
  }
  //Set table display
  for(let i=0; i<containers.length; i++) {
    containers[i].style["display"] = "none";
  }
}
const loadStats = function()
{
  const page = document.getElementById("STATSPAGE");
  const containers = page.getElementsByClassName("statscontainer");
  const inners = page.getElementsByClassName("statsinner");
  const bodys = page.getElementsByTagName("tbody");
  const foots = page.getElementsByTagName("tfoot");
  let trs;
  let key;
  let value;
  //Write localtorage data into table
  for(let i=0; i<bodys.length; i++) {
    trs = bodys[i].getElementsByTagName("tr");
    for(let j=0; j<trs.length; j++) {
      key = trs[j].children[0].textContent;
      key = key.toLowerCase();
      key = key.split("\n").join("");
      key = key.split(":").join("");
      key = key.split(" ").join("");
      value = localStorage.getItem(key);
      trs[j].children[1].textContent = value || "null";
    }
  }
  //Set table display
  for(let i=0; i<containers.length; i++) {
    containers[i].style["display"] = "none";
  }
  containers[0].style["display"] = "";
}

//Get the one table being displayed
const displayedElementIndex = function(array)
{
  for(let i=0; i<array.length; i++) {
    if(array[i].style["display"] != "none") return i;
  }
}
const newStatsPage = function(next)
{
  const page = document.getElementById("STATSPAGE");
  const pages = page.getElementsByClassName("statscontainer");
  const num = displayedElementIndex(pages);
  const curPage = pages[num];
  const prevs = document.getElementsByClassName("PREV");
  const nexts = document.getElementsByClassName("NEXT");
  let newPage;
  if(next) {
    newPage = pages[num+1];
  } else {
    newPage = pages[num-1];
  }
  //Hide current table
  //Display new table
  if(newPage!=null && newPage!=undefined) {
    curPage.style["display"] = "none";
    newPage.style["display"] = "";
  }
}
