import "./index.css";

import * as THREE from "three";
import { getRandomArbitrary } from "./utils/utils";

import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import Stats from "three/addons/libs/stats.module.js";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  controls: TrackballControls,
  stats: Stats,
  circle: THREE.Object3D<THREE.Event>,
  skelet: THREE.Object3D<THREE.Event>,
  particle: THREE.Object3D<THREE.Event>;

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
  particle = new THREE.Object3D();

  // scene.add(circle);
  // scene.add(skelet);
  scene.add(particle);

  const geometry = new THREE.TetrahedronGeometry(2, 0);
  const geom = new THREE.IcosahedronGeometry(7, 1);
  const geom2 = new THREE.IcosahedronGeometry(15, 1);

  const material2 = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    // shading: THREE.FlatShading,
    flatShading: true,
  });

  for (let i = 0; i < 500; i++) {
    const mesh = new THREE.Mesh(geometry, material2);
    mesh.position
      .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .normalize();
    mesh.position.multiplyScalar(90 + Math.random() * 200);
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    particle.add(mesh);
  }

  const mat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
  });

  const mat2 = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    wireframe: true,
    side: THREE.DoubleSide,
  });

  const planet = new THREE.Mesh(geom, mat);
  planet.scale.x = planet.scale.y = planet.scale.z = 8;
  // planet.translateX(150)
  circle.add(planet);

  const planet2 = new THREE.Mesh(geom2, mat2);
  planet2.scale.x = planet2.scale.y = planet2.scale.z = 5;
  // planet2.translateX(150)
  skelet.add(planet2);

  const group = new THREE.Group();
  group.add(circle);
  group.add(skelet);
  group.translateX(100)

  scene.add(group);

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

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(10);

  const material = new THREE.MeshNormalMaterial();

  for (let i = 0; i < 500; i++) {
    const box = new THREE.Mesh(boxGeometry, material);
    // box.position.x = Math.random() * (280 - 140);
    // box.position.y = Math.random() * (280 - 140);
    // box.position.z = Math.random() * (200 - 100);
    // box.rotation.x = Math.random() * 2 * Math.PI;
    // box.rotation.y = Math.random() * 2 * Math.PI;
    // box.rotation.z = Math.random() * 2 * Math.PI;
    box.position
      .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .normalize();
    box.position.multiplyScalar(90 + Math.random() * 700);
    box.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    // box.updateMatrix();
    // box.matrixAutoUpdate = false;
    scene.add(box);
    boxes.push(box);
  }

  const sphere = new THREE.Mesh(sphereGeometry, material);
  sphere.position.x = Math.random() * (70 - 35);
  sphere.position.y = 0;
  sphere.position.z = 0;
  // sphere.rotation.x = Math.random() * 2 * Math.PI;
  // sphere.rotation.y = Math.random() * 2 * Math.PI;
  // sphere.rotation.z = Math.random() * 2 * Math.PI;
  scene.add(sphere);
  spheres.push(sphere);

  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg") || undefined,
    antialias: true,
  });
  renderer.setClearColor(0x000000, 0.0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(500);

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

// function onMouseWheelSmooth(event: any) {
//   // camera.position.z += event.deltaY * 0.02; // move camera along z-axis
// console.log(event)
//   const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail))); // Get scroll direction and speed
//   const targetPosition = {z: camera.position.z + delta * 0.02}
//   console.log(targetPosition)
//   // Animate the camera position
//   cameraTween.stop(); // Stop any ongoing tween
//   cameraTween.to(targetPosition, 200).start(); // Adjust the duration (200) to match the tween object's duration
//   renderer.render(scene, camera);
// }

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  windowHalf.set(width / 2, height / 2);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

// function createControls(camera: THREE.PerspectiveCamera) {
//   controls = new TrackballControls(camera, renderer.domElement);

//   controls.rotateSpeed = 0.5;
//   // controls.noRotate = true
//   controls.noPan = true
//   controls.zoomSpeed = 1.0;
//   // controls.panSpeed = 0.8;

//   controls.keys = ["KeyA", "KeyS", "KeyD"];
// }

function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight;

  camera.aspect = aspect;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  controls.handleResize();
}

function animate() {
  requestAnimationFrame(animate);

  const timer = 0.0001 * Date.now();

  for (let i = 0, il = boxes.length; i < il; i++) {
    const box = boxes[i];

    box.position.x = 30 * Math.cos(timer * 0.03 + i);
    box.position.y = 30 * Math.sin(timer * 0.05 + i * 1.1);

    box.rotation.x = 30 * Math.cos(timer * 0.05 + i);
    box.rotation.y = 30 * 1.2 * Math.sin(timer * 0.05 + i);
    box.rotation.z = 30 * Math.cos(timer * 0.05 + i);
  }

  target.x = (1 - mouse.x) * 0.0002;
  target.y = (1 - mouse.y) * 0.0002;

  camera.rotation.x += 0.05 * (target.y - camera.rotation.x);
  camera.rotation.y += 0.05 * (target.x - camera.rotation.y);


  circle.rotation.x -= 0.002;
  circle.rotation.y -= 0.003;
  skelet.rotation.x -= 0.001;
  skelet.rotation.y += 0.005;
  renderer.clear();

  stats.update();

  renderer.render(scene, camera);
}
