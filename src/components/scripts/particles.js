import * as THREE from "three";

let points;
(function(){
const particles = 20000;

const geometry = new THREE.BufferGeometry();

const positions = [];
const colors = [];
const color = new THREE.Color();

const n = 500,
  n2 = n / 2; // particles spread in the cube

for (let i = 0; i < particles; i++) {
  // positions

  const x = Math.random() * n - n2;
  const y = Math.random() * n - n2;
  const z = Math.random() * n - n2;

  positions.push(x, y, z);

  // colors

  const vx = 1;
  const vy = 1;
  const vz = 1;

  color.setRGB(vx, vy, vz);

  colors.push(color.r, color.g, color.b);
}

geometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);
geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

geometry.computeBoundingSphere();

//

const material = new THREE.PointsMaterial({ size: 1, vertexColors: true });

points = new THREE.Points(geometry, material);

})()

export{points}