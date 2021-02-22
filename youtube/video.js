var myVideo = document.getElementById("myVideo");
var plause = document.getElementById("plause");
var style = document.getElementById("style");
var fullscreenbtn = document.getElementById("fullscreen");
var player = document.getElementById("player");
var volumebtn = document.getElementById("volume");
var volume = document.getElementById("changevolume");
var poster = document.getElementsByClassName("poster")[0];

poster.onclick = function() {
style.innerHTML = '<style>.poster {display: none}</style>';
myVideo.autoplay = true;
myVideo.load();
plause.className = "ytp ytp-pause";
};
function playPause() {
  if (myVideo.paused) {
    play();
  }
  else {
    pause();
  }
}
function play() {
    plause.className = "ytp ytp-pause";
    myVideo.play();
}
function pause() {
    plause.className = "ytp ytp-play";
    myVideo.pause();
}

function endVideo() {
    myVideo.pause();
    style.innerHTML = '<style>#myVideo, .changeduration, .content {display: none;}</style>';
}

var seekslider, curtimetext, durtimetext, timeout;
function intializePlayer(){
	// Set object references
	seekslider = document.getElementById("seekslider");
	curtimetext = document.getElementById("curtimetext");
	durtimetext = document.getElementById("durtimetext");
	// Add event listeners
	seekslider.addEventListener("change",vidSeek,false);
	myVideo.addEventListener("timeupdate",seektimeupdate,false);
	myVideo.addEventListener("play",play,false);
	myVideo.addEventListener("pause",pause,false);
	myVideo.addEventListener("ended",endVideo,false);
	plause.addEventListener("click",playPause,false);
    fullscreenbtn.addEventListener("click",fullscreen,false);
    volumebtn.addEventListener("click",vidmute,false);
    volume.addEventListener("mousemove",setvolume,false);
    volume.addEventListener("mousewheel", function(e) {
    // cross-browser wheel delta
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

    if (delta ==  1 && myVideo.volume <= 1){volume.value = Number(volume.value) + 10; setvolume();}
    if (delta == -1 && myVideo.volume  > 0){volume.value = Number(volume.value) - 10; setvolume();}

    e.preventDefault();
    });
    volumebtn.addEventListener("mousewheel", function(e) {
    // cross-browser wheel delta
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

    if (delta ==  1 && myVideo.volume <= 1){volume.value = Number(volume.value) + 10; setvolume();}
    if (delta == -1 && myVideo.volume  > 0){volume.value = Number(volume.value) - 10; setvolume();}

    e.preventDefault();
    });
    myVideo.addEventListener("mousemove", function() {
    clearTimeout(timeout);
    style.innerHTML = "<style>.poster {display: none} .controls {display:block}</style>";
    timeout = setTimeout(function() {
                style.innerHTML = "<style>.poster {display: none} body {cursor:none} .controls {display:none}</style>";
              }, 3000);
    });
    player.addEventListener("mouseleave", function() {
    setTimeout(function() {
        style.innerHTML = "<style>.poster {display: none} body {cursor:none} .controls {display:none}</style>";
    }, 1000);
    });
    setposter();
    setvolume();
}
window.onload = intializePlayer;

function vidSeek(){
	var seekto = myVideo.duration * (seekslider.value / 100);
	myVideo.currentTime = seekto;
}
function seektimeupdate(){
	var nt = myVideo.currentTime * (100 / myVideo.duration);
	seekslider.value = nt;
	var curmins  = Math.floor(myVideo.currentTime / 60);
    var curhours = Math.floor(curmins / 60) + ":";
	var cursecs  = Math.floor(myVideo.currentTime - curmins * 60);
	var durmins  = Math.floor(myVideo.duration / 60);
	var dursecs  = Math.floor(myVideo.duration - durmins * 60);
	var durhours = Math.floor(durmins / 60);
    if(curmins > 60){ curmins = (curmins - 60) }
    if(durmins > 60){ durmins = (durmins - 60) }
	if(cursecs < 10){ cursecs = "0"+cursecs; }
	if(dursecs < 10){ dursecs = "0"+dursecs; }
	if(curmins < 10){ curmins = "0"+curmins; }
	if(durmins < 10){ durmins = "0"+durmins; }
    curtimetext.innerHTML = curhours+curmins+":"+cursecs;
	durtimetext.innerHTML = durhours+":"+durmins+":"+dursecs;
}

function fullscreen() { /* fungsi untuk membuat video fullscreen atau tidak fullscreen */
if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
if (player.requestFullscreen) {
player.requestFullscreen();
} else if (player.msRequestFullscreen) {
player.msRequestFullscreen();
} else if (player.mozRequestFullScreen) {
player.mozRequestFullScreen();
} else if (player.webkitRequestFullscreen) {
player.webkitRequestFullscreen();
}
fullscreenbtn.className = "ytp ytp-fullscreen-exit";
}
else {
if (document.exitFullscreen) {
document.exitFullscreen();
} else if (document.msExitFullscreen) {
document.msExitFullscreen();
} else if (document.mozCancelFullScreen) {
document.mozCancelFullScreen();
} else if (document.webkitExitFullscreen) {
document.webkitExitFullscreen();
}
fullscreenbtn.className = "ytp ytp-fullscreen";
}
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
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

function vidmute(){
	if(myVideo.muted){
		myVideo.muted = false;
		volumebtn.className = "ytp ytp-volume-up";
        volume.value = 10;
	} else {
		myVideo.muted = true;
		volumebtn.className = "ytp ytp-volume-mute";
        volume.value = 0;
	}
}
function setvolume(){
    if(volume.value == 0){ volumebtn.className = "ytp ytp-volume-mute"; }
    else if (volume.value > 0 && volume.value < 51) { volumebtn.className = "ytp ytp-volume-down"; }
    else { volumebtn.className = "ytp ytp-volume-up"; }
    myVideo.muted = false;
	myVideo.volume = volume.value / 100;
    document.cookie = "volume="+(volume.value / 100)+"; expires=Thu, 18 Dec 2021 12:00:00 UTC;";
}

function setposter(){
    poster.style.backgroundImage = "url("+myVideo.getAttribute("poster")+")";
    myVideo.removeAttribute("poster");
}
