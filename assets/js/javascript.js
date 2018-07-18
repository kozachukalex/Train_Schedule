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

        var info = snapshot.val();
        trainList.push(info)
        console.log(trainList)
        console.log(snapshot.key)

        var trainName = info.name
        var trainName = capitalizeFirstLetter(trainName)

        var trainDestination = info.destination
        var trainDestination = capitalizeFirstLetter(trainDestination)

        var time = info.firstTime
        var time = moment(time, "HH:mm").format("hh:mm A")

        var $tr = $("<tr>").attr("id", snapshot.key).attr("data-number", trainNumber)
        var name = $("<td>").append(trainName)
        var destination = $("<td>").append(trainDestination)
        var frequency = $("<td>").append(info.frequency)
        var firstArrival = $("<td>").append(time)
        var minutesAway = $("<td>").append(minutesAway)
        var button = $("<button>").addClass("deleteButton").attr("data-index", trainNumber).html("x")
        var buttonColumn = $("<td>").append(button)

        $tr.append(name)
            .append(destination)
            .append(frequency)
            .append(firstArrival)
            .append(minutesAway)
            .append(buttonColumn)

        $("#scheduleTable").append($tr);
        trainNumber++;
    })

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
        var key = $("[data-number='"+index+"']").attr("id")

        $("[data-number='"+index+"']").remove();
        //By splicing with an empty space, allows me to verify the item is removed and doesn't throw off the other index numbers
        trainList.splice(index, 1,"")
        database.child(key).remove()
    });

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

});