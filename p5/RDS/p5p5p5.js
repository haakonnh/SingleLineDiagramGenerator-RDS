/// <reference path="../p5.global-mode.d.ts" />
/// <reference path="../p5.d.ts" />
// import fs as es module

let imgs = [];
const size = 200;

let data = {};

let fetchedData = {};

let dataArray = [];

let components = [];

let loadedImages = {
    KL: null,
    KF: null,
    KJ: null,
}

async function fetchAndProcessData() {
    const apiUrl = 'http://localhost:8000/diagram_data' // Replace with your endpoint
    try {
        const response = loadJSON(apiUrl)

        const data = response
        console.log('Data from API:', data)

        fetchedData = data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

function preload() {
    fetchAndProcessData()

    data = loadJSON('test.json')
    /* Object.entries(loadedImages).forEach(([key, value]) => {
                  loadedImages[key] = loadImage('../images/' + componentToPath[key]);
            });
            console.log(loadedImages); */
}

function toCoords(x, y) {
    return {
        x: x,
        y: y + size / 2,
    }
}

const pattern = /[A-Za-z]+/

function setup() {
    Object.entries(fetchedData).forEach(([key, value]) => {
        dataArray.push(value[0])
    })

    /* dataArray.forEach(element => {
              console.log(element);
              }); */

    createCanvas(1425, 725);
    background(255);
    console.log('ARRAY!:', dataArray);

    dataArray.forEach((value) => {
        components.push(value.split('.').pop())
    })

    console.log(components);

    let newComponents = [];
    let lastCoords = {
        x: 50,
        y: 50,
    }
    
      // TODO: REFACTOR MOTHER FUCKERS
      // TODO: RESPEKTER KONGEN
}

function draw() {
      noLoop()
            imgIndex++
        }
    }
    // TODO: REFACTOR MOTHER FUCKERS

function draw() {
    console.log('Draw:', imgs[0])
    //image(imgs[0], 0,0, size, size);
    noLoop()
}