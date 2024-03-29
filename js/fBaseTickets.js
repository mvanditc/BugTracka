import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
import { getDatabase, ref, set, child, update, remove, onValue, get } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { DateTime } from "https://moment.github.io/luxon/es6/luxon.min.js";
import 'https://code.jquery.com/jquery-3.6.1.min.js';
import '/node_modules/datatables.net/js/jquery.dataTables.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

const firebaseConfig = {
  // nice try
};

// Initialize Firebase
console.log('initializing firebase');
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const dbRef = getDatabase();
const auth = getAuth();

//---------------------------------------------------TICKET SYSTEM----------------------------------------------------------------
//Ticket Table Printing Function
async function ticketListStartUp(userRole){
  console.log("Building tickets...")

  for (var i = tixArray.length-1; i>=0; i--){

    let printDev = "";
    let printStatus = "";
    let printPriority = "";
    var template = "";
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
    if (userRole == "dev"){
      if(printDev == `<a id="a view tag" href="#" data-toggle="modal" data-target="#assignDevModal" style="text-decoration: none;"> <button id="assignDevBtnT${i}" style="background-color: #1F9EAE; border: none; color:white; border-radius:3px; text-align:center;">Assign Dev</button> </a>`){
        printDev = ''
      }
      template = `
      <tr id="T${i}">
        <td><p id="tixTitleT0" style="margin: 0; font-weight: bold; color: #35393F">${tixArray[i].title}</p></td>
        <td id="assign${i}">${printDev}</td>
        <td>${printStatus}</td>
        <td>${printPriority}</td>
        <td><button disabled id="tixDateT0" style="font-size: 12px; background-color: #00000000; border: solid; border-color: #858585; color:#858585; border-radius:3px; text-align:center; border-width: 1px;">${tixArray[i].date}</button></td>
        <td class="text-center"><a id="a view tag" href="#" data-toggle="modal" data-target="#ticketDescModal" style="margin-left: 2px; margin-right: 2px; text-decoration: none;"><button id="viewTicketBtnT${i}" style="padding-left: 2px; padding-right: 2px; padding-top: 0px; padding-bottom: 0px; font-size: 15px; background-color: #00000000; border: solid; border-color: #1F9EAE; color:#1F9EAE; border-radius:3px; text-align:center; border-width: 1px;"><i class="fas fa-eye" style="padding-top: 2px; padding-bottom: 2px; color: #1F9EAE;"></i></button></a><a id="a edit tag" href="#" data-toggle="modal" data-target="#ticketEditModal" style="margin-left: 2px; margin-right: 2px; text-decoration: none;"><button id="editTicketBtnT${i}" style="padding-left: 2px; padding-right: 2px; padding-top: 0px; padding-bottom: 0px; font-size: 15px; background-color: #00000000; border: solid; border-color: #858585; color:#858585; border-radius:3px; text-align:center; border-width: 1px;"><i class="fas fa-pen" style="padding-top: 2px; padding-bottom: 2px; color: #858585;"></i></button></a></td>
      </tr>`
    }
    else if(userRole == "admin" || userRole == "pm"){
      template = `
      <tr id="T${i}">
        <td><p id="tixTitleT0" style="margin: 0; font-weight: bold; color: #35393F">${tixArray[i].title}</p></td>
        <td id="assign${i}">${printDev}</td>
        <td>${printStatus}</td>
        <td>${printPriority}</td>
        <td><button disabled id="tixDateT0" style="font-size: 12px; background-color: #00000000; border: solid; border-color: #858585; color:#858585; border-radius:3px; text-align:center; border-width: 1px;">${tixArray[i].date}</button></td>
        <td class="text-center"><a id="a view tag" href="#" data-toggle="modal" data-target="#ticketDescModal" style="margin-left: 2px; margin-right: 2px; text-decoration: none;"><button id="viewTicketBtnT${i}" style="padding-left: 2px; padding-right: 2px; padding-top: 0px; padding-bottom: 0px; font-size: 15px; background-color: #00000000; border: solid; border-color: #1F9EAE; color:#1F9EAE; border-radius:3px; text-align:center; border-width: 1px;"><i class="fas fa-eye" style="padding-top: 2px; padding-bottom: 2px; color: #1F9EAE;"></i></button></a><a id="a edit tag" href="#" data-toggle="modal" data-target="#ticketEditModal" style="margin-left: 2px; margin-right: 2px; text-decoration: none;"><button id="editTicketBtnT${i}" style="padding-left: 2px; padding-right: 2px; padding-top: 0px; padding-bottom: 0px; font-size: 15px; background-color: #00000000; border: solid; border-color: #858585; color:#858585; border-radius:3px; text-align:center; border-width: 1px;"><i class="fas fa-pen" style="padding-top: 2px; padding-bottom: 2px; color: #858585;"></i></button></a><button class="ticketDeleteButtons" id="deleteTicketT${i}" style="padding-left: 2px; padding-right: 2px; padding-top: 0px; padding-bottom: 0px; font-size: 15px; background-color: #00000000; border: solid; border-color: #E74A3B; color:#858585; border-radius:3px; text-align:center; border-width: 1px;"><i class="fas fa-trash" style="color: #E74A3B;"></i></button></td>
      </tr>`
    }
    else if(userRole == "submit"){
      if(printDev == `<a id="a view tag" href="#" data-toggle="modal" data-target="#assignDevModal" style="text-decoration: none;"> <button id="assignDevBtnT${i}" style="background-color: #1F9EAE; border: none; color:white; border-radius:3px; text-align:center;">Assign Dev</button> </a>`){
        printDev = ''
      }
      template = `
      <tr id="T${i}">
        <td><p id="tixTitleT0" style="margin: 0; font-weight: bold; color: #35393F">${tixArray[i].title}</p></td>
        <td id="assign${i}">${printDev}</td>
        <td>${printStatus}</td>
        <td>${printPriority}</td>
        <td><button disabled id="tixDateT0" style="font-size: 12px; background-color: #00000000; border: solid; border-color: #858585; color:#858585; border-radius:3px; text-align:center; border-width: 1px;">${tixArray[i].date}</button></td>
        <td class="text-center"><a id="a view tag" href="#" data-toggle="modal" data-target="#ticketDescModal" style="margin-left: 2px; margin-right: 2px; text-decoration: none;"><button id="viewTicketBtnT${i}" style="padding-left: 2px; padding-right: 2px; padding-top: 0px; padding-bottom: 0px; font-size: 15px; background-color: #00000000; border: solid; border-color: #1F9EAE; color:#1F9EAE; border-radius:3px; text-align:center; border-width: 1px;"><i class="fas fa-eye" style="padding-top: 2px; padding-bottom: 2px; color: #1F9EAE;"></i></button></a></td>
      </tr>`
    }
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
  //e.preventDefault();
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
  var datetime = DateTime.fromISO(DateTime.now(),{zone: 'utc-5'}).toFormat("yyyy'-'LL'-'dd' @'HH':'mm':'ss ZZZZ").toString();
  set(ref(dbRef, 'tickets/T' + ticketID), {
      date: datetime,
      desc: ticketDesc,
      dev : "tbd",
      priority : ticketPriority,
      status : ticketStatus,
      title : ticketTitle,
      id : ticketID.toString(),
      pid : projId.toString(),
      lastupdate : "never",
      submitter : "Demo Submitter"
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
    ticketStatusTable.innerHTML = "";
    ticketPriorityTable.innerHTML = "";
    editTicketIndex = event.target.parentElement.id;
    editTicketIndex = editTicketIndex.slice(14,15);
    if (tixArray[editTicketIndex].status == "new"){
      ticketStatusTable.innerHTML+=("<option>New</option>");
      ticketStatusTable.innerHTML+=("<option>Done</option>");
    }
    else{
      ticketStatusTable.innerHTML+=("<option>Done</option>");
      ticketStatusTable.innerHTML+=("<option>New</option>");
    }
    if (tixArray[editTicketIndex].priority == "high"){
      ticketPriorityTable.innerHTML+=("<option>High</option>");
      ticketPriorityTable.innerHTML+=("<option>Mid</option>");
      ticketPriorityTable.innerHTML+=("<option>Low</option>");
    }
    else if(tixArray[editTicketIndex].priority == "mid"){
      ticketPriorityTable.innerHTML+=("<option>Mid</option>");
      ticketPriorityTable.innerHTML+=("<option>High</option>");
      ticketPriorityTable.innerHTML+=("<option>Low</option>");
    }
    else{
      ticketPriorityTable.innerHTML+=("<option>Low</option>");
      ticketPriorityTable.innerHTML+=("<option>Mid</option>");
      ticketPriorityTable.innerHTML+=("<option>High</option>");
    }
  };
  //ticket edit submit button functionality
  $("#editTicketForm").submit(function(e) {
    //e.preventDefault();
    var edittedTixTitle = document.getElementById('tixTitleEdit').value;
    var edittedTixDesc = document.getElementById('tixDescEdit').value;
    var edittedTixStatus = document.getElementById('tixStatusEdit').value.toLowerCase();
    var edittedTixPriority = document.getElementById('tixPriorityEdit').value.toLowerCase();
    editTicket(edittedTixTitle, edittedTixDesc, edittedTixStatus, edittedTixPriority)
  });
}
async function editTicket(ticketTitle, ticketDesc, ticketStatus, ticketPriority) {
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
  let ticketPriorityOG = tixArray[editTicketIndex].priority;
  let ticketStatusOG = tixArray[editTicketIndex].status;
  let ticketSubmitter = tixArray[editTicketIndex].submitter;

  var newTicketChangesID = Date.now();
  var datetime = DateTime.fromISO(DateTime.now(),{zone: 'utc-5'}).toFormat("yyyy'-'LL'-'dd' @'HH':'mm':'ss ZZZZ").toString();

  if(ticketTitle == "" && ticketDesc == ""){
    console.log("0 0");
    set(ref(dbRef, 'tickets/T' + tixArray[editTicketIndex].id), {
      date: ticketDateOG,
      desc: ticketDescOG,
      dev : ticketDevOG,
      priority : ticketPriority,
      status : ticketStatus,
      title : ticketTitleOG,
      id : ticketID,
      pid : ticketPID,
      submitter : ticketSubmitter,
      lastupdate : datetime
    });
    if(ticketPriority != ticketPriorityOG && ticketStatus == ticketStatusOG){
      set(ref(dbRef, 'ticketchanges/TCH' + newTicketChangesID.toString()), {
        property: "Priority",
        oldvalue: ticketPriorityOG,
        newvalue : ticketPriority,
        datechanged : datetime,
        id : newTicketChangesID.toString(),
        tid : tixArray[editTicketIndex].id
      });
    }
    else if(ticketPriority == ticketPriorityOG && ticketStatus != ticketStatusOG){
      set(ref(dbRef, 'ticketchanges/TCH' + newTicketChangesID.toString()), {
        property: "Status",
        oldvalue: ticketStatusOG,
        newvalue : ticketStatus,
        datechanged : datetime,
        id : newTicketChangesID.toString(),
        tid : tixArray[editTicketIndex].id
      });
    }
    else if(ticketPriority != ticketPriorityOG && ticketStatus != ticketStatusOG){
      set(ref(dbRef, 'ticketchanges/TCH' + newTicketChangesID.toString()), {
        property: "Priority, Status",
        oldvalue: `${ticketPriorityOG}, ${ticketStatusOG}`,
        newvalue : `${ticketPriority}, ${ticketStatus}`,
        datechanged : datetime,
        id : newTicketChangesID.toString(),
        tid : tixArray[editTicketIndex].id
      });
    }
  }
  else if(ticketTitle == "" && ticketDesc != ""){
    console.log("0 1");
    set(ref(dbRef, 'tickets/T' + tixArray[editTicketIndex].id), {
      date: ticketDateOG,
      desc: ticketDesc,
      dev : ticketDevOG,
      priority : ticketPriority,
      status : ticketStatus,
      title : ticketTitleOG,
      id : ticketID,
      pid : ticketPID,
      submitter : ticketSubmitter,
      lastupdate : datetime
    });
    if(ticketPriority != ticketPriorityOG && ticketStatus == ticketStatusOG){
      set(ref(dbRef, 'ticketchanges/TCH' + newTicketChangesID.toString()), {
        property: "Priority, Description",
        oldvalue: `${ticketPriorityOG}, ${ticketDateOG}`,
        newvalue : `${ticketPriority}, ${ticketDate}`,
        datechanged : datetime,
        id : newTicketChangesID.toString(),
        tid : tixArray[editTicketIndex].id
      });
    }
    else if(ticketPriority == ticketPriorityOG && ticketStatus != ticketStatusOG){
      set(ref(dbRef, 'ticketchanges/TCH' + newTicketChangesID.toString()), {
        property: "Status, Description",
        oldvalue: `${ticketStatusOG}, ${ticketDateOG}`,
        newvalue : `${ticketStatus}, ${ticketDate}`,
        datechanged : datetime,
        id : newTicketChangesID.toString(),
        tid : tixArray[editTicketIndex].id
      });
    }
    else if(ticketPriority != ticketPriorityOG && ticketStatus != ticketStatusOG){
      set(ref(dbRef, 'ticketchanges/TCH' + newTicketChangesID.toString()), {
        property: "Priority, Status, Description",
        oldvalue: `${ticketPriorityOG}, ${ticketStatusOG}, ${ticketDateOG}`,
        newvalue : `${ticketPriority}, ${ticketStatus}, ${ticketDate}`,
        datechanged : datetime,
        id : newTicketChangesID.toString(),
        tid : tixArray[editTicketIndex].id
      });
    }
    else{
      set(ref(dbRef, 'ticketchanges/TCH' + newTicketChangesID.toString()), {
        property: "Description",
        oldvalue: `${ticketDateOG}`,
        newvalue : `${ticketDate}`,
        datechanged : datetime,
        id : newTicketChangesID.toString(),
        tid : tixArray[editTicketIndex].id
      });
    }
  }
  else if(ticketTitle != "" && ticketDesc == ""){
    console.log("1 0");
    set(ref(dbRef, 'tickets/T' + tixArray[editTicketIndex].id), {
      date: ticketDateOG,
      desc: ticketDescOG,
      dev : ticketDevOG,
      priority : ticketPriority,
      status : ticketStatus,
      title : ticketTitle,
      id : ticketID,
      pid : ticketPID,
      submitter : ticketSubmitter,
      lastupdate : datetime
    });
    if(ticketPriority != ticketPriorityOG && ticketStatus == ticketStatusOG){
      set(ref(dbRef, 'ticketchanges/TCH' + newTicketChangesID.toString()), {
        property: "Priority, Title",
        oldvalue: `${ticketPriorityOG}, ${ticketDescOG}`,
        newvalue : `${ticketPriority}, ${ticketDesc}`,
        datechanged : datetime,
        id : newTicketChangesID.toString(),
        tid : tixArray[editTicketIndex].id
      });
    }
    else if(ticketPriority == ticketPriorityOG && ticketStatus != ticketStatusOG){
      set(ref(dbRef, 'ticketchanges/TCH' + newTicketChangesID.toString()), {
        property: "Status, Title",
        oldvalue: `${ticketStatusOG}, ${ticketDescOG}`,
        newvalue : `${ticketStatus}, ${ticketDesc}`,
        datechanged : datetime,
        id : newTicketChangesID.toString(),
        tid : tixArray[editTicketIndex].id
      });
    }
    else if(ticketPriority != ticketPriorityOG && ticketStatus != ticketStatusOG){
      set(ref(dbRef, 'ticketchanges/TCH' + newTicketChangesID.toString()), {
        property: "Priority, Status, Title",
        oldvalue: `${ticketPriorityOG}, ${ticketStatusOG}, ${ticketDescOG}`,
        newvalue : `${ticketPriority}, ${ticketStatus}, ${ticketDesc}`,
        datechanged : datetime,
        id : newTicketChangesID.toString(),
        tid : tixArray[editTicketIndex].id
      });
    }
    else{
      set(ref(dbRef, 'ticketchanges/TCH' + newTicketChangesID.toString()), {
        property: "Title",
        oldvalue: `${ticketDescOG}`,
        newvalue : `${ticketDesc}`,
        datechanged : datetime,
        id : newTicketChangesID.toString(),
        tid : tixArray[editTicketIndex].id
      });
    }
  }
  else if(ticketTitle != "" && ticketDesc != ""){
    console.log("1 1");
    set(ref(dbRef, 'tickets/T' + tixArray[editTicketIndex].id), {
      date: ticketDateOG,
      desc: ticketDesc,
      dev : ticketDevOG,
      priority : ticketPriority,
      status : ticketStatus,
      title : ticketTitle,
      id : ticketID,
      pid : ticketPID,
      submitter : ticketSubmitter,
      lastupdate : datetime
    });
    if(ticketPriority != ticketPriorityOG && ticketStatus == ticketStatusOG){
      set(ref(dbRef, 'ticketchanges/TCH' + newTicketChangesID.toString()), {
        property: "Priority, Description, Title",
        oldvalue: `${ticketPriorityOG}, ${ticketDescOG}, ${ticketDateOG}`,
        newvalue : `${ticketPriority}, ${ticketDesc}, ${ticketDate}`,
        datechanged : datetime,
        id : newTicketChangesID.toString(),
        tid : tixArray[editTicketIndex].id
      });
    }
    else if(ticketPriority == ticketPriorityOG && ticketStatus != ticketStatusOG){
      set(ref(dbRef, 'ticketchanges/TCH' + newTicketChangesID.toString()), {
        property: "Status, Description, Title",
        oldvalue: `${ticketStatusOG}, ${ticketDescOG}, ${ticketDateOG}`,
        newvalue : `${ticketStatus}, ${ticketDesc}, ${ticketDate}`,
        datechanged : datetime,
        id : newTicketChangesID.toString(),
        tid : tixArray[editTicketIndex].id
      });
    }
    else if(ticketPriority != ticketPriorityOG && ticketStatus != ticketStatusOG){
      set(ref(dbRef, 'ticketchanges/TCH' + newTicketChangesID.toString()), {
        property: "Priority, Status, Description, Title",
        oldvalue: `${ticketPriorityOG}, ${ticketStatusOG}, ${ticketDescOG}, ${ticketDateOG}`,
        newvalue : `${ticketPriority}, ${ticketStatus}, ${ticketDesc}, ${ticketDate}`,
        datechanged : datetime,
        id : newTicketChangesID.toString(),
        tid : tixArray[editTicketIndex].id
      });
    }
    else{
      set(ref(dbRef, 'ticketchanges/TCH' + newTicketChangesID.toString()), {
        property: "Description, Title",
        oldvalue: `${ticketDescOG}, ${ticketDateOG}`,
        newvalue : `${ticketDesc}, ${ticketDate}`,
        datechanged : datetime,
        id : newTicketChangesID.toString(),
        tid : tixArray[editTicketIndex].id
      });
    }
  }
}

//Ticket View Desc Button Functionality
async function viewTixBtnSetup(uid){
  var userID = uid;
  console.log("View ticket description buttons setup...")
  for (var i = 0; i<tixArray.length; i++){
    let ticketDescIndex = i;
    document.getElementById('viewTicketBtnT' + i).addEventListener("click", read_ticket_desc);
  };
  function read_ticket_desc(){ //transfering desc value to modal body paragraph 
    ticketIndex = event.target.parentElement.parentElement.parentElement.parentElement.id;
    ticketIndex = ticketIndex.slice(1,2)
    ticketCommentTable.innerHTML = "";
    ticketChangesTable.innerHTML = "";

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
    ticketCommentsSetup(ticketIndex);
    ticketChangesSetup(ticketIndex);
    ticketFilesSetup(ticketIndex, userID);
  };
}

//ticket comment building
function ticketCommentsSetup(ticketIndex){
  console.log("Building ticket comments...");
  let thisTicketComments = [];
  for (let i = 0; i<tixCommentArray.length; i++){
    if (tixCommentArray[i].tid == tixArray[ticketIndex].id){
      thisTicketComments.push(tixCommentArray[i]);
    }
  }
  for (var i = thisTicketComments.length-1; i>=0; i--){

    let template = `
      <tr>
        <td>${thisTicketComments[i].commenter}</td>
        <td>${thisTicketComments[i].message}</td>
        <td>${thisTicketComments[i].date}</td>
      </tr>`
    ticketCommentTable.innerHTML += template;
  } 
}

async function addTicketComment(addedTixComment, userID) {
  let tixCommentId = Date.now()
  var datetime = DateTime.fromISO(DateTime.now(),{zone: 'utc-5'}).toFormat("yyyy'-'LL'-'dd' @'HH':'mm':'ss ZZZZ").toString();
  var commentingUser = "";
  for (let i = 0; i<userArray.length; i++){
    console.log(userArray[i]);
    if (userArray[i].id == userID){
      commentingUser = userArray[i].name;
    }
  }
  set(ref(dbRef, 'ticketcomments/TC' + tixCommentId), {
    id: tixCommentId.toString(),
    tid: tixArray[ticketIndex].id,
    commenter : commentingUser,
    message : addedTixComment,
    date : datetime
  });
  location.reload();
}

//ticket files building
function ticketFilesSetup(ticketIndex, userID){
  ticketFileTable.innerHTML = "";
  let thisTicketFiles = [];
  for (let i = 0; i<tixFilesArray.length; i++){
    if (tixFilesArray[i].tid == tixArray[ticketIndex].id){
      thisTicketFiles.push(tixFilesArray[i]);
    }
  }
  for (var i = thisTicketFiles.length-1; i>=0; i--){

    let template = `
      <tr>
        <td>${thisTicketFiles[i].fileName}</td>
        <td>${thisTicketFiles[i].uploader}</td>
        <td>${thisTicketFiles[i].created}</td>
      </tr>`
      ticketFileTable.innerHTML += template;
  }
  var Fileuid = userID;
  document.getElementById('ticketFileUploadBtn').addEventListener("click", uploadTicketFile);
  function uploadTicketFile(){ //transfering desc value to modal body paragraph 
    let uploadItem = document.getElementById('ticketUploadedFile').value.slice(12);
    console.log(uploadItem);
    var newTicketFileId = Date.now();
    var datetime = DateTime.fromISO(DateTime.now(),{zone: 'utc-5'}).toFormat("yyyy'-'LL'-'dd' @'HH':'mm':'ss ZZZZ").toString();
    var commentingUser = "";
    for (let i = 0; i<userArray.length; i++){
      console.log(userArray[i]);
      if (userArray[i].id == Fileuid){
        commentingUser = userArray[i].name;
      }
    }


    set(ref(dbRef, 'ticketfiles/TF' + newTicketFileId), {
      id: newTicketFileId.toString(),
      fileName : uploadItem,
      uploader : commentingUser,
      created : datetime,
      tid : tixArray[ticketIndex].id
    });
    location.reload();
    };
}

//ticket changes building
function ticketChangesSetup(ticketIndex){
  console.log("Building ticket comments...");
  let thisTicketChanges = [];
  for (let i = 0; i<tixChangesArray.length; i++){
    if (tixChangesArray[i].tid == tixArray[ticketIndex].id){
      thisTicketChanges.push(tixChangesArray[i]);
    }
  }
  console.log(thisTicketChanges);
  for (var i = thisTicketChanges.length-1; i>=0; i--){

    let template = `
      <tr>
        <td>${thisTicketChanges[i].property}</td>
        <td>${thisTicketChanges[i].oldvalue}</td>
        <td>${thisTicketChanges[i].newvalue}</td>
        <td>${thisTicketChanges[i].datechanged}</td>
      </tr>`
    ticketChangesTable.innerHTML += template;
  }
}

//Ticket Delete Btn Functionality
async function deleteTixBtnSetup(){
  console.log("Delete ticket buttons setup...")
  for (var i = 0; i<tixArray.length; i++){
    let ticketDescIndex = i;
    document.getElementById('deleteTicketT' + i).addEventListener("click", deleteTicket);
  };
  function deleteTicket(){ //transfering desc value to modal body paragraph 
    ticketIndex = event.target.parentElement.parentElement.parentElement.id;
    ticketIndex = ticketIndex.slice(1,2)
    alert("Deleting ticket T" + tixArray[ticketIndex].id)
    remove(ref(dbRef, 'tickets/T' + tixArray[ticketIndex].id));
    for (let i = 0; i<tixCommentArray.length; i++){
      if (tixArray[ticketIndex].id == tixCommentArray[i].tid){
        remove(ref(dbRef, 'ticketcomments/TC' + tixCommentArray[i].id));
      }
    }
    for (let i = 0; i<tixChangesArray.length; i++){
      if (tixArray[ticketIndex].id == tixChangesArray[i].tid){
        remove(ref(dbRef, 'ticketchanges/TCH' + tixChangesArray[i].id));
      }
    }
    for (let i = 0; i<tixFilesArray.length; i++){
      if (tixArray[ticketIndex].id == tixFilesArray[i].tid){
        remove(ref(dbRef, 'ticketfiles/TF' + tixFilesArray[i].id));
      }
    }
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
  var datetime = DateTime.fromISO(DateTime.now(),{zone: 'utc-5'}).toFormat("yyyy'-'LL'-'dd' @'HH':'mm':'ss ZZZZ").toString();
  set(ref(dbRef, 'tickets/T' + tixArray[editTicketIndex].id), {
    date: tixArray[editTicketIndex].date,
    desc: tixArray[editTicketIndex].desc,
    dev : ticketDev,
    priority : tixArray[editTicketIndex].priority,
    status : tixArray[editTicketIndex].status,
    title : tixArray[editTicketIndex].title,
    id : tixArray[editTicketIndex].id,
    pid : tixArray[editTicketIndex].pid,
    lastupdate : datetime,
    submitter : tixArray[editTicketIndex].submitter
  });
  var newTicketChangesID = Date.now();
  set(ref(dbRef, 'ticketchanges/TCH' + newTicketChangesID.toString()), {
    property: "Developer",
    oldvalue: "tbd",
    newvalue : ticketDev,
    datechanged : datetime,
    id : newTicketChangesID.toString(),
    tid : tixArray[editTicketIndex].id
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

//Ticket Comments Array Populating
async function populateTixCommentArray(){
  const snapshot = await get(ref(dbRef, 'ticketcomments'));
  var tixCommentArray = [];

  snapshot.forEach(childSnapshot=>{
    tixCommentArray.push(childSnapshot.val());
  });
  return tixCommentArray;
}
var tixCommentArray = await populateTixCommentArray();

//Ticket Changes Array Populating
async function populateTixChangesArray(){
  const snapshot = await get(ref(dbRef, 'ticketchanges'));
  var tixChangesArray = [];

  snapshot.forEach(childSnapshot=>{
    tixChangesArray.push(childSnapshot.val());
  });
  return tixChangesArray;
}
var tixChangesArray = await populateTixChangesArray();

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

//Ticket Files Array Populating
async function populateTicketFilesArray(){
  const snapshot = await get(ref(dbRef, 'ticketfiles'));
  var tixFiles = [];

  snapshot.forEach(childSnapshot=>{
    tixFiles.push(childSnapshot.val());
  });
  return tixFiles;
}

var ticketIndex = 0;
let ticketCommentTable = document.getElementById('ticketsComments-tbody');
let ticketFileTable = document.getElementById('ticketsFiles-tbody');
let ticketChangesTable = document.getElementById('tixChanges-tbody');
let addTicketBtn = document.getElementById('addTicketBtn');
let ticketTable = document.getElementById('tickets-tbody');
var editTicketIndex = 0;
let tixChartVals = [];
let ticketStatusTable = document.getElementById('tixStatusEdit');
let ticketPriorityTable = document.getElementById('tixPriorityEdit');


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
//need to setup the members list first



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

const tixFilesArray = await populateTicketFilesArray();

const userArray = await populateUserArray()

buildSelectProjectAdd();

dashCardValues();

//--------------------------------------------------------Authentication System---------------------------------------------------------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    //Add comment to ticket button functionality
    $("#addCommentForm").submit(function(e) {
      e.preventDefault();
      var addedTixComment = document.getElementById('ticketCommentAddValue').value;
      if (addedTixComment == ""){
        alert("Not a valid comment!")
      }
      else{
        addTicketComment(addedTixComment, uid);
      }
    });
    if (uid == "3XTExdq9ELUSR23RhH3FuwGZvbx1"){//Demo Admin Sign in
      var role = "admin";
      document.getElementById('adminSideBarButton').innerHTML = `
      <a href="admindash.html">
          <i class="fas fa-user-shield"></i>
          Admin
      </a>
      `;
      document.getElementById('cornerNameDisplay').innerHTML = 'Demo Admin'
      ticketListStartUp(role);
      editTixBtnSetup();
      viewTixBtnSetup(uid);
      deleteTixBtnSetup();
      assignDevBtnSetup();
      $(document).ready(function() {
        $('#ticketDataTable').DataTable();
      });
    }
    else if (uid == "zsoy1sPUTfVFZArUl9hzAx0hlM32"){ //Demo Dev Sign in
      var role = "dev";
      document.getElementById('cornerNameDisplay').innerHTML = 'Demo Dev';
      ticketListStartUp(role);
      editTixBtnSetup();
      viewTixBtnSetup(uid);
      $(document).ready(function() {
        $('#ticketDataTable').DataTable();
      });
    }
    else if (uid == "rQVkk2wA0QbUir3JxCuQBa4s58p1"){ //Demo Submitter Sign in
      var role = "submit";
      document.getElementById('cornerNameDisplay').innerHTML = 'Demo Submitter';
      ticketListStartUp(role);
      viewTixBtnSetup(uid);
      $(document).ready(function() {
        $('#ticketDataTable').DataTable();
      });
    }
    else if (uid == "OwgqTXwLKMROqL96pTOkgl3MliD2"){ //Demo Project Manager Sign in
      var role = "pm";
      document.getElementById('cornerNameDisplay').innerHTML = 'Demo Project Manager';
      ticketListStartUp(role);
      editTixBtnSetup();
      viewTixBtnSetup(uid);
      deleteTixBtnSetup();
      assignDevBtnSetup();
      $(document).ready(function() {
        $('#ticketDataTable').DataTable();
      });
    }
    else if (uid == "d9dD4AseBYSwRYRxYuoLO2DAZaj1"){ //Demo Dev Sign in
      var role = "dev";
      document.getElementById('cornerNameDisplay').innerHTML = 'Michael Vanditch';
      ticketListStartUp(role);
      editTixBtnSetup();
      viewTixBtnSetup(uid);
      $(document).ready(function() {
        $('#ticketDataTable').DataTable();
      });
    }



    // ...
  } else {
    // User is signed out
    // ...
  }
});