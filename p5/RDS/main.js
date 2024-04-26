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

/** @type {Component[]} */
let fetchedData = {};

/**
 * @typedef {object} FetchRelationship
 * @property {number} Node1
 * @property {number} Node2
 */

/** @type {FetchRelationship[]} */
let fetchedRelationships = {};

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
      await fetchAndProcessRelationships()
      await fetchAndProcessMaps()
      banenorPicture = loadImage('BanenorBilde.png')
      bottomLeftPicture = loadImage('nedrehjørne.png')
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
 * method that returns the first word in a string
 * @returns {string}
 */
String.prototype.getWord = function () {
      if (this.match(pattern) == null) {
            return ""
      }
      return this.match(pattern)[0]
}

function getWord(path) {
      return path.match(pattern)[0]
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
 * fetched relationships from the API. It uses the map to get the path of the components from the component id. 
 * 
 * @returns {Connection[]}
 */
function populateConnections() {
      // populate connections array with the fetched relationships from the python api
      idToPath = new Map(Object.entries(fetchedMap))
      idToType = new Map(Object.entries(fetchedTypeMap))
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
            connections.push({
                  Component1: comp1,
                  Component2: comp2
            })
      });

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
      } else if (component2Last.getWord() == "XBA") {
            drawTransformer(component1, component2, drawnComponents, connections)
      }

      // the rest of components are drawn here
      else {
            let keyword = component2Last.getWord()
            if (component2.Type != "") {
                  keyword = component2.Type
            }
            let component1State = findComponentState(component1.ID, drawnComponents)
            const component2Object = new componentToPath[keyword](component1State.x, component1State.y);

            drawnComponents.push(component2Object.makeComponentState(component2.ID));
            component2Object.draw()
      }

}

/**
 * This is the main loop of the program which loops through all connections and draws the
 * components accordingly.
 * @param {Connection[]} connections 
 * @param {ComponentState[]} drawnComponents
 */
function mainLoop(connections) {
      // starting coordinates
      drawnComponents = []
      let x = 0
      let y = 350

      // main loop
      for (let connection of connections) {
            const component1 = connection.Component1
            const component2 = connection.Component2

            context.Main = getUpperTechnical(component2.Path)
            context.Sub = getLowerTechnical(component2.Path)

            const component1Last = getLast(component1.Path)

            // if this is a new branch, so we need to start the entire drawing here
            if (findComponentState(component1.ID, drawnComponents) == null) {
                  //console.log("New branch", component1.ID, component1.Path, component1Last.getWord())
                  // first component should always be a line
                  const component1Object = new WBC1(x, y)
                  drawnComponents.push(component1Object.makeComponentState(component1.ID))
                  component1Object.draw()

                  drawingController(component1, component2, drawnComponents, connections)
            } else {
                  drawingController(component1, component2, drawnComponents, connections)
            }
      }
}
/**
 * 
 * @param {ComponentState[]} drawnComponents 
 */
function drawBoxes(drawnComponents) {
      let firstPath = idToPath.get(drawnComponents[0].id.toString())
      let currentTechnicalSystem = getUpperTechnical(firstPath)
     
      let firstX = 10

      drawnComponents.forEach(component => {
            let path = idToPath.get(component.id.toString())
            let technical = getUpperTechnical(path)
            

            if (technical == currentTechnicalSystem) {
                  return
            }
            strokeWeight(2)
            stroke('red')
            noFill()
            rect(firstX, 180, component.x - firstX - 75, 270)

            strokeWeight(1)
            text(currentTechnicalSystem, firstX + 10, 205)
            firstX = component.x - 70
            currentTechnicalSystem = technical
            //lastComponent = component
            stroke('black')


      })

      
      let lowerComponents = drawnComponents.filter(component => getLowerTechnical(idToPath.get(component.id.toString())) != "")
      lowerComponents = lowerComponents.filter(component => component.type.getWord() != "QBA")
      let currentLowerTechnicalSystem = ""
      let firstLowerX = 0

      /** @type {ComponentState} */
      let lastComponent = {x: 90, y: 0, id: 0} 
      let lastID = lowerComponents[lowerComponents.length - 1].id
      lowerComponents.forEach(component => {  
            

            let path = idToPath.get(component.id.toString())
            let lowerTechnical = getLowerTechnical(path)
            if (lowerTechnical == currentLowerTechnicalSystem) {
                  lastComponent = component
            } else {
                  if (currentLowerTechnicalSystem == "") {
                        firstLowerX = component.x - 60
                        currentLowerTechnicalSystem = lowerTechnical
                  }
                  else {
                        strokeWeight(1)
                        stroke('blue')
                        noFill()
                        if (lastComponent.type.getWord() == "UAA") {
                              rect(firstLowerX - 5, 215, lastComponent.x - firstLowerX  + 10, 185)
                        } else {
                              rect(firstLowerX, 215, lastComponent.x - firstLowerX  - 10 , 185)
                        }
                        if (component.id == lastID) {
                              console.log("IM HERE")
                              rect(lastComponent.x - 5, 215, component.x - lastComponent.x + 10, 185)
                              stroke('black')
                              text(lowerTechnical ,lastComponent.x , 235)
                        }
                       

                        stroke('black')
                        strokeWeight(1)
                        text(currentLowerTechnicalSystem, firstLowerX + 5, 235)
                        firstLowerX = component.x - 50
                        currentLowerTechnicalSystem = lowerTechnical

                        

                  }
                  lastComponent = component
            }
      })
      //globcount++
}
/** @type {HTMLCanvasElement} */
let cnv;
function setup() {
      cnv = createCanvas(2000, 725);
      background(255); // white background

      connections = populateConnections()
      banenorPicture.resize(400, 0)
      bottomLeftPicture.resize(0, 200)


      let button = createButton('Toggle Technical System Boxes')
      button.position(850, 75)
      button.mousePressed(() => {
            boxesBoolean = !boxesBoolean
      })

      frameRate(1)
}

function draw() {
      background(255)

      image(banenorPicture, 0, 0)

      image(bottomLeftPicture, 0, 525)

      mainLoop(connections, drawnComponents)

      if (boxesBoolean) {
            drawBoxes(drawnComponents)
      }
}