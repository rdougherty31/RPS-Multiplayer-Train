var config = {
    apiKey: "",
    authDomain: "sample-95e09.firebaseapp.com",
    databaseURL: "https://sample-95e09.firebaseio.com",
    projectId: "sample-95e09",
    storageBucket: "sample-95e09.appspot.com",
    messagingSenderId: "739157600074"
  };
firebase.initializeApp(config);

var database = firebase.database();
var name;
var dest;
var firstTime;
var frequency;
var firstTimeMins;
var freqMins;
var timeDiff;
var minAway;
var nextTrain;

$("#submit").click(function(event) {
    event.preventDefault();
    name = $("#name").val().trim();
    dest = $("#dest").val().trim();
    firstTime = $("#firstTime").val().trim();
    frequency = $("#frequency").val().trim();
    database.ref().push({
        name: name,
        dest: dest,
        firstTime: firstTime,
        frequency: frequency
    });
    $("input").val("");
});
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
    //create table elements
    var trainRow = $("<tr>");
    var nameTD = $("<td>");
    var destTD = $("<td>");
    var freqTD = $("<td>");
    var nextArrTD = $("<td>");
    var minAwayTD = $("<td>");
    var trainHour = parseInt(childSnapshot.val().firstTime.charAt(0)+childSnapshot.val().firstTime.charAt(1));
    var trainMin = parseInt(childSnapshot.val().firstTime.charAt(2)+childSnapshot.val().firstTime.charAt(3));
    var currentHour = parseInt(moment().format("HH"));
    var currentMin = parseInt(moment().format("mm"));
    console.log(trainHour);
    console.log(typeof trainHour);
    //assign variables used to display table data
    firstTimeMins = parseInt(childSnapshot.val().firstTime);
    freqMins = parseInt(childSnapshot.val().frequency);
    timeDiff = moment().diff(moment(firstTimeMins),"minutes");
    minAway = freqMins - (timeDiff % freqMins);
    if (trainHour < currentHour) {
        nextTrain = moment().add(minAway,"minutes").format("HH:mm");
        console.log("first if: "+nextTrain);
    } else if (trainHour === currentHour && trainMin < currentMin) {
        nextTrain = moment().add(minAway,"minutes").format("HH:mm");         
        console.log("second if: "+nextTrain);
    } else {
        nextTrain = childSnapshot.val().firstTime;
        console.log("else: "+nextTrain);
    }
    //add classes & text then append table data & entire row
    trainRow.addClass("trainRow");
    nameTD.addClass("tName");
    nameTD.text(childSnapshot.val().name);
    trainRow.append(nameTD);
    destTD.addClass("tDest");
    destTD.text(childSnapshot.val().dest);
    trainRow.append(destTD);
    freqTD.addClass("tfreq");
    freqTD.text(childSnapshot.val().frequency);
    trainRow.append(freqTD);
    nextArrTD.addClass("tNextArr");
    nextArrTD.text(nextTrain);
    trainRow.append(nextArrTD);
    minAwayTD.addClass("tMinAway");
    minAwayTD.text(minAway);
    trainRow.append(minAwayTD);
    $("tbody").append(trainRow);
}, function(errorObject) {
    console.log("Error: " + errorObject.code);
});