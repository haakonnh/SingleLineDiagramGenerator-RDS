/// <reference path="p5files/p5.global-mode.d.ts" />
/// <reference path="p5files/p5.d.ts" />
// import fs as es module

/**
 * @typedef {object} Coordinates
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {object} Component
 * @property {number} ID
 * @property {string} Path
 * @property {string} Type
 */
// TODO: COMPONENT AND NODE TYPE SHOULD MAYBE ME MERGED TOGETHER TO THE SAME TYPE.
/**
 * @typedef {object} Node
 * @property {number} id
 * @property {string} path
 */

/**
 * @typedef {object} Connection
 * @property {Component} Component1
 * @property {Component} Component2 
 */

/**
 * @typedef {object} Context
 * @property {string} Main
 * @property {string} Sub
 * @property {string} MainType
 * @property {string} SubType
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

let fetchedTypeMap = {};

/**
 * @type {Map<string, string>}
 */
let idToPath = new Map();

/**
 * @type {Map<string, string>}
 */
let idToType = new Map();

let dataArray = [];

/**
 * @type {Connection[]}
 */
let components = [];

/**
 * @type {Context}
 */
let context = {}

/**
 * This pattern matches the first word in a string
 * @type {RegExp}
 */
const pattern = /[A-Za-z]+/;

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
async function fetchAndProcessMaps() {
      const apiUrl = 'http://localhost:9090/idpath' 
      try {
            const response = loadJSON(apiUrl)

            const data = response
            console.log('Map from API:', data)

            fetchedMap = data

      } catch (error) {
            console.error('Error fetching data:', error)
      }

      const newApiUrl = 'http://localhost:9090/idtype' 
      try {
            const response = loadJSON(newApiUrl)

            const data = response
            console.log('Map from API:', data)

            fetchedTypeMap = data

      } catch (error) {
            console.error('Error fetching data:', error)
      }
}

async function preload() {
      await fetchAndProcessComponents()
      await fetchAndProcessRelationships()
      await fetchAndProcessMaps()
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
 * Takes a full path and returns the upper technical system label.
 * @example ""J1.KL1.KL2.WBC1" -> "KL1"
 * @param {string} path 
 * @returns {string} upper technical system label or empty string if there is no technical system i
 */
function getUpperTechnical(path) {
      let pathArray = path.split('.')
      if (pathArray.length <= 2) return ""

      let technicalSystemCount = 0
      pathArray.forEach(value => {
            if (value.match(pattern)[0].length === 2) {
                  technicalSystemCount++
            }
      })

      if (technicalSystemCount === 2) {
            return pathArray[pathArray.length - 3]
      }

      else if (technicalSystemCount === 1) {
            return pathArray[pathArray.length - 2]
      }

      return ""
}

/**
 * Takes a full path and returns the lower technical system label. 
 * Client code should test against empty string returns
 * @example ""J1.KL1.KL2.WBC1" -> "KL2"
 * @param {string} path 
 * @returns {string} upper technical system label or empty string if there is no technical system i
 */
function getLowerTechnical(path) {
      let pathArray = path.split('.')
      if (pathArray.length <= 2) return ""
      // ternary operator statement which checks that the path consists of atleast two objects, 
      // and that the second to last index is of length exactly 2, e.g. KL or JE.
      return (pathArray[pathArray.length - 2].match(pattern)[0].length == 2) ?
            pathArray[pathArray.length - 2] : ""
}

/**
 * Takes a full path and returns the component system label in the path
 * @example "RDS.J1.WBC1" -> "WBC1"
 * @param {string} path 
 * @returns {string}
 */
function getComponent(path) {
      let pathArray = path.split('.')
      return pathArray.pop()
}

/**
 * finds a component state in the drawnComponents array based on the id
 * @param {number} id 
 * @param {ComponentState[]} drawnComponents
 * @returns {ComponentState | null} returns a component state if it exists, or null if it doesn't
 */
function findComponentState(id, drawnComponents) {
      for (let component of drawnComponents) {
            if (component.id == id) {
                  return component
            }
      }
      return null
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
      idToType = new Map(Object.entries(fetchedTypeMap))
      console.log("OKKK", idToType)
      let connections = []
      Object.entries(fetchedRelationships).forEach(([key, value]) => {
            let comp1 = {
                  ID: value.Node1,
                  Path: idToPath.get(value.Node1.toString()),
                  Type: idToType.get(value.Node1.toString()),

            }
            let comp2 = {
                  ID: value.Node2,
                  Path: idToPath.get(value.Node2.toString()),
                  Type: idToType.get(value.Node2.toString()),
            }
            connections.push({Component1: comp1, Component2: comp2})
      });
      return connections
}

/**
 * @param {Component} node 
 * @param {Connection[]} connections 
 * @returns {Component[]}
 */
function getNeighbours(node, connections) {
      let neighbours = []
      console.log(connections)
      for (let connection of connections) {
            if (connection.Node1.id == node.ID) {
                  neighbours.push(connection.Node2)
                  console.log("Neighbour: ", connection.Node2)
            }
      }
      return neighbours
}

/**
 * draws a double track station to the screen, instantiates a new 
 * track component state and appends it to the drawnComponents array
 * @param {Coordinates} lastComponentCoords 
 * @param {number} length 
 * @param {ComponentState[]} drawnComponents
 * @param {Component[]} stationLines
 */
function drawDoubleTrackStation(lastComponentCoords, length, drawnComponents, stationLines) {
      const x1 = lastComponentCoords.x;
      const y1 = lastComponentCoords.y;

      const x2 = x1 + length;
      const y2 = y1;

      const x3 = x1 + 5;
      const x4 = x2 - 5;

      const y3 = y1 - 20;
      const x5 = x3 + 10;
      const x6 = x4 - 10;

      // create two new components for the two lines and add them to the drawnComponents array
      const connUpperX = x1 + length / 2;
      const connUpperY = y3;
      upperComponent = new ComponentState(connUpperX, connUpperY, stationLines[0].ID, "WBC")
      drawnComponents.push(upperComponent)

      const connLowerX = x1 + length;
      const connLowerY = y1;
      lowerComponent = new ComponentState(connLowerX, connLowerY, stationLines[1].ID, "WBC")
      drawnComponents.push(lowerComponent)

      // TODO FIX THE INDEX THING HER

      // middle line
      line(x1, y1, x2, y2);
      line(x3, y1, x5, y3);
      line(x4, y1, x6, y3);
      line(x5, y3, x6, y3);
}

/**
 * draws a triple track station to the screen, instantiates a new 
 * track component state and appends it to the drawnComponents array
 * @param {Coordinates} lastComponentCoords 
 * @param {number} length 
 * @param {ComponentState[]} drawnComponents 
 * @param {Component[]} stationLines 
 */
function drawTripleTrackStation(lastComponentCoords, length, drawnComponents, stationLines) {
      const x1 = lastComponentCoords.x;
      const y1 = lastComponentCoords.y;

      const x2 = x1 + length;
      const y2 = y1;

      const x3 = x1 + 5;
      const x4 = x2 - 5;

      const y3 = y1 - 20;
      const x5 = x3 + 10;
      const x6 = x4 - 10;

      const y4 = y1 + 20;

      // create three new components for the middle, upper and lower connections and add them to the drawnComponents array
      const connUpperX = x1 + length / 2;
      const connUpperY = y3;
      upperComponent = new ComponentState(connUpperX, connUpperY, stationLines[0].ID, "WBC")
      drawnComponents.push(upperComponent)

      const connLowerX = x1 + length / 2;
      const connLowerY = y4;
      lowerComponent = new ComponentState(connLowerX, connLowerY, stationLines[1].ID, "WBC")
      drawnComponents.push(lowerComponent)

      const connMiddleX = x1 + length;
      const connMiddleY = y1;
      middleComponent = new ComponentState(connMiddleX, connMiddleY, stationLines[2].ID, "WBC")
      drawnComponents.push(middleComponent)

      // straight middle line
      line(x1, y1, x2, y2);

      // upper line
      line(x3, y1, x5, y3);
      line(x4, y1, x6, y3);
      line(x5, y3, x6, y3);

      // lower line
      line(x3, y1, x5, y4);
      line(x4, y1, x6, y4);
      line(x5, y4, x6, y4);
}

function drawSwitchForSection(lastComponentCoords, length, drawnComponents, switchComponent) {
}

function drawSwitchForTransformer(lastComponentCoords, length, drawnComponents, switchComponent) {
}

/**
 * 
 * @param {Component} fromComponent 
 * @param {Component} switchComponent 
 * @param {ComponentState[]} drawnComponents 
 * @param {Connection[]} connections 
 */
function drawSwitch(fromComponent, switchComponent, drawnComponents, connections) {
      const fromComponentState = findComponentState(fromComponent.ID, drawnComponents)
      /** @type {Coordinates} */
      let coords;

      coords = {
            x: fromComponentState.x,
            y: fromComponentState.y
      }

      if (getLast(fromComponent.Path.match(pattern)[0]) == "UAA") {
            drawSwitchForSection(coords, 100, drawnComponents, switchComponent)
      }

      else if (getLast(fromComponent.Path.match(pattern)[0]) == "WBC") {
            drawSwitchForTransformer(coords, 100, drawnComponents, switchComponent)
      }

}

/**
 * draws a station dependent on the number of tracks on the station
 * @param {Component} fromComponent the component which the station is connected to
 * @param {Component} mainLine the node which the station is connected to
 * @param {ComponentState[]} drawnComponents  this is wrong, drawn components is a ComponentState[]
 * @param {Connection[]} connections list of connections
 */
function drawStation(fromComponent, mainLine, drawnComponents, connections) {
      /**
       * list of neighbor nodes
       * @type {Component[]}
       */
      //let neighbours = getNeighbours(mainLine, connections)

      // filter out the neighbours that are not WBC
      //neighbours = neighbours.filter((neighbour) => neighbour.Type == "WBC") 

      let neighbours = [{
            ID: 3,
            Path: "RDS.J1.WBC1",
            Type: "WBC1"
      }, {
            ID: 2,
            Path: "RDS.J1.WBC2",
            Type: "WBC1"
      }]

      /**
       * list of lines composing the station.
       * last element should always be the last component
       * @type {Component[]}
       */
      const stationLines = [neighbours[0], neighbours[1], mainLine]

      const fromComponentState = findComponentState(fromComponent.ID, drawnComponents)

      const length = 100

      /** @type {Coordinates} */
      let coords = {
            x: fromComponentState.x,
            y: fromComponentState.y
      }
      
      if (neighbours.length == 1) { // two tracks
            
            drawDoubleTrackStation(coords, length, drawnComponents, stationLines)
      }

      if (neighbours.length == 2) { // three tracks
            drawTripleTrackStation(coords, length, drawnComponents, stationLines)
      }

      console.log("Drawn: ", drawnComponents)
}


/**
 * This is the main loop of the program which loops through all connections and draws the
 * components accordingly.
 * @param {Connection[]} connections 
 * @param {ComponentState[]} drawnComponents
 */
function mainLoop(connections, drawnComponents) {
      let firstConnection = connections[0]
      console.log("First connection: ", firstConnection)
      connections = [connections[0], connections[1]]
      
      // main loop
      for (let connection of connections) {
            const component1 = connection.Component1
            const component2 = connection.Component2

            context.Main = getUpperTechnical(component1.Path)
            context.Sub = getLowerTechnical(component1.Path)
            console.log("Context: ", context.Main, context.Sub)

            // if this is a new branch, so we need to start the entire drawing here
            if (findComponentState(component1.ID, drawnComponents) == null) {
                  const component1Last = getLast(component1.Path)
                  const component2Last = getLast(component2.Path)

                  const component1LastMatched = component1Last.match(pattern)[0]
                  const component2LastMatched = component2Last.match(pattern)[0]

                  //console.log("Component1: ", component1LastMatched)
                  const component1Object = new componentToPath[component1LastMatched](50, 150, 50, 150)
                  component1Object.draw()
            }
            else {
            }
      }
}


function setup() {
      createCanvas(1425, 725);
      background(255); // white background



      // connection array
      const connections = populateConnections();

      console.log("Tuned connections: ", connections)

      /**
       * @type {ComponentState[]}
       */
      let drawnComponents = []; // components that have been drawn

      //drawnComponents.push(new ComponentState(50, 150, 1, "QBA1")) // example of a drawn component

      mainLoop(connections, drawnComponents)

      /* drawStation({
                  ID: 1,
                  Path: "RDS.J1.QBA1",
                  Type: "QBA1"
            }, {
                  ID: 2,
                  Path: "RDS.J1.WBC2",
                  Type: "WBC1"
            },
            drawnComponents, connections) */

      //console.log("Drawn components: ", drawnComponents)
}

function draw() {
      noLoop()
}

/* function drawFirstConnection(fromMatch, toMatch, from, to, drawnComponents) {
      let instance = new componentToPath[fromMatch](50, 150, 50, 150);
      let drawnComponent = new ComponentState(instance.connectionX1, instance.connectionY1, from.id, fromMatch);
      drawnComponents.push(drawnComponent);
      instance.draw()

      new JE2(0, 0)


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
} */

/* function drawConnections(pattern, connections, drawnComponents) {
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
} */