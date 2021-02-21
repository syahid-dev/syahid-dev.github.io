// Select elements here
const video = document.getElementById('video');
const poster = document.getElementsByClassName('poster')[0];
const videoControls = document.getElementById('video-controls');
const playButton = document.getElementById('play');
const playbackIcons = document.querySelector('.playback-icons use');
const playpauseIcons = document.querySelector('#play use');
const timeElapsed = document.getElementById('curtime');
const duration = document.getElementById('durtime');
const progressBar = document.getElementById('progress-bar');
const seek = document.getElementById('seek');
const seekTooltip = document.getElementById('seek-tooltip');
const volumeButton = document.getElementById('volume-button');
const volumeIcons = volumeButton.querySelector('use');
const volume = document.getElementById('volume');
const playbackAnimation = document.getElementById('playback-animation');
const fullscreenButton = document.getElementById('fullscreen-button');
const videoContainer = document.getElementById('video-container');
const fullscreenIcons = fullscreenButton.querySelector('use');
const pipButton = document.getElementById('miniplayer-button');

const videoWorks = !!document.createElement('video').canPlayType;
if (videoWorks) {
  video.controls = false;
  videoControls.classList.remove('hidden');
}

// Add functions here

function setposter(){
    poster.style.backgroundImage = "url("+video.getAttribute("poster")+")";
    video.removeAttribute("poster");
}

// togglePlay toggles the playback state of the video.
// If the video playback is paused or ended, the video is played
// otherwise, the video is paused
function togglePlay() {
  if (video.paused || video.ended) {
    video.play();
  } else {
    video.pause();
  }
}

// updatePlayButton updates the playback icon and tooltip
// depending on the playback state
function updatePlayButton() {
  if (video.paused) {
    playbackIcons.setAttribute('href', '#play-icon');
    playpauseIcons.setAttribute('href', '#play-icon');
    playButton.setAttribute('data-title', 'Play (k)');
  } else {
    playbackIcons.setAttribute('href', '#pause');
    playpauseIcons.setAttribute('href', '#pause');
    playButton.setAttribute('data-title', 'Pause (k)');
  }
}

// formatTime takes a time length in seconds and returns the time in
// minutes and seconds
function formatTime(timeInSeconds) {
  var minutes  = Math.floor(timeInSeconds / 60);
  var hours    = Math.floor(minutes / 60) + ":";
  var seconds  = Math.floor(timeInSeconds - minutes * 60);
  if(minutes > 60){ minutes = (minutes - 60) }
  if(seconds < 10){ seconds = "0"+seconds; }
  if(minutes < 10){ minutes = "0"+minutes; }

  const result = ((hours == '0:') ? '' : hours) + minutes + ':' + seconds;

  return result;
}

// initializeVideo sets the video duration, and maximum value of the
// progressBar
function initializeVideo() {
  const videoDuration = Math.floor(video.duration);
  seek.setAttribute('max', videoDuration);
  progressBar.setAttribute('max', videoDuration);
  const time = formatTime(video.duration);
  duration.innerText = time;
}

// updateTimeElapsed indicates how far through the video
// the current playback is by updating the timeElapsed element
function updateTimeElapsed() {
  const time = formatTime(video.currentTime);
  timeElapsed.innerText = time;
}

// updateProgress indicates how far through the video
// the current playback is by updating the progress bar
function updateProgress() {
  seek.value = Math.floor(video.currentTime);
  progressBar.value = Math.floor(video.currentTime);
}

// updateSeekTooltip uses the position of the mouse on the progress bar to
// roughly work out what point in the video the user will skip to if
// the progress bar is clicked at that point
function updateSeekTooltip(event) {
  const skipTo = Math.round(
    (event.offsetX / event.target.clientWidth) *
      parseInt(event.target.getAttribute('max'), 10)
  );
  seek.setAttribute('data-seek', skipTo);
  const t = formatTime(skipTo);
  seekTooltip.textContent = t;
  const rect = video.getBoundingClientRect();
  var left = event.pageX - rect.left;
  if (left > event.target.clientWidth - 26) { left = event.target.clientWidth - 26; }
  if (left < 26) { left = event.target.clientWidth - 26; }
  seekTooltip.style.left = left + 'px';
}

// skipAhead jumps to a different point in the video when the progress bar
// is clicked
function skipAhead(event) {
  const skipTo = event.target.dataset.seek ? event.target.dataset.seek : event.target.value;
  video.currentTime = skipTo;
  progressBar.value = skipTo;
  seek.value = skipTo;
}

// updateVolume updates the video's volume
// and disables the muted state if active
function updateVolume() {
  if (video.muted) {
    video.muted = false;
  }

  video.volume = volume.value;
}

// updateVolumeIcon updates the volume icon so that it correctly reflects
// the volume of the video
function updateVolumeIcon() {
  volumeButton.setAttribute('data-title', 'Mute (m)');

  if (video.muted || video.volume === 0) {
    volumeIcons.setAttribute('href', '#volume-mute');
    volumeButton.setAttribute('data-title', 'Unmute (m)');
  } else if (video.volume > 0 && video.volume <= 0.5) {
    volumeIcons.setAttribute('href', '#volume-low');
  } else {
    volumeIcons.setAttribute('href', '#volume-high');
  }
}

// toggleMute mutes or unmutes the video when executed
// When the video is unmuted, the volume is returned to the value
// it was set to before the video was muted
function toggleMute() {
  video.muted = !video.muted;

  if (video.muted) {
    playbackIcons.setAttribute('href', '#volume-mute');
    volume.setAttribute('data-volume', volume.value);
    volume.value = 0;
  } else {
    playbackIcons.setAttribute('href', '#volume-high');
    volume.value = volume.dataset.volume;
  }
}

// animatePlayback displays an animation when
// the video is played or paused
function animatePlayback() {
  playbackAnimation.animate(
    [
      {
        opacity: 1,
        transform: 'scale(1)',
      },
      {
        opacity: 0,
        transform: 'scale(1.3)',
      },
    ],
    {
      duration: 500,
    }
  );
}

// toggleFullScreen toggles the full screen state of the video
// If the browser is currently in fullscreen mode,
// then it should exit and vice versa.
function toggleFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else if (document.webkitFullscreenElement) {
    // Need this to support Safari
    document.webkitExitFullscreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    // Need this to support Safari
    videoContainer.webkitRequestFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
}

// updateFullscreenButton changes the icon of the full screen button
// and tooltip to reflect the current full screen state of the video
function updateFullscreenButton() {
  if (document.fullscreenElement) {
    fullscreenIcons.setAttribute('href', '#fullscreen-exit');
    fullscreenButton.setAttribute('data-title', 'Exit full screen (f)');
  } else {
    fullscreenIcons.setAttribute('href', '#fullscreen');
    fullscreenButton.setAttribute('data-title', 'Full screen (f)');
  }
}

// togglePip toggles Picture-in-Picture mode on the video
async function togglePip() {
  try {
    if (video !== document.pictureInPictureElement) {
      pipButton.disabled = true;
      await video.requestPictureInPicture();
    } else {
      await document.exitPictureInPicture();
    }
  } catch (error) {
    console.error(error);
  } finally {
    pipButton.disabled = false;
  }
}

// hideControls hides the video controls when not in use
// if the video is paused, the controls must remain visible
function hideControls() {
  if (video.paused) {
    return;
  }

  videoControls.classList.add('hide');
}

// showControls displays the video controls
function showControls() {
  videoControls.classList.remove('hide');
}

// keyboardShortcuts executes the relevant functions for
// each supported shortcut key
function keyboardShortcuts(event) {
  const { key } = event;
  console.log(key);
  switch (key) {
    case 'j':
      video.currentTime = Number(video.currentTime) - 10;
      break;
    case 'ArrowLeft':
      video.currentTime = Number(video.currentTime) - 5;
      break;
    case 'k': case ' ':
      togglePlay();
      animatePlayback();
      if (video.paused) {
        showControls();
      } else {
        setTimeout(() => {
          hideControls();
        }, 2000);
      }
      break;
    case 'l':
      video.currentTime = Number(video.currentTime) + 10;
      break;
    case 'ArrowRight':
      video.currentTime = Number(video.currentTime) + 5;
      break;
    case 'm':
      toggleMute();
      animatePlayback();
      break;
    case 'f':
      toggleFullScreen();
      break;
    case 'i':
      togglePip();
      break;
    case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
      video.currentTime = video.duration * Number('0.' + key);
      break;
    case 'ArrowUp':
      volume.value = Number(volume.value) + 0.05;
      updateVolume();
      break;
    case 'ArrowDown':
      volume.value = Number(volume.value) - 0.05;
      updateVolume();
      break;
  }
}

var timeout;

// Add eventlisteners here
playButton.addEventListener('click', togglePlay);
video.addEventListener('play', updatePlayButton);
video.addEventListener('pause', updatePlayButton);
video.addEventListener('loadedmetadata', initializeVideo);
video.addEventListener('timeupdate', updateTimeElapsed);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('volumechange', updateVolumeIcon);
video.addEventListener('click', togglePlay);
video.addEventListener('click', animatePlayback);
video.addEventListener('mouseover', showControls);
video.addEventListener('mouseleave', hideControls);
video.addEventListener('dblclick', toggleFullScreen);
videoContainer.addEventListener("mousemove", function() {
    clearTimeout(timeout);
    document.body.style.cursor = "";
    showControls();
    timeout = setTimeout(function() {
                document.body.style.cursor = "none";
                hideControls();
              }, 2000);
});
videoControls.addEventListener('mouseover', showControls);
videoControls.addEventListener('mouseleave', hideControls);
seek.addEventListener('mousemove', updateSeekTooltip);
seek.addEventListener('input', skipAhead);
volume.addEventListener('input', updateVolume);
volume.addEventListener("mousewheel", function(e) {
// cross-browser wheel delta
e = window.event || e;
var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

if (delta ==  1){volume.value = Number(volume.value) + 0.10; updateVolume();}
if (delta == -1){volume.value = Number(volume.value) - 0.10; updateVolume();}

    e.preventDefault();
});
volumeButton.addEventListener('click', toggleMute);
fullscreenButton.addEventListener('click', toggleFullScreen);
pipButton.addEventListener('click', togglePip);
document.addEventListener('DOMContentLoaded', () => {
  if (!('pictureInPictureEnabled' in document)) {
    pipButton.classList.add('hidden');
  }
});
document.addEventListener('keydown', keyboardShortcuts);
poster.addEventListener('click', function() {
poster.style.display = "none";
videoContainer.style.display = "";
video.autoplay = true;
video.load();
});
video.addEventListener('ended', function() {
poster.style.display = "";
videoContainer.style.display = "none";
});
setposter();