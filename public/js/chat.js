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
        console.log(_problem);

        $('#lblProblem').html(problem.problem);
    
        $('#btnCorrect').removeAttr("disabled");
        $('#btnIncorrect').removeAttr("disabled");
    });
});

socket.on('newQuestion', function(params) {
    if(params.room !== _problem.room) return;
    console.log(params);

    _problem = params;

    $('#lblProblem').html(params.problem);
    $('#lblResult').html("");
    $('#lblStatus').html("");

    $('#btnCorrect').removeAttr("disabled");
    $('#btnIncorrect').removeAttr("disabled");
});

socket.on('questionAnswered', function(room) {
    if(room !== _problem.room) return;
    console.log("to late!");

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
        console.log(answer);

        _score = answer.score;
        $('#lblScore').html(_score);
        $('#lblStatus').html(answer.status);
    });
}