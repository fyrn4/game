var socket = null;

function setConnected(connected) {
	$('#player').prop("disabled",connected);
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    socket = new WebSocket('ws://'+location.host+'/echo.do');	
    socket.onopen = function (e) {
    	if( e.target.readyState != 1) return false;
    	socket.send(JSON.stringify({'name':$('#player').val(),'msg':'connecting'}));
    	socket.onmessage = showGreeting;
    	setConnected(true);
    	player();
    }
}

function player(){
	$('#playerlist').append("<input type='text' value="+$('#player').val()+">");
	
}

function disconnect() {
    if (socket !== null) {
        socket.close();
    }
    setConnected(socket.readyState == 1);
}

function sendName() {
	console.log($('#player').val());
	socket.send(JSON.stringify({'name':$('#player').val(),'msg':$('#name').val()}));
	//socket.send($('#name').val());

    $('#name').val("");
}

function showGreeting(message) {
	var msg = JSON.parse(message.data);
    $("#greetings").append("<tr><td>" + msg.name + " : "+msg.msg+"</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();	
    });
    $( "#connect" ).click(function() { 
    	if($('#player').val() === "" || $('#player').val() === " "){
    		alert('플레이어명을 입력하세요.');
    		return false;
    	}
    connect();
    });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
    $( "#name" ).keyup(function(e) {
    	if( e.keyCode == 13 ) {sendName();};
    });
});

