import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
import { getDatabase, ref, set, child, update, remove, onValue, get } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMwzug_6RzdZ3UVvEjtbDGedpgEHFeN4A",
  authDomain: "bug-tracka.firebaseapp.com",
  databaseURL: "https://bug-tracka-default-rtdb.firebaseio.com",
  projectId: "bug-tracka",
  storageBucket: "bug-tracka.appspot.com",
  messagingSenderId: "64400813098",
  appId: "1:64400813098:web:2f7bb7f5799ec3aaa82753",
  measurementId: "G-JZB8HD7HPG"
};

// Initialize Firebase
console.log('initializing firebase');
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const dbRef = getDatabase();

//---------------------------------------------------TICKET SYSTEM----------------------------------------------------------------
//Ticket Table Printing Function
async function ticketListStartUp(){
  console.log("Building tickets...")

  for (var i = tixArray.length-1; i>=0; i--){

    let printDev = "";
    let printStatus = "";
    let printPriority = "";
    if(tixArray[i].dev == 'tbd'){
      printDev = `<a id="a view tag" href="#" data-toggle="modal" data-target="#assignDevModal" style="text-decoration: none;"> <button id="assignDevBtnT${i}" style="background-color: #1F9EAE; border: none; color:white; border-radius:3px; text-align:center;">Assign Dev</button> </a>`;
    }
    else{
      printDev = `<button disabled id="assignDevBtnT${i}" style="background-color: #00000000; border: solid; border-color: #6A11CB; color:#6A11CB; border-radius:3px; text-align:center; border-width: 1px;">${tixArray[i].dev}</button>`;
    }
    if (tixArray[i].status == 'new'){
      printStatus = `<button disabled style="background-color: #00000000; border: solid; border-color: #e74a3b; color:#e74a3b; border-radius:3px; text-align:center; border-width: 1px;">New</button>`;
    }
    else{
      printStatus = `<button disabled style="background-color: #00000000; border: solid; border-color: #1cc88a; color:#1cc88a; border-radius:3px; text-align:center; border-width: 1px;">Done</button>`;
    }
    if (tixArray[i].priority == 'high'){
      printPriority = `<button disabled style="background-color: #00000000; border: solid; border-color: #e74a3b; color:#e74a3b; border-radius:3px; text-align:center; border-width: 1px;">High</button>`;
    }
    else if(tixArray[i].priority == 'mid'){
      printPriority = `<button disabled style="background-color: #00000000; border: solid; border-color: #f6c23e; color:#f6c23e; border-radius:3px; text-align:center; border-width: 1px;">Mid</button>`;
    }
    else{
      printPriority = `<button disabled style="background-color: #00000000; border: solid; border-color: #1cc88a; color:#1cc88a; border-radius:3px; text-align:center; border-width: 1px;">Low</button>`;
    }
    let template = `
      <tr id="T${i}">
        <td><p id="tixTitleT0" style="margin: 0; font-weight: bold; color: #35393F">${tixArray[i].title}</p></td>
        <td id="assign${i}">${printDev}</td>
        <td>${printStatus}</td>
        <td>${printPriority}</td>
        <td><button disabled id="tixDateT0" style="font-size: 12px; background-color: #00000000; border: solid; border-color: #858585; color:#858585; border-radius:3px; text-align:center; border-width: 1px;">${tixArray[i].date}</button></td>
        <td class="text-center"><a id="a view tag" href="#" data-toggle="modal" data-target="#ticketDescModal" style="margin-left: 2px; margin-right: 2px; text-decoration: none;"><button id="viewTicketBtnT${i}" style="font-size: 12px; background-color: #00000000; border: solid; border-color: #1F9EAE; color:#1F9EAE; border-radius:3px; text-align:center; border-width: 1px;"><i class="fas fa-eye" style="color: #1F9EAE;"></i></button></a><a id="a edit tag" href="#" data-toggle="modal" data-target="#ticketEditModal" style="margin-left: 2px; margin-right: 2px; text-decoration: none;"><button id="editTicketBtnT${i}" style="font-size: 12px; background-color: #00000000; border: solid; border-color: #858585; color:#858585; border-radius:3px; text-align:center; border-width: 1px;"><i class="fas fa-pen" style="color: #858585;"></i></button></a><button id="deleteTicketT${i}" style="margin-left: 2px; margin-right: 2px; font-size: 12px; background-color: #00000000; border: solid; border-color: #E74A3B; color:#858585; border-radius:3px; text-align:center; border-width: 1px;"><i class="fas fa-trash" style="color: #E74A3B;"></i></button></td>
      </tr>`
    ticketTable.innerHTML += template;
  }
}
var projectSelection = document.getElementById('projectSelectAdd');

function buildSelectProjectAdd(){
  console.log("Building tickets...")

  for (var i = 0; i<projArray.length; i++){

    let template = `
    <option>${projArray[i].title}</option>`
      projectSelection.innerHTML += template;
  }

}

$("#addTicketForm").submit(function(e) {
  e.preventDefault();
  var addedTitle = document.getElementById('titleAdd').value;
  var addedDesc = document.getElementById('descAdd').value;
  var addedStatus = document.getElementById('statusAdd').value.toLowerCase();
  var addedPriority = document.getElementById('priorityAdd').value.toLowerCase();
  var selectedProjTitle = document.getElementById('projectSelectAdd').value;
  var selectedProjId = 0;
  for(let i=0;i<projArray.length;i++){
    if(projArray[i].title == selectedProjTitle){
      selectedProjId = projArray[i].id;
    }
  }
  var newTicketID = Date.now();

  addTicket(addedTitle, addedDesc, addedStatus, addedPriority, selectedProjId, newTicketID);
});
function addTicket(ticketTitle, ticketDesc, ticketStatus, ticketPriority, projId, ticketID) {
  if(ticketDesc == "" || ticketTitle == ""){
    alert("Incomplete data, ticket was not added");
    return 0;
  }
  var currentdate = new Date();
  var datetime =currentdate.getFullYear() + "-" + currentdate.getMonth() 
  + "-" + currentdate.getDay() + " @ " 
  + currentdate.getHours() + ":" 
  + currentdate.getMinutes() + ":" + currentdate.getSeconds();
  set(ref(dbRef, 'tickets/T' + ticketID), {
      date: datetime,
      desc: ticketDesc,
      dev : "tbd",
      priority : ticketPriority,
      status : ticketStatus,
      title : ticketTitle,
      id : ticketID.toString(),
      pid : projId.toString()
  });
}

function editTixBtnSetup(){
  //Edit Ticket Functionality
  console.log("Setting up ticket edit buttons...");
  for (var i = 0; i<tixArray.length; i++){
    let ticketDescIndex = i;
    document.getElementById('editTicketBtnT' + i).addEventListener("click", getEditTicketIndex);
  };
  function getEditTicketIndex(){ //transfering desc value to modal body paragraph 
    editTicketIndex = event.target.parentElement.id;
    editTicketIndex = editTicketIndex.slice(14,15)
  };

  $("#editTicketForm").submit(function(e) {
    //e.preventDefault();
    var edittedTixTitle = document.getElementById('tixTitleEdit').value;
    var edittedTixDesc = document.getElementById('tixDescEdit').value;
    var edittedTixStatus = document.getElementById('tixStatusEdit').value.toLowerCase();
    var edittedTixPriority = document.getElementById('tixPriorityEdit').value.toLowerCase();
    var edittedTixDate = document.getElementById('tixDateEdit').value;
    editTicket(edittedTixTitle, edittedTixDesc, edittedTixStatus, edittedTixPriority, edittedTixDate)
  });
}
async function editTicket(ticketTitle, ticketDesc, ticketStatus, ticketPriority, ticketDate) {
  async function getEditTixDev(key){
    const snapshot = await get(ref(dbRef, 'tickets/' + editTicketIndex + key));
    var data = snapshot.val();
    let value = data;
    return value;
  }
  let ticketDevOG = tixArray[editTicketIndex].dev;
  let ticketTitleOG = tixArray[editTicketIndex].title;
  let ticketDescOG = tixArray[editTicketIndex].desc;
  let ticketDateOG = tixArray[editTicketIndex].date;
  let ticketID = tixArray[editTicketIndex].id;
  let ticketPID = tixArray[editTicketIndex].pid;
  if(ticketTitle == "" && ticketDesc == "" && ticketDate == ""){
    console.log("0 0 0");
    set(ref(dbRef, 'tickets/T' + tixArray[editTicketIndex].id), {
      date: ticketDateOG,
      desc: ticketDescOG,
      dev : ticketDevOG,
      priority : ticketPriority,
      status : ticketStatus,
      title : ticketTitleOG,
      id : ticketID,
      pid : ticketPID
    });
  }
  else if(ticketTitle == "" && ticketDesc == "" && ticketDate != ""){
    console.log("0 0 1");
    set(ref(dbRef, 'tickets/T' + tixArray[editTicketIndex].id), {
      date: ticketDate,
      desc: ticketDescOG,
      dev : ticketDevOG,
      priority : ticketPriority,
      status : ticketStatus,
      title : ticketTitleOG,
      id : ticketID,
      pid : ticketPID
    });
  }
  else if(ticketTitle == "" && ticketDesc != "" && ticketDate == ""){
    console.log("0 1 0");
    set(ref(dbRef, 'tickets/T' + tixArray[editTicketIndex].id), {
      date: ticketDateOG,
      desc: ticketDesc,
      dev : ticketDevOG,
      priority : ticketPriority,
      status : ticketStatus,
      title : ticketTitleOG,
      id : ticketID,
      pid : ticketPID
    });
  }
  else if(ticketTitle == "" && ticketDesc != "" && ticketDate != ""){
    console.log("0 1 1");
    set(ref(dbRef, 'tickets/T' + tixArray[editTicketIndex].id), {
      date: ticketDate,
      desc: ticketDesc,
      dev : ticketDevOG,
      priority : ticketPriority,
      status : ticketStatus,
      title : ticketTitleOG,
      id : ticketID,
      pid : ticketPID
    });
  }
  else if(ticketTitle != "" && ticketDesc == "" && ticketDate == ""){
    console.log("1 0 0");
    set(ref(dbRef, 'tickets/T' + tixArray[editTicketIndex].id), {
      date: ticketDateOG,
      desc: ticketDescOG,
      dev : ticketDevOG,
      priority : ticketPriority,
      status : ticketStatus,
      title : ticketTitle,
      id : ticketID,
      pid : ticketPID
    });
  }
  else if(ticketTitle != "" && ticketDesc == "" && ticketDate != ""){
    console.log("1 0 1");
    set(ref(dbRef, 'tickets/T' + tixArray[editTicketIndex].id), {
      date: ticketDate,
      desc: ticketDescOG,
      dev : ticketDevOG,
      priority : ticketPriority,
      status : ticketStatus,
      title : ticketTitle,
      id : ticketID,
      pid : ticketPID
    });
  }
  else if(ticketTitle != "" && ticketDesc != "" && ticketDate == ""){
    console.log("1 1 0");
    set(ref(dbRef, 'tickets/T' + tixArray[editTicketIndex].id), {
      date: ticketDateOG,
      desc: ticketDesc,
      dev : ticketDevOG,
      priority : ticketPriority,
      status : ticketStatus,
      title : ticketTitle,
      id : ticketID,
      pid : ticketPID
    });
  }
  else{
    console.log("1 1 1");
    set(ref(dbRef, 'tickets/T' + tixArray[editTicketIndex].id), {
      date: ticketDate,
      desc: ticketDesc,
      dev : ticketDevOG,
      priority : ticketPriority,
      status : ticketStatus,
      title : ticketTitle,
      id : ticketID,
      pid : ticketPID
    });
  }
}

//Ticket View Desc Button Functionality
async function viewTixBtnSetup(){
  console.log("View ticket description buttons setup...")
  for (var i = 0; i<tixArray.length; i++){
    let ticketDescIndex = i;
    document.getElementById('viewTicketBtnT' + i).addEventListener("click", read_ticket_desc);
  };
  function read_ticket_desc(){ //transfering desc value to modal body paragraph 
    var ticketIndex = event.target.parentElement.parentElement.parentElement.parentElement.id;
    ticketIndex = ticketIndex.slice(1,2)

    document.getElementById("ticketDescriptionHeader").innerHTML = ("Details for Ticket #" + tixArray[ticketIndex].id);
    document.getElementById("ticketDescriptionSectionTitle").innerHTML = tixArray[ticketIndex].title;
    document.getElementById("ticketDescriptionSectionDesc").innerHTML = tixArray[ticketIndex].desc;
    document.getElementById("ticketDescriptionSectionDev").innerHTML = tixArray[ticketIndex].dev;
    document.getElementById("ticketDescriptionSectionSubmitter").innerHTML = tixArray[ticketIndex].submitter;
    document.getElementById("ticketDescriptionSectionProject").innerHTML = tixArray[ticketIndex].pid;
    document.getElementById("ticketDescriptionSectionPriority").innerHTML = tixArray[ticketIndex].priority;
    document.getElementById("ticketDescriptionSectionStatus").innerHTML = tixArray[ticketIndex].status;
    document.getElementById("ticketDescriptionSectionLastUpdated").innerHTML = tixArray[ticketIndex].lastupdate;
    document.getElementById("ticketDescriptionSectionCreated").innerHTML = tixArray[ticketIndex].date;
  };
}

//Ticket Delete Btn Functionality
async function deleteTixBtnSetup(){
  console.log("Delete ticket buttons setup...")
  for (var i = 0; i<tixArray.length; i++){
    let ticketDescIndex = i;
    document.getElementById('deleteTicketT' + i).addEventListener("click", deleteTicket);
  };
  function deleteTicket(){ //transfering desc value to modal body paragraph 
    var ticketIndex = event.target.parentElement.parentElement.parentElement.id;
    ticketIndex = ticketIndex.slice(1,2)
    alert("Deleting ticket T" + tixArray[ticketIndex].id)
    remove(ref(dbRef, 'tickets/T' + tixArray[ticketIndex].id));
    location.reload();
  };
}

//building available dev list for assign dev button
async function assignDevBtnSetup(){
  console.log("Setting up dev assignment buttons...");
  for (var i = 0; i<tixArray.length; i++){
    let ticketDescIndex = i;
    document.getElementById('assignDevBtnT' + i).addEventListener("click", getEditTicketIndex);
  };
  function getEditTicketIndex(){ //transfering desc value to modal body paragraph 
    let availableDevSelect = document.getElementById('availableDevSelect');
    editTicketIndex = event.target.parentElement.parentElement.id;
    editTicketIndex = editTicketIndex.slice(6,7)
    console.log("assigning new dev to " + editTicketIndex);
    for (let i = 0; i<devArray.length; i++){
      let template = `<option>${devArray[i].name}</option>`;
      availableDevSelect.innerHTML += template;
    }
  };
}

//assign ticket dev button functionality
$("#assignDevForm").submit(function(e) {
  //e.preventDefault();
  var edittedTixDev = document.getElementById('availableDevSelect').value;
  editTicketDev(edittedTixDev)
});
async function editTicketDev(ticketDev) {
  set(ref(dbRef, 'tickets/T' + tixArray[editTicketIndex].id), {
    date: tixArray[editTicketIndex].date,
    desc: tixArray[editTicketIndex].desc,
    dev : ticketDev,
    priority : tixArray[editTicketIndex].priority,
    status : tixArray[editTicketIndex].status,
    title : tixArray[editTicketIndex].title,
    id : tixArray[editTicketIndex].id,
    pid : tixArray[editTicketIndex].pid
  });
}

//getting values for the ticket distribution chart
function ticketDistributionChartSetup(){
  tixChartVals = {low: 0, mid: 0, high: 0};
  for (let i = 0; i<tixArray.length; i++){
    let priority = tixArray[i].priority
    if(priority == "high"){
      tixChartVals.high++;
    }
    if(priority == "mid"){
      tixChartVals.mid++;
    }
    if(priority == "low"){
      tixChartVals.low++;
    }
  }
}



//---------------------------------------------------FUNCTION CALLING----------------------------------------------------------------
//Ticket Array Populating
async function populateTixArray(){
  const snapshot = await get(ref(dbRef, 'tickets'));
  var tixArray = [];

  snapshot.forEach(childSnapshot=>{
    tixArray.push(childSnapshot.val());
  });
  return tixArray;
}
var tixArray = await populateTixArray();

//Project Array Populating
async function populateProjArray(){
  const snapshot = await get(ref(dbRef, 'projects'));
  var projArray = [];

  snapshot.forEach(childSnapshot=>{
    projArray.push(childSnapshot.val());
  });
  return projArray;
}

//User Array Populating
async function populateUserArray(){
  const snapshot = await get(ref(dbRef, 'users'));
  var userArray = [];

  snapshot.forEach(childSnapshot=>{
    userArray.push(childSnapshot.val());
  });
  return userArray;
}


let addTicketBtn = document.getElementById('addTicketBtn');
let ticketTable = document.getElementById('ticketDataTable');
var editTicketIndex = 0;
let tixChartVals = [];


await ticketListStartUp();
await editTixBtnSetup();
await viewTixBtnSetup();
await deleteTixBtnSetup();


async function populateAvailDevArray(){
  const snapshot = await get(ref(dbRef, 'users'));
  var devArray = [];
  var tmp = [];

  snapshot.forEach(childSnapshot=>{
    devArray.push(childSnapshot.val());
  });
  for (let i = 0; i<devArray.length; i++){
    if(devArray[i].role == 'Developer'){
      tmp.push(devArray[i]);
    }
  }
  devArray = tmp;

  return devArray;
}
var devArray = await populateAvailDevArray();
await assignDevBtnSetup(); //need to setup the members list first



ticketDistributionChartSetup()
export {tixChartVals}


//--------------------------------------------------------TOP OF DASHBOARD SYSTEM------------------------------------------------------------

function dashCardValues(){
  document.getElementById('activeProjectsDashCard').innerHTML = projArray.length;
  document.getElementById('totalTicketsDashCard').innerHTML = tixArray.length;
  document.getElementById('analyticsDashCard').innerHTML = 0;
  var unassignedTixCount = 0;
  for(let i = 0; i<tixArray.length; i++){
    if(tixArray[i].dev == "tbd"){
      unassignedTixCount++;
    }
  }
  document.getElementById('unassignedTicketsDashCard').innerHTML = unassignedTixCount;
}

const projArray = await populateProjArray();

const userArray = await populateUserArray();

buildSelectProjectAdd();

dashCardValues();
