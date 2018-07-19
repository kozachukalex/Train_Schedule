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
    trainNumber = 0;

    firebase.initializeApp(config);

    database = firebase.database().ref('trainTest');

    database.on("child_added", function (snapshot) {

        info = snapshot.val();
        trainList.push(info)
        console.log(trainList)
        console.log(snapshot.key)

        var trainName = info.name
        var trainName = capitalizeFirstLetter(trainName)

        var trainDestination = info.destination
        var trainDestination = capitalizeFirstLetter(trainDestination)

        calculateTime(info)

        var $tr = $("<tr>").attr("id", snapshot.key).attr("data-number", trainNumber)
        var $name = $("<td>").append(trainName)
        var $destination = $("<td>").append(trainDestination)
        var $frequency = $("<td>").append(info.frequency)
        var $firstArrival = $("<td>").append(time)
        var $minutesAway = $("<td>").append(minutesAway)
        var $button = $("<button>").addClass("deleteButton").attr("data-index", trainNumber).html("x")
        var $buttonColumn = $("<td>").append($button)

        $tr.append($name)
            .append($destination)
            .append($frequency)
            .append($firstArrival)
            .append($minutesAway)
            .append($buttonColumn)

        $("#scheduleTable").append($tr);
        trainNumber++;
    });

    function calculateTime(info) {
        var firstArrival = info.firstTime
        var firstArrival = firstArrival.split(":");
        var arrivalHours = firstArrival[0]
        var arrivalMinutes = firstArrival[1]
        var totalFirstArrival = (arrivalHours * 60) + parseInt(arrivalMinutes)

        var currentTime = moment().format("HH:mm A")
        var currentTime = currentTime.split(":");
        var currentHours0 = currentTime[0]
        var currentMinutes1 = currentTime[1]
        var totalCurrentTime = (currentHours0 * 60) + parseInt(currentMinutes1)

        do {
            totalFirstArrival = parseInt(totalFirstArrival) + parseInt(info.frequency);
        }
        while (totalFirstArrival < totalCurrentTime);

        var totalFirstArrivalHours = Math.floor(totalFirstArrival / 60)
        var totalFirstArrivalMinutes = totalFirstArrival % 60

        if (totalFirstArrivalMinutes === 0) {
            totalFirstArrivalMinutes = "00"
        }
        var totalFirstArrivalAgain = totalFirstArrivalHours + ":" + totalFirstArrivalMinutes

        //Time is coming out of the function and appending but minutesAway is not
        minutesAway = totalFirstArrival - totalCurrentTime;
        time = moment(totalFirstArrivalAgain, "HH:mm").format("hh:mm A");

        if (minutesAway === 0){
            minutesAway = "Arriving"
        }
        console.log(minutesAway);
        console.log(time)

    };

    $("#addNewTrain").on("click", function () {

        event.preventDefault();

        var name = $("#newTrainName").val().trim();
        var destination = $("#newDestination").val().trim();
        var firstTime = $("#firstTrainTime").val().trim();
        var frequency = $("#newTrainFrequency").val().trim();

        var information = {
            name: name,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency,
        };

        database.push(information);
        trainNumber++;
        console.log(trainList)
        $("#newTrainName").val("")
        $("#newDestination").val("")
        $("#firstTrainTime").val("")
        $("#newTrainFrequency").val("")
    });

    $(document).on("click", ".deleteButton", function () {
        var index = $(this).attr("data-index");
        var key = $("[data-number='" + index + "']").attr("id")

        $("[data-number='" + index + "']").remove();
        //By splicing with an empty space, allows me to verify the item is removed and doesn't throw off the other index numbers
        trainList.splice(index, 1, "")
        database.child(key).remove()
    });

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

});