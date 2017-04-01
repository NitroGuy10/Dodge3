/* 
Key Codes:
13 - Enter
27 - Escape
38 - Up Arrow
40 - Down Arrow
*/
var player;
var obstacles = [];
var onepress = 0;
var playerpos = 1;
var playmusic;
var score;
var best;
var scorenum = 0;
var pb = 0;
var mobile = false;
var mode = 0;
var delay = 300;
function startMobile() {
	mobile = true;
	delay = 1000;
	$('html, body').css({
    overflow: 'hidden',
    height: '100%'
});
	startGame();
	}
function startGame() {
	playmusic = getCookie("playmusic");
	mode = location.hash.slice(1);
	pb = getCookie(("pb" + mode));
	player = new component(30, 30, "blue", 10, 120);
	score = new component("30px", "Impact", "black", 320, 40, "text");
	best = new component("30px", "Impact", "black", 320, 80, "text");
	if (mode == 3) {
		speed = 17;
		obsinterval = 25;
		m3i = 0;
		if (mobile == false) {
		document.getElementById("d3").innerHTML += " - One Button Mode";
		document.getElementById("directions").innerHTML = "Press the spacebar to move, avoid the red rectangles, and press enter to restart. Thats all!";
		}
	}
	if (mode == 1) {
		speed = 12;
		obsinterval = 35;
		if (mobile == false)
		document.getElementById("d3").innerHTML += " - Easy Mode";
	}
	if (mode == 2) {
		speed = 11;
		obsinterval = 18;
		if (mobile == false)
		document.getElementById("d3").innerHTML += " - Compact Mode";
	}
	if (mode == 0) { 
		speed = 17;
		obsinterval = 25;
	}
	gameArea.start();
	music = new sound("music.mp3");
	lose = new sound("lose.wav");
	if (playmusic == 1) {music.play();}
}
var gameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = 480;
		this.canvas.height = 270;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.frameNo = 0;
		this.interval = setInterval(updateGameArea, 20);
		window.addEventListener('keydown', function (e) {
			if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
				e.preventDefault();
			}
			gameArea.key = e.keyCode;
		})
		window.addEventListener('keyup', function (e) {
			gameArea.key = false;
			onepress = 0;
		})
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop : function() {
		clearInterval(this.interval);
		if (playmusic == 1) {
			music.stop();
			lose.play();
		}
		gameArea.key = false;
		setInterval(function(){ 
			window.addEventListener('keydown', function (e) {
			gameArea.key = e.keyCode;
		})
		if (gameArea.key == 13) {location.reload();}
		 }, 1);
	},
	color : function(col) {
		this.canvas.style.backgroundColor = col;
	}
}
function everyinterval(n) {
	if ((gameArea.frameNo / n) % 1 == 0) {return true;}
	return false;
}
function component(width, height, color, x, y, type) {
	this.type = type;
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.update = function(){
		ctx = gameArea.context;
		if (this.type == "text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = color;
			ctx.fillText(this.text, this.x, this.y);
		} else {
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}
	this.newPos = function() {
		this.y = 20 + (100 * playerpos);
	}
	this.crashWith = function(otherobj) {
		var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
		if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}
function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function(){
		this.sound.play();
	}
	this.stop = function(){
		this.sound.pause();
	}
}
function updateGameArea() {
	scorenum = Math.round(gameArea.frameNo/20);
	var x, height, gap, minHeight, maxHeight, minGap, maxGap;
	for (i = 0; i < obstacles.length; i += 1) {
		if (player.crashWith(obstacles[i])) {
			gameArea.stop();
			return;
		}
	}
	gameArea.clear();
	gameArea.frameNo += 1;
	if (gameArea.frameNo == 1 || everyinterval(obsinterval)) {
	x = gameArea.canvas.width;
	pos = Math.floor((Math.random() * 3));
	vari = Math.floor((Math.random() * 3));
	if (vari == 0) {height = 30;}
	if (vari == 1 || vari == 2) {height = 130; pos = Math.floor((Math.random() * 2))}
	obstacles.push(new component(60, height, "red", x+delay, 20 + (100 * pos)));
	}
	for (i = 0; i < obstacles.length; i += 1) {
		obstacles[i].x -= speed;
		obstacles[i].update();
		}
	score.text="Score: " + scorenum;
	score.update();
	best.text="Best: " + pb;
	best.update();
	if (scorenum > pb) {
		pb = scorenum;
		document.cookie = "pb" + mode + "=" + scorenum + ";";
	}
	if (mode == 3) {
		if (gameArea.key && gameArea.key == 32 && onepress == 0) {
			onepress = 1;
			if (m3i == 3) {m3i = 0;}else{m3i += 1;}
			if (m3i == 0 || m3i == 2) {playerpos = 1;}
			if (m3i == 1) {playerpos = 0;}
			if (m3i == 3) {playerpos = 2;}
		}
	}
	if (mobile == true) {
		$("body").swipe( {
			swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
				if (mode != 3) {
				if (direction == "up" && playerpos != 0) {playerpos -= 1;}
				if (direction == "down" && playerpos != 2) {playerpos +=1;}
				if (fingerCount == 2) {location.reload();}
				if (fingerCount == 3) {document.getElementById("mode").className = "list";}
				}
			},
			tap:function(event, target) {
				if (mode == 3) {
				if (m3i == 3) {m3i = 0;}else{m3i += 1;}
				if (m3i == 0 || m3i == 2) {playerpos = 1;}
				if (m3i == 1) {playerpos = 0;}
				if (m3i == 3) {playerpos = 2;}
			}
			}
		});
	}
	if (gameArea.key && gameArea.key == 38 && playerpos != 0 && onepress == 0) {playerpos -= 1; onepress = 1;}
	if (gameArea.key && gameArea.key == 40 && playerpos != 2 && onepress == 0) {playerpos += 1; onepress = 1;}
	player.newPos();
	player.update();
}
function toggleMusic() {
	if (playmusic == 1) {
		playmusic = 0;
		document.cookie = "playmusic=0;";
		music.stop();
	}else {
		playmusic = 1;
		document.cookie = "playmusic=1;";
		music.play();
	}
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function setMode(setting) {
	location.hash = setting;
	location.reload();
}
