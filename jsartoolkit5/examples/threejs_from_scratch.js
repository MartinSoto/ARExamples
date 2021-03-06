var cMat = new THREE.Matrix4();
var tMat = new THREE.Matrix4();

var USE_SHADER = true;

var shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    cameraMatrix: {type: 'm4', value: cMat },
    transformationMatrix: {type: 'm4', value: tMat }
  },
  vertexShader: vert.text,
  fragmentShader: frag.text
});


var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();

renderer.setSize(v.width, v.height);

document.body.appendChild(renderer.domElement);

// Create a camera and a marker root object for your Three.js scene.
var camera = new THREE.Camera();
scene.add(camera);

var light = new THREE.PointLight(0xffffff);
light.position.set(400, 500, 100);
scene.add(light);
var light = new THREE.PointLight(0xffffff);
light.position.set(-400, -500, -100);
scene.add(light);

var markerRoot = new THREE.Object3D();

markerRoot.wasVisible = false;
markerRoot.markerMatrix = new Float64Array(12);
markerRoot.matrixAutoUpdate = false;
camera.matrixAutoUpdate = false;

// Add the marker models and suchlike into your marker root object.
var cube = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  USE_SHADER ?
    shaderMaterial :
    new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: false })
);
markerRoot.add(cube);

// Add the marker root to your scene.
scene.add(markerRoot);
var arController = null;

var video = document.getElementById('v');
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.src = window.URL.createObjectURL(stream);
  video.play();
});

// On every frame do the following:
function tick() {
  requestAnimationFrame(tick);

  if (!arController) {
    return;
  }

  arController.detectMarker(video);
  var markerNum = arController.getMarkerNum();
  if (markerNum > 0) {
    if (markerRoot.visible) {
      arController.getTransMatSquareCont(0, 1, markerRoot.markerMatrix, markerRoot.markerMatrix);
    } else {
      arController.getTransMatSquare(0 /* Marker index */, 1 /* Marker width */, markerRoot.markerMatrix);
    }
    markerRoot.visible = true;
    if (USE_SHADER) {
      arController.transMatToGLMat(markerRoot.markerMatrix,
                                   shaderMaterial.uniforms.transformationMatrix.value.elements);
    } else {
      arController.transMatToGLMat(markerRoot.markerMatrix,
                                   markerRoot.matrix.elements);
    }
  } else {
    markerRoot.visible = false;
  }

  arController.debugDraw();

  // Render the scene.
  renderer.autoClear = false;
  renderer.clear();
  renderer.render(scene, camera);
}

tick();

var cameraParam = new ARCameraParam();
cameraParam.onload = function() {

  arController = new ARController(320, 240, cameraParam);
  arController.debugSetup();

  var camera_mat = arController.getCameraMatrix();

  if (USE_SHADER) {
    shaderMaterial.uniforms.cameraMatrix.value.elements.set(camera_mat);
  } else {
    camera.projectionMatrix.elements.set(camera_mat);
  }

};
cameraParam.load('Data/camera_para.dat');
