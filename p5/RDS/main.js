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

/** @type {Context} */
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
 * method that returns the first word in a string
 * @returns {string}
 */
String.prototype.getWord = function () {
      console.log("wtf", this)
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
      // if the technical system is KL.JE and the second component is a main line (WBC1), draw a station.
      //console.log(drawnComponents)
      if (findComponentState(component2.ID, drawnComponents) != null) {
            return
      }
      const component2Last = getLast(component2.Path)
      if (context.Main.getWord() == "KL" &&
            context.Sub.getWord() == "JE" &&
            component2.Type == "WBC1") {
            //console.log("Drawing station")
            drawStation(component1, component2, drawnComponents, connections)
      }
      // enter into the switch function
      else if (component2Last.getWord() == "QBA") {
            drawSwitch(component1, component2, drawnComponents, connections)
      } else if (component2Last.getWord() == "XBA") {
            drawTransformer(component1, component2, drawnComponents, connections)
      }

      // the rest of components are drawn here
      else {
            let keyword = component2Last.getWord()
            if (component2.Type)
            if (component2.Type == "") {
                  //console.log("Component2 type is empty")
            } else {
                  keyword = component2.Type
            }
            let component1State = findComponentState(component1.ID, drawnComponents)

            //console.log("Drawing: ", keyword, component2.ID)
            const component2Object = new componentToPath[keyword]
                  (component1State.x, component1State.y);

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
function mainLoop(connections, drawnComponents) {
      let firstConnection = connections[0]
      console.log("First connection: ", firstConnection)
      //connections = [connections[0], connections[1]]

      /** @type {number} */
      let x = 50
      let y = 300
      // main loop
      for (let connection of connections) {
            const component1 = connection.Component1
            const component2 = connection.Component2

            context.Main = getUpperTechnical(component2.Path)
            context.Sub = getLowerTechnical(component2.Path)


            const component1Last = getLast(component1.Path)

            // if this is a new branch, so we need to start the entire drawing here
            if (findComponentState(component1.ID, drawnComponents) == null) {
                  console.log("New branch", component1.ID, component1.Path, component1Last.getWord())
                  // first comp should always be a line
                  const component1Object = new WBC1(x, y)
                  drawnComponents.push(component1Object.makeComponentState(component1.ID))
                  component1Object.draw()

                  drawingController(component1, component2, drawnComponents, connections)
            } else {
                  drawingController(component1, component2, drawnComponents, connections)
            }
      }
}


function setup() {
      createCanvas(2000, 725);
      background(255); // white background


      console.log("techs", getUpperTechnical("RDS.KL1.JE1.WBC1"), getLowerTechnical("RDS.KL1.JE1.WBC1"))

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

      console.log("Drawn components: ", drawnComponents)
}

function draw() {
      noLoop()
}
