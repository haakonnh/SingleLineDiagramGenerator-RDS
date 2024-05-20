/// <reference path="p5files/p5.global-mode.d.ts" />
/// <reference path="p5files/p5.d.ts" />
// import fs as es module

/**
 * @typedef {object} Coordinates
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {object} Node
 * @property {number} id
 * @property {string} path
 */

/**
 * A component from the database. ID is the ID of the component, and path is the multi-level RD of the component. Type is type.
 * @typedef {object} Component
 * @property {number} ID
 * @property {string} Path
 * @property {string} Type
 */

/**
 * Connections from the database. Component1 and Component2 are IDs of the components.
 * @typedef {object} Connection
 * @property {Component} Component1
 * @property {Component} Component2 
 */

/**
 * Context object which contains the main and sub technical systems, and the main and sub types.
 * @typedef {object} Context
 * @property {string} Main
 * @property {string} Sub
 * @property {string} MainType
 * @property {string} SubType
 */

const size = 200;

let data = {};

/** @type {Component[]} */
let fetchedData = {};

/**
 * @typedef {object} FetchConnections
 * @property {number} Object1
 * @property {number} Object2
 */

/** @type {FetchConnections[]} */
let fetchedConnections = {};

let fetchedMap = {};

let fetchedTypeMap = {};

/** @type {Map<string, string>} */
let idToPath = new Map();

/** @type {Map<string, string>} */
let idToType = new Map();

let dataArray = [];

/**
 * @type {Connection[]}
 */
let components = [];

/**
 * @type {Connection[]}
 */
let connections = []

/**
 * @type {ComponentState[]}
 */
let drawnComponents = [];

/** @type {Context} */
let context = {}

/**
 * This pattern matches the first word in a string
 * @type {RegExp}
 */
const pattern = /[A-Za-z]+/;

/**  @type {p5.Image} */
let banenorPicture;
/**  @type {p5.Image} */
let bottomLeftPicture;

let boxesBoolean = true;
let globcount = 0

let w = 2500
let h = 2200 * 0.4

/**
 * Fetches the components from the API
 */
async function fetchAndProcessComponents() {
      const apiUrl = 'http://localhost:9090/objects' // Replace with your endpoint
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
 * Fetches the connectionships from the API
 */
async function fetchAndProcessConnections() {
      const apiUrl = 'http://localhost:9090/connections' // Replace with your endpoint
      try {
            const response = loadJSON(apiUrl)

            const data = response
            console.log('Connections from API:', data)

            fetchedConnections = data
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
            console.log('PathMap from API:', data)

            fetchedMap = data

      } catch (error) {
            console.error('Error fetching data:', error)
      }

      const newApiUrl = 'http://localhost:9090/idtype'
      try {
            const response = loadJSON(newApiUrl)

            const data = response
            console.log('TypeMap from API:', data)

            fetchedTypeMap = data

      } catch (error) {
            console.error('Error fetching data:', error)
      }
}

async function preload() {
      await fetchAndProcessComponents()
      await fetchAndProcessConnections()
      await fetchAndProcessMaps()
      banenorPicture = loadImage('BanenorBilde.png')
      bottomLeftPicture = loadImage('nedrehjørne.png')
}

/**
 * Takes a full RD and returns the last object in the path
 * @example "RDS.J1.WBC1" -> "WBC1"
 * @param {string} path 
 * @returns {string}
 */
function getLast(path) {
      let pathArray = path.split('.')
      return pathArray.pop()
}

/**
 * method that returns the first word in a string
 * @returns {string}
 */
String.prototype.getWord = function () {
      if (this.match(pattern) == null) {
            return ""
      }
      return this.match(pattern)[0]
}

/**
 * Get the first word in a string
 * @param {string} path 
 * @returns 
 */
function getWord(path) {
      return path.match(pattern)[0]
}

/**
 * 
 * @param {string} path 
 * @returns {string}
 */
function getMainSystem(path) {
      return path.split('.')[1]
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
      } else if (technicalSystemCount === 1) {
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
      if (pathArray.length <= 4) return ""
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
 * fetched connectionships from the API. It uses the map to get the path of the components from the component id. 
 * 
 * @returns {Connection[]}
 */
function populateConnections() {
      // populate connections array with the fetched connectionships from the python api
      idToPath = new Map(Object.entries(fetchedMap))
      idToType = new Map(Object.entries(fetchedTypeMap))

      /**
       * @type {Connection[]}
       */
      let connections = []
      Object.entries(fetchedConnections).forEach(([key, value]) => {
            let comp1 = {
                  ID: value.Object1,
                  Path: idToPath.get(value.Object1.toString()),
                  Type: idToType.get(value.Object1.toString()),

            }
            let comp2 = {
                  ID: value.Object2,
                  Path: idToPath.get(value.Object2.toString()),
                  Type: idToType.get(value.Object2.toString()),
            }
            connections.push({
                  Component1: comp1,
                  Component2: comp2
            })
      });

      for (let i = 0; i < 0; i++) {
            connections.pop()
      }

      return connections
}

/**
 * function draws a component based on the type of the component.
 * @param {Component} component1
 * @param {Component} component2
 * @param {ComponentState[]} drawnComponents
 * @param {Connection[]} connections
 */
function drawingController(component1, component2, drawnComponents, connections) {
      // if the second component has already been drawn, return
      if (findComponentState(component2.ID, drawnComponents) != null) {
            return
      }
      const component2Last = getLast(component2.Path)

      // if the technical system is KL.JE and the second component is a main line (WBC1), draw a station.
      if (context.Main.getWord() == "KL" &&
            context.Sub.getWord() == "JE" &&
            component2.Type == "WBC1") {
            drawStation(component1, component2, drawnComponents, connections)
      }

      // enter into the switch function or transformer function if the second component is a switch or transformer
      else if (component2Last.getWord() == "QBA") {
            drawSwitch(component1, component2, drawnComponents, connections)
      } else if (component2Last.getWord() == "FCA") {
            drawFuse(component1, component2, drawnComponents, connections)
      }

      // the rest of components are drawn here
      else {
            let keyword = component2Last.getWord()
            if (component2.Type != "") {
                  keyword = component2.Type
            }
            if (component2Last == "WBC4") {
                  return
            }

            let component1State = findComponentState(component1.ID, drawnComponents)

            const component2Object = new componentToPath[keyword](component1State.x, component1State.y);
            const component2State = component2Object.makeComponentState(component2.ID)
            if (component2State != null) {
                  drawnComponents.push(component2State);
            }
            component2Object.draw()
      }

}

let x = 25
let y = h / 2

/**
 * This is the main loop of the program which loops through all connections and draws the
 * components accordingly.
 * @param {Connection[]} connections 
 */
function mainLoop(connections) {
      // Initialize drawnComponents array
      drawnComponents = []

      // main loop
      for (let connection of connections) {
            const component1 = connection.Component1
            const component2 = connection.Component2

            context.Main = getUpperTechnical(component2.Path)
            context.Sub = getLowerTechnical(component2.Path)

            const component1Last = getLast(component1.Path)

            // if this is a new branch, so we need to start the entire drawing here

            if (findComponentState(component1.ID, drawnComponents) == null) {
                  // first component should always be a line
                  if (getMainSystem(component1.Path).getWord() == "B") {
                        const BObject = new B(x, y)
                        drawnComponents.push(BObject.makeComponentState(component1.ID))
                        BObject.draw()
                  } else {
                        const component1Object = new WBC1(x, y)
                        drawnComponents.push(component1Object.makeComponentState(component1.ID))
                        component1Object.draw()
                  }


                  drawingController(component1, component2, drawnComponents, connections)
            } else {
                  drawingController(component1, component2, drawnComponents, connections)
            }
      }

      console.log(drawnComponents)
}
/**
 * 
 * @param {ComponentState[]} drawnComponents 
 */
function drawBoxes(drawnComponents) {
      stroke('black')

      // Elements which greatly deviate from the main spine of the sytsems must be removed to allow for efficient
      // box drawing.
      let newDrawnComponents = []

      // This loop removes QBA on stations from drawncomponents 
      for (let i = 0; i < drawnComponents.length; i++) {
            let ok = true
            if (drawnComponents[i].type == "QBA")  {
                  connections.forEach(connection => {
                        if ((connection.Component1.ID == drawnComponents[i].id) && getComponent(connection.Component2.Path).getWord() == "FCA") {
                              ok = false
                        } 
                  })
            }
            if (ok) {
                  newDrawnComponents.push(drawnComponents[i])
            }
            
      }

      // Filter out FCA, TAA, and XBA as they cause trouble with the boxes.
      newDrawnComponents = newDrawnComponents.filter(component => (component.type != "FCA" && component.type != "TAA" && component.type != "XBA"))
      
      // Context variables
      let firstPath = idToPath.get(newDrawnComponents[0].id.toString())
      let currentTechnicalSystem = getUpperTechnical(firstPath)
      let currentMainSystem = getMainSystem(firstPath)

      // Starting coordinates for boxes.
      let firstMainX = 25
      let firstX = 40

      let lastUpperID = newDrawnComponents[newDrawnComponents.length - 1].id

      // Loop through drawn components and draw power supply and technical system boxes.
      newDrawnComponents.forEach(component => {
            let path = idToPath.get(component.id.toString())
            let technical = getUpperTechnical(path)
            let main = getMainSystem(path)
            let tempLastMain = currentMainSystem
            console.log("Main: ", main, "Comp: ", path)

            // Special case when we are at the last component
            if (component.id == lastUpperID) {
                  stroke('purple')
                  rect(firstMainX, y - 200, component.x - firstMainX, 330)
                  text("=" + currentMainSystem, firstMainX + 10, y - 180)
                  firstMainX = component.x + 5
                  currentMainSystem = main

            } else if (main != currentMainSystem) { // Purple boxes are drawn when we leave power supply systems.
                  stroke('purple')
                  rect(firstMainX, y - 200, component.x - firstMainX - 55, 330)
                  text("=" + currentMainSystem, firstMainX + 10, y - 180)

                  // New coordinates for next box.
                  firstMainX = component.x - 50
                  currentMainSystem = main

                  strokeWeight(2)
                  stroke('red')
                  noFill()
            }

            // If the algorithm is still in the same technical system, skip to next system
            if (technical == currentTechnicalSystem) {
                  return
            }

            // This code draws the technical system boxes
            strokeWeight(2)
            stroke('red')
            noFill()
            rect(firstX, y - 170, component.x - firstX - 75, 270)

            strokeWeight(1)
            text(currentTechnicalSystem, firstX + 10, y - 145)

            // Specific implementation if we are in the last one.
            if (main != tempLastMain) {
                  firstX = component.x - 40
            } else {
                  firstX = component.x - 70
            }

            // Specific logic for last upper technical component
            if (component.id == lastUpperID) {
                  stroke('red')
                  strokeWeight(2)
                  rect(firstX, y - 170, component.x - firstX - 15, 270)
                  strokeWeight(1)
                  text(technical, firstX + 10, y - 145)
                  stroke('black')
                  return
            }

            // Set the current technical system to the technical system in this iteration
            currentTechnicalSystem = technical


            stroke('black')
      })

      // DRAWING LOWER TECHNICAL SYSTEMS. Filtering out components which make it difficult to draw lower boxes.
      let lowerComponents = newDrawnComponents.filter(component => getLowerTechnical(idToPath.get(component.id.toString())) != "")
      lowerComponents = lowerComponents.filter(component => component.type.getWord() != "QBA")
      let currentLowerTechnicalSystem = ""
      let firstLowerX = 0

      /** @type {ComponentState} */
      let lastComponent = {
            x: 90,
            y: 0,
            id: 0
      }

      // Return if there is no lower techncial systems.
      if (lowerComponents.length == 0) {
            return
      }

      // Get the last component id
      let lastID = lowerComponents[lowerComponents.length - 1].id

      // Lower technical systems loop
      lowerComponents.forEach(component => {

            let path = idToPath.get(component.id.toString())
            let lowerTechnical = getLowerTechnical(path)
            if (lowerTechnical == currentLowerTechnicalSystem) {
                  lastComponent = component
            } else {
                  if (currentLowerTechnicalSystem == "") {
                        firstLowerX = component.x - 60
                        currentLowerTechnicalSystem = lowerTechnical
                  } else {
                        strokeWeight(1)
                        stroke('blue')
                        noFill()
                        if (lastComponent.type.getWord() == "UAA") {
                              rect(firstLowerX - 5, y - 135, lastComponent.x - firstLowerX + 10, 185)
                        } else {
                              rect(firstLowerX, y - 135, lastComponent.x - firstLowerX - 10, 185)
                        }
                        if (component.id == lastID) {
                              
                              rect(lastComponent.x - 5, y - 135, component.x - lastComponent.x + 10, 185)

                              text(lowerTechnical, lastComponent.x, y - 115)
                              stroke('black')
                              return
                        }



                        strokeWeight(1)
                        text(currentLowerTechnicalSystem, firstLowerX + 5, y - 115)
                        stroke('black')
                        firstLowerX = component.x - 50
                        currentLowerTechnicalSystem = lowerTechnical
                  }
                  lastComponent = component
            }
      })
}

/** 
 * Canvas to draw on. Globally declared.
 * @type {HTMLCanvasElement} 
 */
let cnv;

function setup() {
      // Create canvas
      cnv = createCanvas(w, h);

      // Stroke sets the color of the elements on the canvas
      stroke(1)
      background(255); // white background

      // Populate connections array
      connections = populateConnections()

      // Resize images
      banenorPicture.resize(400, 0)
      bottomLeftPicture.resize(0, 200)

      // Create button to toggle boxes
      let button = createButton('Toggle Technical System Boxes')
      button.position(850, 75)

      // Event listener for button
      button.mousePressed(() => {
            boxesBoolean = !boxesBoolean
      })

      // Set frame rate
      frameRate(1)
}

function draw() {
      background(255)

      // Draw images
      image(banenorPicture, 0, 0)
      image(bottomLeftPicture, 2.5, h - bottomLeftPicture.height - 2.5)

      // Enter main algorithm loop
      mainLoop(connections, drawnComponents)

      // Draw boxes if the button is clicked
      if (boxesBoolean) {
            drawBoxes(drawnComponents)
      }

      saveCanvas(cnv, 'RDS', 'png')
}