import '../dist/tailwind.css'
/* Three.js Imports */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

import Chart from 'chart.js/auto';

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
scene.add(light);

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
controls.autoRotateSpeed = 1.6;
controls.enableRotate = false
controls.enableZoom = false

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


/* Chart.js */
var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'radar',
    data: {
        labels: [
            'Gender',
            'Age',
            'Job',
            'Home country',
            'Source of wealth'
          ],
          datasets: [{
            label: 'Your Attributes',
            data: [0,0,0,0,0],
            fill: true,
            backgroundColor: 'rgb(224, 168, 46, 0.4)',
            borderColor: 'rgb(24, 24, 48)',
            pointBackgroundColor: 'rgb(224, 168, 46)',
            pointBorderColor: 'rgb(224, 168, 46)',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(224, 168, 46)'
          }]
    },
    options: {
        elements: {
          line: {
            borderWidth: 2
          }
        },
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            r: {
                suggestedMin: 0,
                suggestedMax: 90
            }
        }
    },
});


/* Adjusting Chart to slider */
var ageSlider = document.getElementById("age");
ageSlider.addEventListener("change", () => {
    let age = ageSlider.value;
    let points = 100-Math.abs(66.5-age);
    myChart.data.datasets[0].data[1] = points;
    myChart.update();
    updatePercentage();
})


/* Making selection avaliable for genderCards */
var selectedGender = document.querySelector('.gender-card + .selected');
var genderCards = document.getElementsByClassName("gender-card");

for(let genderCard of genderCards){
    genderCard.addEventListener("click", () => {
        if(selectedGender != genderCard){
            genderCard.classList.add('selected');
            selectedGender.classList.remove('selected');
            selectedGender = genderCard;
            myChart.data.datasets[0].data[0] = genderCard.dataset.value;
            myChart.update();
            updatePercentage();
        }
    })   
}

var selectFields = document.querySelectorAll('select')
console.log(selectFields)
for (let selectField of selectFields) {
    selectField.addEventListener("change", () => {
        let selectedValue = parseFloat(selectField.selectedOptions[0].dataset.value);
        let arrayPosition = parseFloat(selectField.dataset.arrayPosition);
        if(selectedValue && arrayPosition){
            myChart.data.datasets[0].data[arrayPosition] = selectedValue;
            myChart.update();
            updatePercentage();
        }
    })
}

function updatePercentage (){
    let allPoints = 0;
    let currentPoints = 0;
    myChart.data.datasets[0].data.forEach(element => {
        if(element > 0){
            allPoints += 100;
            currentPoints += parseFloat(element);
        }
    })
    document.getElementById("percentage").innerHTML = Math.round(currentPoints/allPoints*100);
}