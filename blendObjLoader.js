"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

/*global THREE, Coordinates, $, document, window, dat*/

var camera, scene, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock();
var gridX = false;
var gridY = false;
var gridZ = false;
var axes = false;
var ground = true;

function init() {
    var canvasWidth = 846;
    var canvasHeight = 494;
    // For grading the window is fixed in size; here's general code:
    //var canvasWidth = window.innerWidth;
    //var canvasHeight = window.innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0xAAAAAA, 1.0);

    // CAMERA
    camera = new THREE.PerspectiveCamera(45, canvasRatio, 1, 40000);
    // CONTROLS
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);

    camera.position.set(-480, 659, -619);
    cameraControls.target.set(4, 301, 92);

    fillScene();
}

function createObj() {
    var loader = new THREE.OBJLoader();
    var matloader = new THREE.MTLLoader();
    matloader.path = 'spoopytext/';
    matloader.load('spoopy.mtl', function(materials) {
        materials.preload();
        loader.setMaterials(materials);
        loader.path = 'spoopytext/';
        loader.load('spoopy.obj', function(object) {
            scene.add(object);
        });
    });
}

function fillScene() {
    // SCENE
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x775817, 1, 4000);
    // LIGHTS
    var ambientLight = new THREE.AmbientLight(0x444444);
    var light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(200, 400, 500);

    var light2 = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light2.position.set(-400, 200, -300);

    scene.add(ambientLight);
    scene.add(light);
    scene.add(light2);

    if (ground) {
        Coordinates.drawGround({ size: 1000 });
    }
    if (gridX) {
        Coordinates.drawGrid({ size: 1000, scale: 0.01 });
    }
    if (gridY) {
        Coordinates.drawGrid({ size: 1000, scale: 0.01, orientation: "y" });
    }
    if (gridZ) {
        Coordinates.drawGrid({ size: 1000, scale: 0.01, orientation: "z" });
    }
    if (axes) {
        Coordinates.drawAllAxes({ axisLength: 300, axisRadius: 2, axisTess: 50 });
    }
    createObj();
}
//
function addToDOM() {
    var container = document.getElementById('obj');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length > 0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild(renderer.domElement);
}

function animate() {
    window.requestAnimationFrame(animate);
    render();
}

function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);
    if (effectController.newGridX !== gridX || effectController.newGridY !== gridY || effectController.newGridZ !== gridZ || effectController.newGround !== ground || effectController.newAxes !== axes) {
        gridX = effectController.newGridX;
        gridY = effectController.newGridY;
        gridZ = effectController.newGridZ;
        ground = effectController.newGround;
        axes = effectController.newAxes;

        fillScene();
    }
    renderer.render(scene, camera);
}

function setupGui() {

    effectController = {

        newGridX: gridX,
        newGridY: gridY,
        newGridZ: gridZ,
        newGround: ground,
        newAxes: axes
    };

    var gui = new dat.GUI();
    gui.add(effectController, "newGridX").name("Show XZ grid");
    gui.add(effectController, "newGridY").name("Show YZ grid");
    gui.add(effectController, "newGridZ").name("Show XY grid");
    gui.add(effectController, "newGround").name("Show ground");
    gui.add(effectController, "newAxes").name("Show axes");
}

try {
    init();
    setupGui();
    addToDOM();
    animate();
} catch (e) {
    var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
    $('#container').append(errorReport + e);
}