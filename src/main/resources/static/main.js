// 1200:600
var cv = document.getElementById('canvas');
var ctx = cv.getContext('2d');
var playerName = document.getElementById('playerName');
var inf = document.getElementById('word');
var loopStarted = false;
var word = ['START'];
var historys = ['','',''];
var back = new Image();
back.src = "bg.png";

inf.addEventListener('keydown',function(e){
    if(e.keyCode === 13){
        word.push(inf.value);
        historys.push(inf.value);
        sendName();
        inf.value='';
        inf.focus();
    }
});

playerName.addEventListener('keydown',function(e){
    if(e.keyCode === 13){
        if(playerName.value === '' || playerName.value === null){
            alert("플레이어 이름을 입력해주세요");
            return false;
        }
        connect();
        main();
    }
});

function Connect(){
    this.render = function(){
        
        ctx.fillStyle='black';
        ctx.font = 'bold 30px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = "top";
        ctx.fillText("스타트버튼",600,300);

        ctx.canvas.addEventListener('click',function(e){
            var x=e.layerX;
            var y=e.layerY;
            var x1=e.clientX;
            var y1=e.clientY;

            console.log(x+":"+y);
            console.log(x1+":"+y1);
            console.log(e);
            if(x >= 530 && x <= 675 && y >= 308 && y <= 330 ) {
                if(playerName.value === '' || playerName.value===null ){
                alert("플레이어 이름을 입력해주세요");
                return false;
                }
                connect();
                main();
            }
        });
        
    }
}

function Bg(){ //1200:600
    this.render = function(){
        ctx.drawImage(back,0,0,1200,640);
        ctx.beginPath();
        ctx.moveTo(150,50);
        ctx.lineTo(450,50);
        ctx.lineTo(450,200);
        ctx.lineTo(150,200);
        ctx.lineTo(150,50);
        ctx.lineWidth=2;
        ctx.lineJoin="bevel";
        ctx.stroke();
    }
}
function Word(){
    this.render = function(){
        ctx.fillStyle='white';
        ctx.font = 'bold 30px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = "top";
        ctx.fillText(word[(word.length)-1],300,150);
        console.log();
        // ctx.fillText(nword.slice(-1).pop(),cv.width/2,cv.height/8);
        // console.log(this.nword);
    }
}
function History(){
    this.render = function(){
        ctx.fillStyle='#212121';
        ctx.font = 'bold 30px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = "top";
        ctx.globalAlpha=0.9;
        ctx.fillText(historys[(historys.length)-2],300,100);
        ctx.fillStyle='#424040';
        ctx.globalAlpha=0.5;
        ctx.fillText(historys[(historys.length)-3],300,50);
        ctx.globalAlpha=1;
    }
}
function Chat () {
    this.render = function () {

    }
}
var cnt = new Connect();
var bg = new Bg();
var wordIn = new Word();
var hist = new History();
var chat = new Chat();

var start = function () {
    cnt.render();
}

var main =function (){
    $('#playerName').css("display","none");
    $('#word').css("display","");
    bg.render();
    wordIn.render();
    hist.render();
    chat.render();

    requestAnimationFrame(main);
};
start(); 

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
    	socket.send(JSON.stringify({'name':$('#playerName').val(),'msg':'connecting','type':'register'}));
    	socket.onmessage = showGreeting;
    	setConnected(true);
    }
}

function disconnect() {
    if (socket !== null) {
        socket.close();
    }
    setConnected(socket.readyState == 1);
}

function sendName() {
	console.log($('#playerName').val());
	socket.send(JSON.stringify({'name':playerName.value,'msg':inf.value}));
	//socket.send($('#name').val());
    $('#name').val("");
}

function showGreeting(message) {
	var msg = JSON.parse(message.data);
	if(msg.type === "userList"){
		$("#greetings").append("<tr><td>참여자 : "+msg.from+"</td></tr>");	
	}
	if(msg.type === "message"){
		$("#greetings").append("<tr><td>메시지 : "+msg.message+"</td></tr>");
	}
    
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

