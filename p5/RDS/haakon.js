/// <reference path="p5files/p5.global-mode.d.ts" />
/// <reference path="p5files/p5.d.ts" />
// import fs as es module

/**
 * @typedef {object} Component
 * @property {number} ID
 * @property {string} Path
 */

/**
 * @typedef {object} Connection
 * @property {Component} Node1
 * @property {Component} Node2
 */

const size = 200;

let data = {};

/**
 * @type {Component[]}
 */
let fetchedData = {};

/**
 * @type {Connection[]}
 */
let fetchedRelationships = {};

let fetchedMap = {};

/**
 * @type {Map<string, string>}
 */
let idToPath = new Map();

let dataArray = [];

/**
 * @type {Connection[]}
 */
let components = [];

/**
 * Fetches the components from the API
 */
async function fetchAndProcessComponents() {
      const apiUrl = 'http://localhost:9090/nodes' // Replace with your endpoint
      //const apiUrl = 'http://localhost:8000/diagram_data' // Replace with your endpoint
      try {
            const response = loadJSON(apiUrl)

            const data = response
            console.log('Components from API:', data)

            fetchedData = data
      } catch (error) {
            console.error('Error fetching data:', error)
      }
}

/**
 * Fetches the relationships from the API
 */
async function fetchAndProcessRelationships() {
      const apiUrl = 'http://localhost:9090/relations' // Replace with your endpoint
      try {
            const response = loadJSON(apiUrl)

            const data = response
            console.log('Relations from API:', data)

            fetchedRelationships = data
      } catch (error) {
            console.error('Error fetching data:', error)
      }
}

/**
 * Fetches the idToPath from the API
 */
async function fetchAndProcessMap() {
      const apiUrl = 'http://localhost:9090/idpath' // Replace with your endpoint
      try {
            const response = loadJSON(apiUrl)

            const data = response
            console.log('Map from API:', data)

            fetchedMap = data

      } catch (error) {
            console.error('Error fetching data:', error)
      }
}

function preload() {
      fetchAndProcessComponents()
      fetchAndProcessRelationships()
      fetchAndProcessMap()
}

/**
 * Takes a full path and returns the last object in the path
 * @example "RDS.J1.WBC1" -> "WBC1"
 * @param {string} path 
 * @returns {string}
 */
function getLast(path) {
      let pathArray = path.split('.')
      return pathArray.pop()
}

/**
 * This function creates a JS map of the fetched "map" structure from the API, and populates the connections array with the
 * fetched relationships from the API. It uses the map to get the path of the components from the component id. 
 * 
 * @returns {Connection[]}
 */
function populateConnections() {
      // populate connections array with the fetched relationships from the python api
      idToPath = new Map(Object.entries(fetchedMap))
      let connections = []
      console.log("OKKK", idToPath)
      Object.entries(fetchedRelationships).forEach(([key, value]) => {
            value.Node1 = {
                  id: value.Node1,
                  path: idToPath.get(value.Node1.toString())
            }
            value.Node2 = {
                  id: value.Node2,
                  path: idToPath.get(value.Node2.toString())
            };
            connections.push(value)
      })
      

      console.log("giga", connections)

      return connections
}

function drawFirstConnection(fromMatch, toMatch, from, to, drawnComponents) {
      let instance = new componentToPath[fromMatch](50, 150, 50, 150);
      let drawnComponent = new ComponentState(instance.connectionX1, instance.connectionY1, from.id, fromMatch);
      drawnComponents.push(drawnComponent);
      instance.draw()

      // draw the to-element based on the newly drawn component
      let secondInstance = new componentToPath[toMatch](instance.connectionX1, instance.connectionY1, 50 + myDistX, 150);
      if (toMatch == "UAA") {
            secondInstance = new componentToPath[toMatch](instance.connectionX1 - myDistX,
                  instance.connectionY1, instance.connectionX1, 150);
            // TODO: FIX SECTION LOGIC, IT DRAWS WEIRDLY
      }
      drawnComponent = new ComponentState(secondInstance.connectionX1, secondInstance.connectionY1, to.id, toMatch);
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
            if (!(fromMatch.length > 2) || (fromMatch == "BaneNOR")) { // exit if the element is not a component
                  return;
            }
            //console.log("From: ", fromMatch, "To: ", toMatch)
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

                  let drawnComponent = new ComponentState(instance.connectionX1, instance.connectionY1, to.id, toMatch);
                  drawnComponents.push(drawnComponent);
                  console
                  instance.draw()
            }
      });
}

function setup() {
      createCanvas(1425, 725);
      background(255); // white background
      
      /**
       * This pattern matches the first word in a string
       * @type {RegExp}
       */
      const pattern = /[A-Za-z]+/;

      // connection array
      let connections = populateConnections();

      //console.log("Tuned connections: ", connections)

      /**
       * @type {ComponentState[]}
       */
      let drawnComponents = []; // components that have been drawn
      // loop through the connections and draw them
      drawConnections(pattern, connections, drawnComponents)


      //console.log("Drawn components: ", drawnComponents)
}

function draw() {
      noLoop()
}