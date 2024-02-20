/// <reference path="../p5.global-mode.d.ts" />
/// <reference path="../p5.d.ts" />
// import fs as es module

let imgs = [];
const size = 200;

let data = {};

let components = [];

let loadedImages = {
      'KL': null,
      'KF': null,
      'KJ': null,
};

function preload() {
      data = loadJSON('test.json');
      Object.entries(loadedImages).forEach(([key, value]) => {
            loadedImages[key] = loadImage('../images/' + componentToPath[key]);
      });
      console.log(loadedImages);
};


/* let components = [
      'KL1',
      'KL2',
      'KF3',
      'KF4',
      'JE',
]; */

function toCoords(x, y) {
      return {x: x, y: y + size / 2};
}

const pattern = /[A-Za-z]+/;


function setup() {
      createCanvas(1425, 725);
      background(255);
      console.log(data);

      Object.entries(data).forEach(([key, value]) => {
            components.push(value.path.split('.').pop());
      });
      console.log(components);

      let newComponents = [];

      components.forEach(element => {
            const match = element.match(pattern);
            if (match && match[0] in componentToPath) {
                  element = match[0];
                  imgs.push(loadedImages[element]);
                  newComponents.push(element); // regex match removes the number from the component
                  console.log(imgs[0]);
            }
            else if (match[0] == "JE") {
                  // draw line between imgs
                  newComponents.push(match[0]);
            }
      });
      let lastCoords = {x: 50, y: 50};
      console.log(newComponents);
      let imgIndex = 0;
      for (let i = 0; i < newComponents.length; i++) {
            
            if (newComponents[i] == "JE") { 
                  stroke(0);
                  strokeWeight(2);
                  lineCoords = toCoords(lastCoords.x, lastCoords.y);
                  line(lineCoords.x, lineCoords.y, lineCoords.x + size, lineCoords.y);
                  lastCoords = {x: lastCoords.x + size, y: lastCoords.y};
                  //line(lineCoords.x, lineCoords.y, lineCoords.x, lineCoords.y + size / 2);
                  //lastCoords = {x: lastCoords.x, y: lastCoords.y + size / 2};
            } else {
                  console.log(imgIndex, imgs[imgIndex], newComponents[i]);
                  
                  image(imgs[imgIndex], lastCoords.x, lastCoords.y, size, size);
                  console.log(imgs[0]);
                  lastCoords = {x: lastCoords.x + size, y: lastCoords.y}; 
                  imgIndex++;
            }
      }
      
}

function draw() {
      console.log("Draw:",imgs[0])
      //image(imgs[0], 0,0, size, size);
      noLoop()
}