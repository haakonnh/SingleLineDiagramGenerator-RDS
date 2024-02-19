/// <reference path="../p5.global-mode.d.ts" />
/// <reference path="../p5.d.ts" />

let imgs = [];
const size = 200;

let components = [
      'KL1',
      'KL2',
      'KF3',
      'KF4',
      'JE',
];

function toCoords(x, y) {
      return {x: x, y: y + size / 2};
}

const pattern = /[A-Za-z]+/;

function preload() {
      components.forEach(element => {
            const match = element.match(pattern);
            if (match && match[0] in componentToPath) {
                  element = match[0];
                  imgs.push(loadImage('../images/' + componentToPath[element]));
            }
            else if (match[0] == "JE") {
                  // draw line between imgs
            }
      });
};

function setup() {
      createCanvas(1425, 725);
      background(255);
      let lastCoords = {x: 50, y: 50};
      for (let i = 0; i < components.length; i++) {
            
            if (components[i] == "JE") { 
                  stroke(0);
                  strokeWeight(2);
                  lineCoords = toCoords(lastCoords.x, lastCoords.y);
                  line(lineCoords.x, lineCoords.y, lineCoords.x, lineCoords.y + size / 2);
                  lastCoords = {x: lastCoords.x, y: lastCoords.y + size / 2};
            } else {
                  console.log(lastCoords, size, size)
                  image(imgs[i], lastCoords.x, lastCoords.y, size, size);
                  lastCoords = {x: lastCoords.x + size, y: lastCoords.y}; 
            }
      }
}

function draw() {
      noLoop()
}



