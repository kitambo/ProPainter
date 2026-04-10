const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");
const result = document.getElementById("result");

const chatInput = document.getElementById("chatInput");
const chatOutput = document.getElementById("chatOutput");

let capturedImage = "";

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
}

function captureImage() {
  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  capturedImage = canvas.toDataURL("image/png");
  preview.src = capturedImage;
}

async function sendChat() {
  const message = chatInput.value.trim();
  if (!message) return;

  chatOutput.textContent = "Rispondo...";

  const res = await fetch("/api/respond", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  chatOutput.textContent = data.reply || data.error || "Errore";
}

async function transformImage() {
  if (!capturedImage) {
    alert("Prima cattura un'immagine.");
    return;
  }

  result.alt = "Elaborazione in corso";

  const res = await fetch("/api/transform", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: capturedImage }),
  });

  const data = await res.json();
  if (data.image) {
    result.src = data.image;
  } else {
    alert(data.error || "Errore durante la trasformazione");
  }
}

document.getElementById("startCameraBtn").addEventListener("click", startCamera);
document.getElementById("captureBtn").addEventListener("click", captureImage);
document.getElementById("transformBtn").addEventListener("click", transformImage);
document.getElementById("sendBtn").addEventListener("click", sendChat);
