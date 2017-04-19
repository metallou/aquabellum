"use strict"

const loadStats = function()
{
  const page = document.getElementById("STATSPAGE");
  const tables = page.getElementsByTagName("table");
  const theads = page.getElementsByTagName("thead");
  const tbodys = page.getElementsByTagName("tbody");
  let trs;
  let key;
  let value;
  //Write page number in second th
  for(let i=0; i<theads.length; i++) {
    trs = theads[i].getElementsByTagName("tr")[0];
    trs.children[1].textContent = (i+1)+"/"+tables.length;
  }
  //Gather localStorage stats
  for(let i=0; i<tbodys.length; i++) {
    trs = tbodys[i].getElementsByTagName("tr");
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
  for(let i=1; i<tables.length; i++) {
    tables[i].style["display"] = "none";
  }
  tables[0].style["display"] = "";
  //Set button display
  document.getElementById("PREV").style["display"] = "none";
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
  const pages = page.getElementsByTagName("table");
  const num = displayedElementIndex(pages);
  const curPage = pages[num];
  let newPage;
  let otherPage;
  if(next) {
    newPage = pages[num+1];
    otherPage = pages[num+2];
  } else {
    newPage = pages[num-1];
    otherPage = pages[num-2];
  }
  //Hide current table
  //Display new table
  if(newPage!=null && newPage!=undefined) {
    curPage.style["display"] = "none";
    newPage.style["display"] = "";
    if(otherPage===null || otherPage===undefined) {
      //Hide button
      if(next) {
        document.getElementById("NEXT").style["display"] = "none";
      } else {
        document.getElementById("PREV").style["display"] = "none";
      }
    }
  }
  //Display button
  if(next) {
    document.getElementById("PREV").style["display"] = "";
  } else {
    document.getElementById("NEXT").style["display"] = "";
  }
}
