/// <reference path="../p5.global-mode.d.ts" />
/// <reference path="../p5.d.ts" />
// import fs as es module

let imgs = [];
const size = 200;

let data = {};

let fetchedData = {};

let fetchedRelationships = {};

let dataArray = [];

let components = [];

let loadedImages = {
      KL: null,
      KF: null,
      KJ: null,
}

async function fetchAndProcessComponents() {
      const apiUrl = 'http://localhost:8000/diagram_data' // Replace with your endpoint
      try {
            const response = loadJSON(apiUrl)

            const data = response
            console.log('Components from API:', data)

            fetchedData = data
      } catch (error) {
            console.error('Error fetching data:', error)
      }
}

async function fetchAndProcessRelationships() {
      const apiUrl = 'http://localhost:8000/relation_data' // Replace with your endpoint
      try {
            const response = loadJSON(apiUrl)

            const data = response
            console.log('Relations from API:', data)

            fetchedRelationships = data
      } catch (error) {
            console.error('Error fetching data:', error)
      }
}

function preload() {
      fetchAndProcessComponents()
      fetchAndProcessRelationships()
}

function setup() {

      let drawnComponents = []; // components that have been drawn

      let connections = [];
      
      Object.entries(fetchedRelationships).forEach(([key, value]) => {
            let id1 = value.node1
            let id2 = value.node2
            let from, to = null;
            Object.entries(fetchedData).forEach(([key, value]) => {
                  if (value.id == id1) {
                        from = {id: value.id, path: value.path.split('.').pop()};
                  }
                  else if (value.id == id2) {
                        to = {id: value.id, path: value.path.split('.').pop()};
                  }
                  if (from && to) {
                        connections.push({from, to})
                        from, to = null;
                  }
            });
      });
      console.log('CONNECTIONS:', connections)

      createCanvas(1425, 725);
      background(255); 

      connections.forEach((value) => {
            let from = value.from;
            let to = value.to;

            let fromElement = null;

            drawnComponents.forEach((value) => {
                  console.log('VALUE:', value, from.id)
                  if (value.id == from.id) {
                        fromElement = value;
                        console.log('FROM ELEMENT:', fromElement)
                  }
            });

            match = from.path.match(/[A-Za-z]+/)[0];

            if (!(match.length > 2) || !(match != "BaneNOR")) { // exit if the element is not a component
                  return;
            }
            toMatch = to.path.match(/[A-Za-z]+/)[0];
            if (!fromElement){
                  let instance = new componentToPath[toMatch](150, 150, 0, 0);
                  console.log('Drawing:', instance)
                  let drawnComponent = new componentState(150, 150, to.id);
                  drawnComponents.push(drawnComponent);
                  instance.draw()
            }
            else if (fromElement) {
                  let x = fromElement.x;
                  let y = fromElement.y;
                  
                  let instance = new componentToPath[toMatch](x, y, x + myDistX, y);
                  console.log('Drawing:', instance)
                  let drawnComponent = new componentState(x, y, to.id);
                  drawnComponents.push(drawnComponent);
                  console.log('Drawing from:', fromElement, 'to:', instance)
                  instance.draw()
            }
      });

      //console.log(components);

      const pattern = /[A-Za-z]+/

      

      /* Object.entries(fetchedRelationships).forEach(([key, value]) => {
            newComponents.push(value)
      }); */

      /* components.forEach((value) => {
            let match = value.match(pattern);
            let element = "";
            element = match[0];
            if (match && element.length > 2 && element != "BaneNOR") {
                  let instance = new componentToPath[element](0, 0, 0, 0);
                  newComponents.push(instance);
            }
      }); */

}

function draw() {
      noLoop()
}