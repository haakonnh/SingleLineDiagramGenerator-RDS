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

}



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

      const pattern = /[A-Za-z]+/


      let newComponents = [];

      components.forEach((value) => {
            let match = value.match(pattern);
            let element = "";
            element = match[0];
            if (match && element.length > 2 && element != "BaneNOR") {
                  let instance = new componentToPath[element](0, 0, 0, 0);
                  newComponents.push(instance);
            }
      });

      console.log(newComponents);

}

function draw() {
      console.log('Draw:', imgs[0])
      //image(imgs[0], 0,0, size, size);
      noLoop()
}