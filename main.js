var renderer, scene, camera, composer, antObj;
var step = 0;
var stepsPerFrame = 1;
var floor = new THREE.Object3D();
var ant = {x: 0, z: 0, dir: 0};
var directions = [1,-1,1,1,-1,-1,1,-1,1];
var grid = {};
var colors = [
	'#3891A6', //cyan
  '#DB5461', //red
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
];

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

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(-10, 10, -10);
  camera.lookAt(new THREE.Vector3(0,0,0));

    // Moure camera
  controls = new THREE.OrbitControls( camera, renderer.domElement );

  scene.add(camera);
  
  scene.add(floor);
  
  antObj = addCube({
        'x': 0, 
        'y': 1, 
        'z': 0,
        'size': 0.95,
        'color': '#222'
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

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function addCube({x = 0, y = 0, z = 0, color=0x990099, size=0.95} = {}) {
  var roundedBoxGeometry = createBoxWithRoundedEdges(size, size, size, .15, 3);
  roundedBoxGeometry.computeVertexNormals();  

  var mat = new THREE.MeshPhongMaterial({
    'color': color
  });
  var tile = new THREE.Mesh(roundedBoxGeometry, mat);
  tile.position.x = x + 0.5;
  tile.position.y = y + 0.5;
  tile.position.z = z + 0.5;
  tile.name = '('+x+','+z+')';
  return tile;
}
function move(steps = 1){
  step += steps;
  document.getElementById('step').textContent = step;
  for(let i=0; i<steps; i++) nextStep();
}
function nextStep() {
  let x = ant.x.toString();
  let z = ant.z.toString();
  antObj.position.x = ant.x;
  antObj.position.z = ant.z;
  if(grid[x] == undefined) grid[x] = {};
  if(grid[x][z] == undefined) {
    grid[x][z] = -1;
  }
  floor.remove(floor.getObjectByName( '('+x+','+z+')' ));
  floor.add(addCube({
        'x': parseInt(x), 
        'y': 0, 
        'z': parseInt(z),
        'color': colors[((grid[x][z]+1) % directions.length) % colors.length]
      }));
  grid[x][z] = (grid[x][z]+1) % directions.length;
  let deg = (directions[grid[x][z]] * 90 + ant.dir) % 360;
  ant.x += Math.round(Math.cos((deg*Math.PI)/180));
  ant.z += Math.round(Math.sin((deg*Math.PI)/180));
  ant.dir = deg;
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


// Cool effect with mouse hovering
var mouse = {x:0,y:0};
var cameraMoves = {x:0,y:0,z:-0.1,move:false,speed:0.2};


function mouseMove(e){

camera.position.x += Math.max(Math.min((e.clientX - mouse.x) * 0.01, cameraMoves.speed), -cameraMoves.speed);
camera.position.z -= Math.max(Math.min((mouse.y - e.clientY) * 0.01, cameraMoves.speed), -cameraMoves.speed);

    mouse.x = e.clientX;
    mouse.y = e.clientY;

}

window.addEventListener('mousemove', mouseMove);
