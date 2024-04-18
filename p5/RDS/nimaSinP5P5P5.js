let imgs = [];
const size = 200;

let data = {};

let fetchedData = {};

let fetchedDataRelations = {};

let treeDataf = {};

let dataArray = [];

let dataArray1 = [];

let dataArray1Copy = [];

let components = [];

let connections = [];

let drawnComponents = [];

let testList = [];

// Dimensions
const width = 800; 
const height = 600;

async function fetchAndProcessData() {
    const apiUrl = 'http://localhost:8000/relation_data'; // Replace with your endpoint

    const apiUrl1 = 'http://localhost:8000/diagram_data'; // Replace with your endpoint

   /*  const treedata = 'http://localhost:8000/tree_data'; */
    try {
        const response = loadJSON(apiUrl);
        const response1 = loadJSON(apiUrl1);
        /* const treeData = loadJSON(treedata); */

        const data = response;
        const data1 = response1;
        /* const data2 = treeData; */

        console.log("Data from API:", data1);
        console.log("relations from API:", data);
       /*  console.log("tree data:", data2); */

        fetchedData = data1;
        fetchedDataRelations = data;
        /* treeDataf = data2; */
    }
    catch (error) {
        console.error("Error fetching data:", error);
    };
};



function preload() {
    fetchAndProcessData();
    img = loadImage('BanenorBilde.png');
}; 


function toCoords(x, y) {
    return { x: x, y: y + size / 2 };
};

const pattern = /[A-Za-z]+/;

function keepLastLetters(string) {
    const segments = string.split(".");
  
    const lastSegment = segments.pop();  // Or segments[segments.length - 1]
    const lettersOnly = lastSegment.replace(/[0-9]/g, '');
  
    return lettersOnly;  
};

function getReadyForConnections() {
    Object.entries(fetchedDataRelations).forEach(([key, value]) => {
        let id1 = value.node1;
        let id2 = value.node2;
        let from, to = null;
        let finalFrom, finalTo = null;
        Object.entries(fetchedData).forEach(([key, value]) => {
            if (value.id == id1) {
                finalFrom = value.path.split('.').pop();
                from = finalFrom.replace(/[0-9]/g, '');
            }
            else if (value.id == id2) {
                finalTo = value.path.split('.').pop();
                to = finalTo.replace(/[0-9]/g, '');
            }
            if (from && to) {
                connections.push({ from, to });
                from, to = null;
            };
        });
    });
};

function whatShouldIDraw() {
    let currentCords = {x1: 100, y1: 100, x2: 200, y2: 100};

    connections.forEach((value) => {
    
        let tegnet = null;
        let from = value.from;
        let to = value.to;

        if(from == "UAA" && to == "QBA") {
            let tegnet = new SkillebryterOgSeksjon(currentCords.x1, currentCords.y1, currentCords.x2, currentCords.y2).draw();
            drawnComponents.push(tegnet);
            //currentCords = {x1: tegnet.connectionX1, y1: tegnet.connectionY1, x2: tegnet.connectionX2, y2: tegnet.connectionY2};
        }
        if(from == "WBC" && to == "XBA") {
            let tegnet = new Trafosamling(currentCords.x1, currentCords.y1, currentCords.x2, currentCords.y2).draw();
            drawnComponents.push(tegnet);

        }
        if(from == "WBC" && to == "WBC") {
            //let tegnet = new Line(100, 300, 100, 500).draw();
            let tegnet = new ParallelStasjonBane(currentCords.x1, currentCords.y1, currentCords.x2, currentCords.y2).draw();
            drawnComponents.push(tegnet);
        }
        else {
            tegnet = new componentToPath[from](currentCords.x1, currentCords.y1, currentCords.x2, currentCords.y2).draw();
            drawnComponents.push(tegnet);
            
        }
    });
    return connections;
};


let testArray = [];

let herSkjerDetSykeTing = {};

function hei() {
    Object.entries(fetchedData).forEach((key, value) => {
        testArray.push(key[1].path);
    });

    function sortArrayByPeriods(testArray) {
        return testArray.sort((a, b) => {
          // Count the number of periods (".") in each string
          const countPeriods = (str) => str.split(".").length - 1;
      
          return countPeriods(a) - countPeriods(b);
        });
      };
      


      const sortedData = sortArrayByPeriods(testArray);
};

function setup() {
    createCanvas(1425, 725);
    background(255);
    getReadyForConnections();

    console.log("CONNECTIONS:", connections);
    console.log("COMPONENTS:", drawnComponents);
    
/*     hei();
    whatShouldIDraw();  */

    let forsok = new UAA2(100, 100).draw();
    let forsok1 = new QBA1(100, 100).draw();
    let stasjon = new JE2(150, 100).draw();
    let linje = new WBC1(250, 100).draw();

    image(img, 100, 600, 200, 100);

    console.log("TESTARRAY:", testArray);
    console.log("TREE:", treeDataf);
    noLoop();
};

function draw() {
    noLoop();
};
