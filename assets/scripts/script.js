// INITIAL DATA
let currentColor = document.querySelector("#color-selector");
let drawing = false;
let canvasScreen = document.querySelector("#canvas");
let context = canvasScreen.getContext("2d");
let mouseX = 0;
let mouseY = 0;
let lineText = document.querySelector(".line-text");
let lineSize = document.querySelector("#line-size");

// EVENTS
document.querySelectorAll(".color-space").forEach(item => item.addEventListener("mousedown", colorSpaces));
document.querySelector(".clear-tools .btn").addEventListener("click", clearCanvas);
document.querySelector(".download-tools .btn").addEventListener("click", downloadFile);
canvasScreen.addEventListener("mousedown", onMouseDown);
canvasScreen.addEventListener("mousemove", onMouseMove);
canvasScreen.addEventListener("mouseup", onMouseUp);
lineSize.addEventListener("input", updateText);

// FUNCTIONS
// Color Space
function colorSpaces(e) {
  let colorSelectorWrapper = document.querySelector(".color-selector-wrapper");

  if (e.which === 1) { //Left click - pick color
    colorSelectorWrapper.style.backgroundColor = e.currentTarget.getAttribute("data-color");
    currentColor.value = e.currentTarget.getAttribute("data-color");
  }
  else if (e.which === 3) { //Right click - save color
    e.currentTarget.oncontextmenu = () => false;
    e.currentTarget.setAttribute("data-color", currentColor.value);
    e.currentTarget.style.backgroundColor = currentColor.value;
  }   
}

// Pressing mouse button
function onMouseDown(e) {
  drawing = true;
  mouseX = e.pageX - canvasScreen.offsetLeft;
  mouseY = e.pageY - canvasScreen.offsetTop;
}

// Moving mouse
function onMouseMove(e) {
  let xPos = document.querySelector(".tracking-tools").firstElementChild;
  let yPos = document.querySelector(".tracking-tools").lastElementChild;
  let xValue = e.pageX - canvasScreen.offsetLeft;
  let yValue = e.pageY - canvasScreen.offsetTop;

  if((drawing) && ((xValue > 0) && (xValue <= 800) && (yValue > 0) && (yValue <= 400))) {
    draw(xValue, yValue);
  } else {
    drawing = false;
  }

  xValue = ("00" + Math.min(xValue, 800)).slice(-3);
  yValue = ("00" + Math.min(yValue, 400)).slice(-3);
  xPos.innerHTML = `x: ${xValue}`
  yPos.innerHTML = `y: ${yValue}`
}

// Releasing mouse button=
function onMouseUp() {
  drawing = false;
}

// Draw on canvas
function draw(xPos, yPos) {
  context.beginPath(); //começa o desenho
  context.lineWidth = lineSize.value; //grossura
  context.lineJoin = "round";  //tipo do traço
  context.moveTo(mouseX - 2, mouseY - 2); //move o cursor
  context.lineTo(xPos - 2, yPos - 2); //desenha até o ponto
  context.closePath(); //finaliza o traço
  context.strokeStyle = currentColor.value; //cor do traço
  context.stroke(); //finaliza o processo

  mouseX = xPos;
  mouseY = yPos;
}

// Clear canvas' screen
function clearCanvas() {
  context.setTransform(1, 0, 0, 1, 0, 0); //limpa o cursor
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  setCanvas();
}

// Set canvas background as white
function setCanvas() {
  context.beginPath();
  context.rect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = "#ffffff";
  context.fill();
  context.closePath();
}

// Update line width text
function updateText(e) {
  let size = ("0" + e.target.value).slice(-2);
  lineText.innerHTML = `Largura da linha: ${size}px`
}

// Download canvas image
function downloadFile() {
  let d = new Date();

  let h = d.getHours();
  let min = d.getMinutes();
  let s = d.getSeconds();
  let y = d.getFullYear();
  let mon = d.getMonth()+1;
  let day = d.getDate();
  let filename = `image-${day}-${mon}-${y}-${h}-${min}-${s}.png`;

  let link = document.createElement("a"), e;
  link.download = filename;
  link.href = canvasScreen.toDataURL("image/png;base64");

  /// create a "fake" click-event to trigger the download
  if (document.createEvent) {
    e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window,
                     0, 0, 0, 0, 0, false, false, false,
                     false, 0, null);

    link.dispatchEvent(e);
  } else if (link.fireEvent) {
    link.fireEvent("onclick");
  }
}

setCanvas();
lineText.innerHTML = `Largura da linha: ${lineSize.value}px`