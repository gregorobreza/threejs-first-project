import "./style.css";

import * as THREE from "three";
import { getRandomArbitrary } from "./utils/utils";

import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { createNoise3D } from "simplex-noise";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  controls: TrackballControls,
  stats: Stats,
  circle: THREE.Object3D<THREE.Event>,
  skelet: THREE.Object3D<THREE.Event>,
  blob: THREE.Mesh<THREE.SphereGeometry, THREE.MeshNormalMaterial>;

const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
const windowHalf = new THREE.Vector2(
  window.innerWidth / 2,
  window.innerHeight / 2
);
const boxes: THREE.Mesh<THREE.BoxGeometry, THREE.MeshNormalMaterial>[] = [];
const spheres: THREE.Mesh<THREE.SphereGeometry, THREE.MeshNormalMaterial>[] =
  [];

const xMovementConstant = getRandomArbitrary(0.001, 0.1).toFixed(2);
const yMovementConstant = getRandomArbitrary(0.001, 0.1).toFixed(2);
const zMovementConstant = parseFloat(getRandomArbitrary(0.001, 0.1).toFixed(2));

const noise3D = createNoise3D();


init();
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );

  circle = new THREE.Object3D();
  skelet = new THREE.Object3D();

  const geom = new THREE.IcosahedronGeometry(7, 1);
  const geom2 = new THREE.IcosahedronGeometry(15, 1);

  const mat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
  });

  const mat2 = new THREE.MeshPhongMaterial({
    color: 0x080c1d,
    wireframe: true,
    side: THREE.DoubleSide,
  });

  const planet = new THREE.Mesh(geom, mat);
  planet.scale.x = planet.scale.y = planet.scale.z = 10;
  // planet.translateX(150)
  circle.add(planet);

  const planet2 = new THREE.Mesh(geom2, mat2);
  planet2.scale.x = planet2.scale.y = planet2.scale.z = 7;
  // planet2.translateX(150)
  skelet.add(planet2);

  const group = new THREE.Group();
  group.add(circle);
  group.add(skelet);
  group.position.z = 0;
  group.translateX(100);

  scene.add(group);

  //blob
  const blob_geometry = new THREE.SphereGeometry(10, 128, 128);
  const material = new THREE.MeshNormalMaterial();

  blob = new THREE.Mesh(blob_geometry, material);
  blob.scale.x = blob.scale.y = blob.scale.z = 7;
  blob.position.x = -100;
  blob.position.z = -500;
  scene.add(blob);


  const ambientLight = new THREE.AmbientLight(0x999999);
  scene.add(ambientLight);

  const lights = [];
  lights[0] = new THREE.DirectionalLight(0xffffff, 1);
  lights[0].position.set(1, 0, 0);
  lights[1] = new THREE.DirectionalLight(0x11e8bb, 1);
  lights[1].position.set(0.75, 1, 0.5);
  lights[2] = new THREE.DirectionalLight(0x8200c9, 1);
  lights[2].position.set(-0.75, -1, 0.5);
  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);

  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg") || undefined,
    antialias: true,
  });
  renderer.setClearColor(0x000000, 0.0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(280);

  stats = new Stats();
  document.body.appendChild(stats.dom);

  window.addEventListener("resize", onWindowResize);

  document.addEventListener("mousemove", onMouseMove, false);

  document.addEventListener("wheel", onMouseWheel, false);
}

function onMouseMove(event: any) {
  mouse.x = event.clientX - windowHalf.x;
  mouse.y = event.clientY - windowHalf.x;
}

function onMouseWheel(event: WheelEvent) {
  camera.position.z += event.deltaY * 0.05; // move camera along z-axis
}

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  windowHalf.set(width / 2, height / 2);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight;

  camera.aspect = aspect;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  controls.handleResize();
}

function blobAnimation() {
  // change '0.003' for more aggressive animation
  const time = performance.now() * 0.001;
  //console.log(time)

  //go through vertices here and reposition them

  // change 'k' value for more spikes
  const k = 1;
  const position = blob.geometry.attributes.position;
  const vector = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    let p = vector.fromBufferAttribute(position, i);
    // let p = blob.geometry.vertices[i];
    p.normalize().multiplyScalar(
      1 + 0.2 * noise3D(p.x * k + time, p.y * k, p.z * k)
    );
  }
  // blob.geometry.computeVertexNormals();
  blob.geometry.attributes.position.needsUpdate = true;
  blob.geometry.attributes.normal.needsUpdate = true;
}

function animate() {
  requestAnimationFrame(animate);

  target.x = (1 - mouse.x) * 0.0002;
  target.y = (1 - mouse.y) * 0.0002;

  camera.rotation.x += 0.03 * (target.y - camera.rotation.x);
  camera.rotation.y += 0.03 * (target.x - camera.rotation.y);

  circle.rotation.x -= 0.002;
  circle.rotation.y -= 0.003;
  skelet.rotation.x -= 0.001;
  skelet.rotation.y += 0.005;

  blobAnimation()
  renderer.clear();

  stats.update();

  renderer.render(scene, camera);
}
