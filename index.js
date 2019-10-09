// get information from database to put on a table
// when users enters inputs, next clicks submit, the information has to go to the table
// the app is going to calculate minutes away, next arrival
// save information after clicking submit to database

const firebaseConfig = {
  apiKey: "AIzaSyBJoyww2PA3vSZxEpRWyC1GG7TMFWV2Z1o",
  authDomain: "bootcamp-happy.firebaseapp.com",
  databaseURL: "https://bootcamp-happy.firebaseio.com",
  projectId: "bootcamp-happy",
  storageBucket: "bootcamp-happy.appspot.com",
  messagingSenderId: "991140649039",
  appId: "1:991140649039:web:cb0c3dc5b6597ecf37723a"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  var trainName = $("#train-name-input")
    .val()
    .trim();

  var destination = $("#destination-input")
    .val()
    .trim();

  var firstTime = moment(
    $("#first-time-input")
      .val()
      .trim()
  ).format("HH: mm");

  var frequency = $("#frequency-input")
    .val()
    .trim();

  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTime: firstTime,
    frequency: frequency
  };

  database.ref().push(newTrain);

  alert("Train succesfully added");

  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-time-input").val("");
  $("#frequency-input").val("");
});

database.ref().on("child_added", function(childSnapshot) {
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var firstTime = childSnapshot.val().firstTime; //
  var frequency = childSnapshot.val().frequency; //

  // minutes away, next arrival
  var firstTimeConverted = moment(
    childSnapshot.val().firstTime,
    "HH: mm"
  ).subtract(1, "years");

  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

  var remainder = diffTime % childSnapshot.val().frequency;
  var minAway = childSnapshot.val().frequency - remainder;
  var nextArr = moment().add(minAway, "minutes");
  nextArr = moment(nextArr).format("HH: mm");

  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextArr),
    $("<td>").text(minAway)
  );
  $("#train-table > tbody").append(newRow);
});
