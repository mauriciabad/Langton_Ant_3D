var renderer, scene, camera, composer, antObj;
var materials = [];
var pendingSteps = 0;
var step = 0;
var stepsPerFrame =  100;
if(localStorage.stepInputValue) {
  setStep(localStorage.stepInputValue);
  document.getElementById('speed').value = localStorage.stepInputValue;
}
var floor = new THREE.Object3D();
floor.name = 'floor';
var ant = {x: 0, z: 0, dir: 0};
var directions = [1,-1,-1,1];
// var directions = [1,1,1,-1,-1,1,1,1];
// var directions = [1,1,1,1,-1,1,1,1,1];
// var directions = [1,-1,1];
// var directions = [-1,1,1,1,1,1,1,-1,-1,1];
// var directions = [1,1,-1,-1,-1,1,-1,1,-1,-1,1];
// var directions = [1,1,-1,-1,-1,1,-1,1,-1,1,1,-1];
// var directions = [1,1,-1,-1,-1,1,-1,-1,-1,1,1,1];
var grid = {};
var changed = {};
var colors = [
  '#DB5461', //red
  '#3891A6', //cyan
  '#018E42', //green
  '#e0ca2c', //yellow
  '#F896D8', //pink
  '#DBD3AD', //white
  '#87CBAC', //blue ice
  '#F48D2C', //orange
  '#3878af', //blue dark
  '#9b4d9a', //purple
  '#AD8350', //brown
  '#4B5267', //gray
  '#D2FF0A', //green fluorescent
  '#9FDC70', //green smooth
  '#FF8383', //pink intense
  '#F79223', //orange intense
];
var antMaterial = new THREE.MeshPhongMaterial( { color: '#555'} );

for (var col of colors) {
  materials.push(new THREE.MeshPhongMaterial( { color: col} ));
}

var roundedBoxGeometry = createBoxWithRoundedEdges(0.95, 0.95, 0.95, .15, 2);
roundedBoxGeometry.computeFaceNormals();
// roundedBoxGeometry.computeVertexNormals();

window.onload = function() {
  init();
  animate();
}

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);
  document.getElementById('canvas').appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.set(-20, 20, -20);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // Move camera
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.enableKeys = false;

  scene.add(camera);
  
  scene.add(floor);
  
  antObj = addCube({
    'x': 0, 'y': 1, 'z': 0,
    'material': antMaterial
  });
  scene.add(antObj);
  
  var ambientLight = new THREE.AmbientLight(0x999999 );
  scene.add(ambientLight);
  
  var lights = [];
  lights[0] = new THREE.DirectionalLight( 0xffffff, 0.8);
  lights[0].position.set( -3, 3, -3 );
  scene.add( lights[0] );
  
  window.addEventListener('resize', onWindowResize, false);
  
};

function animate() {
  requestAnimationFrame(animate);

  move(stepsPerFrame);
  renderer.clear();
  renderer.render(scene,camera);
};

function setStep(x) {
  let y = (x**6 / 10000**5 + x/10000)/1.0001; 
  if(!isNaN(y) && y >= 0) { stepsPerFrame = y; localStorage.stepInputValue = parseFloat(x); }
}


function setDirections(dir2) {
  if(/[^Rr1Ll0]/.test(dir2)) {
    console.log('Invalid characters!');
  }
  else {
    dir2Array = Array.from(dir2).map((elem) => (elem == 'R' || elem == 'r' || elem == '1' ? 1 : -1));
    if (JSON.stringify(directions) !== JSON.stringify(dir2Array)) {
      let changed = false;
      for (let num of dir2Array)
      pendingSteps = 0;
      step = 0;
      scene.remove( scene.getObjectByName('floor') );
      floor = new THREE.Object3D();
      floor.name = 'floor';
      scene.add(floor);
      grid = {};
      directions = dir2Array;
      ant = {x: 0, z: 0, dir: 0};
      moveAnt(0,0)
      renderer.clear();
      renderer.render(scene,camera);
    }
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function addCube({x = 0, y = 0, z = 0, color=0,material} = {}) {
  var tile = new THREE.Mesh(roundedBoxGeometry, (material) ? material : materials[color%materials.length]);
  tile.position.x = x + 0.5;
  tile.position.y = y + 0.5;
  tile.position.z = z + 0.5;
  tile.name = '('+x+','+z+')';
  return tile;
}

function move(steps = 1){
  pendingSteps += steps;
  let stepsToMove = Math.floor(pendingSteps);
  pendingSteps -= stepsToMove;
  step += stepsToMove;
  document.getElementById('step').textContent = step;

  changed = {};

  for(let i=0; i<stepsToMove; i++) nextStep();

  for (let x in changed) {
    for (let z in changed[x]) {
      let cubeToChange = floor.getObjectByName( '('+x+','+z+')' )
      if (cubeToChange) {
        cubeToChange.material = materials[changed[x][z]%materials.length];
      }
      else {
        floor.add(addCube({
          'x': parseInt(x), 'y': 0, 'z': parseInt(z),
          'color': changed[x][z]
        })); 
      }
    }
  }
}
function nextStep() {
  let x = ant.x.toString();
  let z = ant.z.toString();
  moveAnt(ant.x, ant.z);

  if(grid[x] == undefined) {
    grid[x] = {};
  }
  if(grid[x][z] == undefined) {
    grid[x][z] = -1;
  }
  if (changed[x] == undefined) {
    changed[x] = {};
  }
  changed[x][z] = (grid[x][z]+1) % directions.length;
  grid[x][z] = (grid[x][z]+1) % directions.length;
  let deg = (directions[grid[x][z]] * 90 + ant.dir) % 360;
  ant.x += Math.round(Math.cos((deg*Math.PI)/180));
  ant.z += Math.round(Math.sin((deg*Math.PI)/180));
  ant.dir = deg;
}
function moveAnt(x=0,z=0) {
  antObj.position.x = x + 0.5;
  antObj.position.z = z + 0.5;
}

function createBoxWithRoundedEdges( width, height, depth, radius0, smoothness ) {
  let shape = new THREE.Shape();
  let eps = 0.00001;
  let radius = radius0 - eps;
  shape.absarc( eps, eps, eps, -Math.PI / 2, -Math.PI, true );
  shape.absarc( eps, height -  radius * 2, eps, Math.PI, Math.PI / 2, true );
  shape.absarc( width - radius * 2, height -  radius * 2, eps, Math.PI / 2, 0, true );
  shape.absarc( width - radius * 2, eps, eps, 0, -Math.PI / 2, true );
  let geometry = new THREE.ExtrudeBufferGeometry( shape, {
    depth: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness
  });
  geometry.center();
  return geometry;
}

