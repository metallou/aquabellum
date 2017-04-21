"use strict"

const initStats = function()
{
  const page = document.getElementById("STATSPAGE");
  const containers = page.getElementsByClassName("statscontainer");
  const inners = page.getElementsByClassName("statsinner");
  const tables = page.getElementsByTagName("table");
  const theads = page.getElementsByTagName("thead");
  const tbodys = page.getElementsByTagName("tbody");
  let trs;
  let key;
  let value;
  let button;
  let tfoot;
  let tr;
  let td;
  let th;

  //Write page number in tfoot
  //Create navigation buttons
  for(let i=0; i<tables.length; i++) {
    tfoot = document.createElement("tfoot");
    tables[i].appendChild(tfoot);
    tr = document.createElement("tr");
    tfoot.appendChild(tr);

    th = document.createElement("th");
    tr.appendChild(th);
    button = document.createElement("button");
    th.appendChild(button);
    button.classList.add("PREV");
    if(i==0) button.classList.add("hidden");
    button.textContent = "Prev";
    button.addEventListener("click", function()
        {
          playSound("page");
          newStatsPage(false);
        });

    th = document.createElement("th");
    tr.appendChild(th);
    th.textContent = (i+1)+"/"+tables.length;

    th = document.createElement("th");
    tr.appendChild(th);
    button = document.createElement("button");
    th.appendChild(button);
    button.classList.add("NEXT");
    if(i==(containers.length-1)) button.classList.add("hidden");
    button.textContent = "Next";
    button.addEventListener("click", function()
        {
          playSound("page");
          newStatsPage(true);
        });
  }
  //set colspan
  //Create td for value
  for(let i=0; i<tbodys.length; i++) {
    trs = tbodys[i].getElementsByTagName("tr");
    for(let j=0; j<trs.length; j++) {
      trs[j].children[0].setAttribute("colspan", "2");

      td = document.createElement("td");
      trs[j].appendChild(td);
    }
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
