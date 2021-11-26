import '../dist/tailwind.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { AxesHelper, DirectionalLightHelper, Vector3 } from 'three'

// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

var target;
var scale = 0.006;
const loader = new GLTFLoader()
loader.load( './models/fourthTry.glb', function ( gltf ) {
    target = gltf.scene.children[2];
    target.scale.set(scale, scale, scale)
    target.position.set(0,0,0)
    scene.add( gltf.scene );
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.target = target;
    scene.add( directionalLight);
});


const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );

/**
 * Sizes
 */
const sizes = {
    width: document.getElementById("canvas").offsetWidth,
    height: document.getElementById("canvas").offsetHeight
}
console.log(sizes)

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width =  document.getElementById("canvas").offsetWidth
    sizes.height = document.getElementById("canvas").offsetHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0,0.8,1.4)
scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.target = new THREE.Vector3(0,0.5,0)
controls.autoRotate = true;
controls.autoRotateSpeed = 1.2;
controls.enableRotate = false
controls.enableZoom = false
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setClearColor( 0xffffff );
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{
  
    // cube.position.copy(pathTarget)
    //camera.position.copy(pathTarget)
    
        // Update Orbital Controls
    controls.update()


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
