"use strict";
//global variables
const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvasBtn = document.querySelector(".clear-canvas"),
  saveAsImgBtn = document.querySelector(".save-img");
//veriebles
let ctx = canvas.getContext("2d"),
  isDrawing = false,
  brushWidth = 5,
  selectedTool = "brush",
  prevMouseX,
  prevMouseY,
  snapshot,
  selectedColor = "#000";

//set canvas bg color
const setCanvasBg = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

//set canvas width and height
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBg();
});
//start drawing
const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  console.log(snapshot);
};
//drawing rectangle
const drawRectangle = (e) => {
  !fillColor.checked
    ? ctx.strokeRect(
        prevMouseX,
        prevMouseY,
        e.offsetX - prevMouseX,
        e.offsetY - prevMouseY
      )
    : ctx.fillRect(
        prevMouseX,
        prevMouseY,
        e.offsetX - prevMouseX,
        e.offsetY - prevMouseY
      );
  // if (!fillColor.checked) {
  //   return ctx.strokeRect(
  //     prevMouseX,
  //     prevMouseY,
  //     e.offsetX - prevMouseX,
  //     e.offsetY - prevMouseY
  //   );
  // } else {
  //   ctx.fillRect(
  //     prevMouseX,
  //     prevMouseY,
  //     e.offsetX - prevMouseX,
  //     e.offsetY - prevMouseY
  //   );
  // }
};

//drawing circle
const drawCircle = (e) => {
  ctx.beginPath();
  const radius = Math.sqrt(
    Math.pow(e.offsetX - prevMouseX, 2) + Math.pow(e.offsetY - prevMouseY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};
//drawing triangle
const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  ctx.stroke();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

//drawing
const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);
  switch (selectedTool) {
    case "brush":
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
    case "rectangle":
      drawRectangle(e);
      break;
    case "circle":
      drawCircle(e);
      break;
    case "triangle":
      drawTriangle(e);
      break;
    case "eraser":
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      break;
    default:
      break;
  }
};

//tool buttons
toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    console.log(`selected tool: ${selectedTool}`);
  });
});

//size slider
sizeSlider.addEventListener("change", () => {
  brushWidth = sizeSlider.value;
});

//color buttons
colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    const bgColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
    selectedColor = bgColor;
  });
});
//color picker
colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.backgroundColor = colorPicker.value;
  selectedColor = colorPicker.value;
  // colorPicker.parentElement.click();
});

//clear canvas
clearCanvasBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBg();
});

//save as img
saveAsImgBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `paint(${Date.now()}).jpg`;
  link.href = canvas.toDataURL();
  link.click();
});
//stop drawing
const stopDraw = () => {
  isDrawing = false;
};

//event listeners
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDraw);
