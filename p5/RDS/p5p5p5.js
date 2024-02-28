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

      let drawnComponents = []; // components that have been drawn
      for (let i = 0; i < connections.length; i++) {
            if (connections[i].from.path.match(/[A-Za-z]+/)[0] == "UAA" && connections[i].to.path.match(/[A-Za-z]+/)[0] == "QBA") {
                  // delete the element
                  connections.splice(i, 1);
                  i--;
            }
      }
      console.log("Edited connections: ", connections)

      // loop through the connections and draw them
      connections.forEach((value) => {
            let from = value.from;
            let to = value.to;

            let fromElement = null;
            if (drawnComponents.length > 0) {
                  drawnComponents.forEach((value) => {
                        if (value.id == from.id) {
                              fromElement = value;
                        }
                  });
            };
            fromMatch = from.path.match(/[A-Za-z]+/)[0];

            if (!(fromMatch.length > 2) || !(fromMatch != "BaneNOR")) { // exit if the element is not a component
                  return;
            }
            toMatch = to.path.match(/[A-Za-z]+/)[0];
            
            // if the from element has not been drawn, draw it
            if (!fromElement){
                  let instance = new componentToPath[fromMatch](50, 150, 0, 0);
                  let drawnComponent = new componentState(instance.connectionX1, instance.connectionY1, from.id, fromMatch);
                  drawnComponents.push(drawnComponent);
                  instance.draw()
                  
                  // draw the to element based on the newly drawn component
                  
                  let secondInstance = new componentToPath[toMatch](instance.connectionX1, instance.connectionY1, 50 + myDistX, 150);
                  if (toMatch == "UAA") {
                        secondInstance = new componentToPath[toMatch](instance.connectionX1 - myDistX, instance.connectionY1, 50 + myDistX, 150);
                        // TODO: FIX SECTION LOGIC, IT DRAWS WEIRDLY
                  }
                  drawnComponent = new componentState(secondInstance.connectionX1, secondInstance.connectionY1, to.id, toMatch);
                  drawnComponents.push(drawnComponent);
                  secondInstance.draw()
            }
            else if (fromElement) {
                  let x = fromElement.x;
                  let y = fromElement.y;
                  
                  let instance = new componentToPath[toMatch](x, y, x, y); // CHANGE?
                  if (toMatch == "UAA") {
                        instance = new componentToPath[toMatch](x - myDistX, y, x, y);
                        // TODO: FIX SECTION LOGIC, IT DRAWS WEIRDLY
                  }
                  let drawnComponent = new componentState(instance.connectionX1, instance.connectionY1, to.id, toMatch);
                  drawnComponents.push(drawnComponent);
                  instance.draw()
                  
            }
      });
      console.log("Drawn components: ", drawnComponents)

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