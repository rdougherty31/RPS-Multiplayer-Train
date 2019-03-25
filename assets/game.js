var config = {

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
    $("input").text("");
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
    //assign variables used to display table data
    firstTimeMins = parseInt(childSnapshot.val().firstTime);
    freqMins = parseInt(childSnapshot.val().frequency);
    timeDiff = moment().diff(moment(firstTimeMins),"minutes");
    minAway = freqMins - (timeDiff % freqMins);
    nextTrain = moment().add(minAway,"minutes").format("hh:mm");
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