// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

var fileInput = document.querySelector('input[type="file"]');
var canvas = document.getElementById("user-image");
var ctx = canvas.getContext("2d");
var form = document.getElementById("generate-meme");
var submit = form.elements[3];
var reset = form.elements[4];
var read = form.elements[5];
var voiceSelect = form.elements["voices"];
var slider = document.querySelector('input[type="range"]');
var sliVal = slider.value;


// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', function(){
  ctx.clearRect(0, 0, 400, 400);
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,400,400);
  ctx.drawImage(img, getDimmensions(400,400,img.width,img.height).startX, getDimmensions(400,400,img.width,img.height).startY,
                getDimmensions(400,400,img.width,img.height).width, getDimmensions(400,400,img.width,img.height).height);
});

//Change event
fileInput.addEventListener('change', function(e) {
  const url = URL.createObjectURL(e.target.files[0]);
  img.src = url;
  img.alt = fileInput.name;
});

//Submit event
submit.addEventListener('click', function(e){
  var txTop = form.elements["textTop"].value;
  var txBot = form.elements["textBottom"].value;
  ctx.font = "40px Impact";
  ctx.textAlign = "center";
  ctx.fillText(txTop, 200, 50);
  ctx.fillText(txBot, 200, 400);
  submit.disabled = true;
  reset.disabled = false;
  read.disabled = false;
  voiceSelect.disabled = false;
  e.preventDefault();
});

//Read event and voice list options
var synth = window.speechSynthesis;
var voices = [];
function popVoiceList() {
  voices = synth.getVoices();
  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }
    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

popVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = popVoiceList;
}

read.addEventListener('click', function(e) {
  e.preventDefault();
  var txTop = form.elements["textTop"].value;
  var txBot = form.elements["textBottom"].value;
  var top = new SpeechSynthesisUtterance(txTop);
  var bot = new SpeechSynthesisUtterance(txBot);
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      top.voice = voices[i];
      bot.voice = voices[i];
    }
  }
  sliVal = slider.value;
  top.volume = sliVal/100;
  bot.volume = sliVal/100;
  synth.speak(top);
  synth.speak(bot);
});

//Slider control
slider.addEventListener('input', function(e){
  sliVal = slider.value;
  if(sliVal == 0){
    document.querySelector("div>img").src = "icons/volume-level-0.svg";
    document.querySelector("div>img").alt = "Volume Level 0";
  } else if (sliVal < 34){
    document.querySelector("div>img").src = "icons/volume-level-1.svg";
    document.querySelector("div>img").alt = "Volume Level 1";
  } else if (sliVal < 67){
    document.querySelector("div>img").src = "icons/volume-level-2.svg";
    document.querySelector("div>img").alt = "Volume Level 2";
  } else {
    document.querySelector("div>img").src = "icons/volume-level-3.svg";
    document.querySelector("div>img").alt = "Volume Level 3";
  }
});

//Clear event
reset.addEventListener('click', function(e){
  ctx.clearRect(0,0,400,400);
  reset.disabled = true;
  read.disabled = true;
  voiceSelect.disabled = true;
  submit.disabled = false;
  e.preventDefault();
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
