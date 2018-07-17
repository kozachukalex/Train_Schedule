$(function () {

    //Initialize Firebase
    var config = {
        apiKey: "AIzaSyDFp1qMdj_jfxJ56ct35MMrIPvJ-eYOk_s",
        authDomain: "wiggitywhamwhamwaffle.firebaseapp.com",
        databaseURL: "https://wiggitywhamwhamwaffle.firebaseio.com",
        projectId: "wiggitywhamwhamwaffle",
        storageBucket: "wiggitywhamwhamwaffle.appspot.com",
        messagingSenderId: "108521732708"
    };

    trainList = [];



    firebase.initializeApp(config);

    database = firebase.database().ref('trainTest');

    database.on("value", function (snapshot) {
        //This allows to reset the table (minus label row) so anytime value changes the entire schedule is updated and not just continuous appending causing repeats
        $("#scheduleTable").find("tr:gt(0)").remove();

        trainList = snapshot.val().savedTrains;
        for (let i = 0; i < trainList.length; i++) {

            var currentTrain = trainList[i];
            var trainName = capitalizeFirstLetter(currentTrain.name)
            var destinationName = capitalizeFirstLetter(currentTrain.destination)
            var frequency = currentTrain.frequency
            var firstTrainTime= currentTrain.time

            //This section could use some iterating to clean up. Used to calculate minutesAway and to properly display the next arrival
            var firstTrainTime = firstTrainTime.split(':');
            
            console.log(firstTrainTime);
            var hours = firstTrainTime[0];
            var minutes = firstTrainTime[1];
            var firstTrainTime = (parseInt(hours) * 60) + parseInt(minutes);


            console.log(hours);
            console.log(minutes);
            console.log(firstTrainTime)

            var date = new Date();
            var currentHour = date.getHours();
            var currentMinute = date.getMinutes();

            console.log(currentHour);
            console.log(currentMinute);

            currentTime = (currentHour * 60) + currentMinute

            console.log(currentTime)
            
            minutesAway = firstTrainTime - currentTime + "m";

            if (hours > 12) {
                hours = (hours - 12)
                firstTrainTime = hours + ":" + minutes + " PM"
            } else {
                firstTrainTime = hours + ":" + minutes + " AM"
            }
            //

            var $thName = $("<th>").html(trainName)
            var $thDestination = $("<th>").html(destinationName)
            var $thFrequency = $("<th>").html(frequency)
            var $thminutesAway = $("<th>").html(minutesAway)
            var $thFirstTrainTime = $("<th>").html(firstTrainTime)
            var $tr = $("<tr>").attr("id", trainName)
            $tr.append($thName)
                .append($thDestination)
                .append($thFrequency)
                .append($thFirstTrainTime)
                .append($thminutesAway);

            $("#scheduleTable").append($tr)

        }

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    $("#addNewTrain").on("click", function () {
        event.preventDefault();

        var newTrainName = $("#newTrainName").val().trim();
        var newDestination = $("#newDestination").val().trim();
        var newTrainFrequency = $("#newTrainFrequency").val();
        var firstTrainTime = $("#firstTrainTime").val();



        if ((newTrainName !== "") && //verifies that each field is filled in
            (newDestination !== "") &&
            (firstTrainTime !== "") &&
            (newTrainFrequency !== "")) {

            var train = {
                name: newTrainName,
                destination: newDestination,
                time: firstTrainTime,
                frequency: newTrainFrequency,
            };
            console.log(train);


            trainList.push(train)

            console.log(trainList)

            database.set({
                savedTrains: trainList,
            });

            var newTrainName = $("#newTrainName").val("");
            var newTrainName = $()
            var newDestination = $("#newDestination").val("");
            var firstTrainTime = $("#firstTrainTime").val("");
            var newTrainFrequency = $("#newTrainFrequency").val("");
        } else {
            alert("You must fill in all information.")
        };
    });

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});