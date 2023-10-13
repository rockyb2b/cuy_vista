import { Cuy } from './cuy_class.js';

window.cuy_objeto = new Cuy();
window.cuy_objeto.INICIAR_RENDER();

// // // Create a scene, camera, and renderer
// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// var renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Create a Catmull-Rom spline curve
// // var points = [
// //     new THREE.Vector3(-5, 0, 0),
// //     new THREE.Vector3(-2.5, 5, 0),
// //     new THREE.Vector3(0, 0, 0),
// //     new THREE.Vector3(2.5, 5, 0),
// //     new THREE.Vector3(5, 0, 0)
// // ];
// var posicion_actual = 
//             {
//                 x : 0,
//                 y : 0,
//                 z : 0
//             };
// // var curve = new THREE.CatmullRomCurve3(points);
// var totalDuration = 12;

// var curve = new THREE.CatmullRomCurve3(puntos_azar(posicion_actual,totalDuration));

// // Create an object (e.g., a mesh) that you want to animate along the curve
// var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
// var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// var object = new THREE.Mesh(geometry, material);

// // Add the object to the scene
// scene.add(object);

// // // Set up animation parameters
// // // Set up animation parameters
// // // Set up a Clock
// var clock = new THREE.Clock();
// var speedMultiplier = 2; // Increase this value to increase the speed
// function animate() {
//     var elapsedSeconds = clock.getElapsedTime();
//     // var normalizedTime = elapsedSeconds / totalDuration;
//     var normalizedTime = (elapsedSeconds / totalDuration);
//     if (normalizedTime <= 1.0) {
//         var position = curve.getPointAt(normalizedTime);
//         object.position.copy(position);
//         renderer.render(scene, camera);
//         requestAnimationFrame(animate);
//     }
// }
// animate();
// // // Set up camera position
//  camera.position.z = 10;

// // // Set up camera look at
// camera.lookAt(new THREE.Vector3(0, 0, 0));



// // // window.cuy_objeto = new Cuy();
// // // window.cuy_objeto.INICIAR_RENDER();
// function generar_nueva_posicion_random2(rango){
//     var randomx = Math.random() >= 0.5 ? Math.abs(parseFloat(random_posicion(0, rango))) : -Math.abs(parseFloat(random_posicion(0,rango))) ;  // rango x=> -2.5  a   2.5 
//     var randomz = Math.random() >= 0.5 ? Math.abs(parseFloat(random_posicion(0, rango))) : -Math.abs(parseFloat(random_posicion(0, rango))); // rango z=> -2.5  a   2.5
//     var randomy = Math.random() >= 0.5 ? Math.abs(parseFloat(random_posicion(0, rango))) : -Math.abs(parseFloat(random_posicion(0, rango))); // rango z=> -2.5  a   2.5
//     var b = { x: randomx, y: randomy, z: randomz  };
//     return b;
// }
// function puntos_azar(desde ,spline_control_points){
//     var arrayvector = [];
//     arrayvector.push(new THREE.Vector3(desde.x,0,desde.z));
//     for(var a = 0 ; a < parseInt(spline_control_points) ; a++ ){
//         let nuevo = generar_nueva_posicion_random2(2.35);
//         arrayvector.push(new THREE.Vector3(nuevo.x,nuevo.y,nuevo.z))
//     }
//     return arrayvector;
// }
// function random_posicion(min, max) {
//     return ((Math.random() * (max - min)) + min).toFixed(2);
// }