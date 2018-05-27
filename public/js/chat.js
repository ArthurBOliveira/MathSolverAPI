let socket = io();
let _problem;

socket.on('connect', function () {
    let params = jQuery.deparam(window.location.search);
    console.log(params);

    socket.emit('join', params, function (problem) {
        console.log('joined');
        console.log(problem);
        if(problem.room !== params.room) return;
    
        _problem = problem;

        $('#lblProblem').html(problem.problem);
    
        $('#btnCorrect').removeAttr("disabled");
        $('#btnIncorrect').removeAttr("disabled");
    });
});

socket.on('newQuestion', function(problem) {
    if(problem.room !== room) return;

    $('#lblProblem').val();

    $('#btnCorrect').removeAttr("disabled");
    $('#btnIncorrect').removeAttr("disabled");
});

socket.on('updateUserList', function (users) {
    var ol = $('<ol></ol>');

    users.forEach(function (user) {
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol);
});

socket.on('disconnect', function () {
    console.log('Disconnected from Server');
});


$('#btnCorrect').on('click', function (e) {
    e.preventDefault();
    $('#btnIncorrect').attr("disabled","disabled");
    $('#btnCorrect').attr("disabled","disabled");

    console.log('answer!');

    socket.emit('checkAnswer', {
        problem: _problem,
        answer: true
    }, function (msg) {
        console.log(msg);
    });
});

$('#btnIncorrect').on('click', function (e) {
    e.preventDefault();
    $('#btnIncorrect').attr("disabled","disabled");
    $('#btnCorrect').attr("disabled","disabled");

    console.log('answer!');

    socket.emit('checkAnswer', {
        problem: _problem,
        answer: false
    }, function (msg) {
        console.log(msg);
    });
});

var locationButton = $('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) return alert('No geolocation!');

    locationButton.attr('disabled', 'disabled').text('Sending...');

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });

        locationButton.removeAttr('disabled').text('Sending location');
    }, function (position) {
        locationButton.removeAttr('disabled').text('Sending location');
        return alert('Unable to fetch location!');
    });
});