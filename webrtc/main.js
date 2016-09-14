var videoElem = document.getElementById("video");
navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: {exact: 'environment'}
  }
}).then((stream) => {
   videoElem.src = window.URL.createObjectURL(stream);
   videoElem.play();
});
