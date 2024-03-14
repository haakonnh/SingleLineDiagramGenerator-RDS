/// <reference path="p5files/p5.global-mode.d.ts" />
/// <reference path="p5files/p5.d.ts" />
// import fs as es module

let imgs = [];

const size = 200;

let data = {};

let fetchedData = {};

let fetchedRelationships = {};

let dataArray = [];

let components = [];

async function fetchAndProcessComponents() {
      //const apiUrl = 'http://localhost:9090/nodes' // Replace with your endpoint
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

function populateConnections() {
      // populate connections array with the fetched relationships from the python api
      let connections = []
      Object.entries(fetchedRelationships).forEach(([key, value]) => {
            let id1 = value.node1
            let id2 = value.node2
            let from, to = null;
            Object.entries(fetchedData).forEach(([key, value]) => {
                  if (value.id == id1) {
                        from = {
                              id: value.id,
                              path: value.path.split('.').pop()
                        };
                  } else if (value.id == id2) {
                        to = {
                              id: value.id,
                              path: value.path.split('.').pop()
                        };
                  }
                  if (from && to) {
                        connections.push({
                              from,
                              to
                        })
                        from, to = null;
                  }
            });
      });

      for (let i = 0; i < connections.length; i++) {
            if (connections[i].from.path.match(/[A-Za-z]+/)[0] == "UAA" && connections[i].to.path.match(/[A-Za-z]+/)[0] == "QBA") {
                  // delete the element with slice
                  connections.splice(i, 1);
                  i--;
            }
      }

      return connections
}

function drawFirstConnection(fromMatch, toMatch, from, to, drawnComponents) {
      let instance = new componentToPath[fromMatch](50, 150, 50, 150);
      let drawnComponent = new componentState(instance.connectionX1, instance.connectionY1, from.id, fromMatch);
      drawnComponents.push(drawnComponent);
      instance.draw()

      // draw the to-element based on the newly drawn component
      let secondInstance = new componentToPath[toMatch](instance.connectionX1, instance.connectionY1, 50 + myDistX, 150);
      if (toMatch == "UAA") {
            secondInstance = new componentToPath[toMatch](instance.connectionX1 - myDistX,
                  instance.connectionY1, instance.connectionX1, 150);
            // TODO: FIX SECTION LOGIC, IT DRAWS WEIRDLY
      }
      drawnComponent = new componentState(secondInstance.connectionX1, secondInstance.connectionY1, to.id, toMatch);
      drawnComponents.push(drawnComponent);
      secondInstance.draw()
}

function drawConnections(pattern, connections, drawnComponents) {
      connections.forEach((value) => {
            // get the from and to elements from the connection object
            let from = value.from;
            let to = value.to;
            let fromElement = null;

            // this loop checks if the from-element has been drawn, and if so, assigns it to the fromElement variable
            if (drawnComponents.length > 0) {
                  drawnComponents.forEach((value) => {
                        if (value.id == from.id) {
                              fromElement = value;
                        }
                  });
            };

            // get the component name from the path
            fromMatch = from.path.match(pattern)[0]; // this is regex that matches the first word in the path

            // get the to-component name from the path
            toMatch = to.path.match(pattern)[0];

            // if the from element is not a component, exit the loop
            if (!(fromMatch.length > 2) || !(fromMatch != "BaneNOR")) { // exit if the element is not a component
                  return;
            }

            // if the from element has not been drawn, draw it
            if (!fromElement) {
                  drawFirstConnection(fromMatch, toMatch, from, to, drawnComponents)
            } else if (fromElement) {
                  // extract the x and y coordinates from the fromElement
                  let x = fromElement.x;
                  let y = fromElement.y;

                  let instance = new componentToPath[toMatch](x, y, x, y); // maybe bad structure for the 3rd and 4th arguments
                  if (toMatch == "UAA") { // if the to-component is a UAA, we need to get the starting point of the line, to calculate the correct angles
                        instance = new componentToPath[toMatch](x - myDistX, y, x, y);
                        // TODO: FIX SECTION LOGIC, IT DRAWS WEIRDLY
                  } else if (fromMatch == "WBC" && toMatch == "WBC") { // if the from and to components are both WBC, we need to it as a station, most likely
                        instance = new StationLine(x, y, x, y + myDistY);
                  }

                  let drawnComponent = new componentState(instance.connectionX1, instance.connectionY1, to.id, toMatch);
                  drawnComponents.push(drawnComponent);
                  instance.draw()
            }
      });
}

function setup() {
      createCanvas(1425, 725);
      background(255); // white background
      // regex pattern to match the first word in a string
      const pattern = /[A-Za-z]+/;

      // connection array
      let connections = populateConnections();

      console.log("Tuned connections: ", connections)

      let drawnComponents = []; // components that have been drawn

      // loop through the connections and draw them
      drawConnections(pattern, connections, drawnComponents)

      
      console.log("Drawn components: ", drawnComponents)
}

function draw() {
      noLoop()
}