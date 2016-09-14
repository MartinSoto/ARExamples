var videoElem = document.getElementById("video");
navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: 'environment'
  }
}).then((stream) => {
   videoElem.src = window.URL.createObjectURL(stream);
   videoElem.play();
});
