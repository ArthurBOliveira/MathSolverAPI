let socket = io();
let _problem;
let _score;

//Sockets
socket.on('connect', function () {
    let params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (problem) {
        if(problem.room !== params.room) return;
    
        _score = 0;

        _problem = problem;

        $('#lblProblem').html(problem.problem);
    
        $('#btnCorrect').removeAttr("disabled");
        $('#btnIncorrect').removeAttr("disabled");
    });
});

socket.on('updateScores', function(players) {
    var ol = $('<ul></ul>');

    players.forEach(function (players) {
        ol.append($('<li></li>').text(players.name + ': ' + players.score ));
    });

    $('#players').html(ol);
});

socket.on('newQuestion', function(params) {
    if(params.room !== _problem.room) return;

    _problem = params;

    $('#lblProblem').html(params.problem);
    $('#lblResult').html("");
    $('#lblStatus').html("");

    $('#btnCorrect').removeAttr("disabled");
    $('#btnIncorrect').removeAttr("disabled");
});

socket.on('questionAnswered', function(room) {
    if(room !== _problem.room) return;

    $('#btnIncorrect').attr("disabled","disabled");
    $('#btnCorrect').attr("disabled","disabled");

    $('#lblResult').html("Question already Answered");
    $('#lblStatus').html("Await next Question");
});

socket.on('disconnect', function () {
    console.log('Disconnected from Server');
});

//Functions
$('#btnCorrect').on('click', function (e) { SendAnswer(true); });

$('#btnIncorrect').on('click', function (e) { SendAnswer(false); });

function SendAnswer(answer) {
    $('#btnIncorrect').attr("disabled","disabled");
    $('#btnCorrect').attr("disabled","disabled");

    socket.emit('checkAnswer', {
        problem: _problem,
        answer: answer
    }, function (answer) {
        _score = answer.score;
        $('#lblScore').html(_score);
        $('#lblStatus').html(answer.status);
    });
}