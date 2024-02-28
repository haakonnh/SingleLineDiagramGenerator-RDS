/// <reference path="../p5.global-mode.d.ts" />
/// <reference path="../p5.d.ts" />
// import fs as es module

let imgs = [];
const size = 200;

let data = {};

let fetchedData = {};

let fetchedDataRelations = {};

let dataArray = [];

let dataArray1 = [];

let dataArray1Copy = [];

let components = [];

async function fetchAndProcessData() {
    const apiUrl = 'http://localhost:8000/relation_data'; // Replace with your endpoint

    const apiUrl1 = 'http://localhost:8000/diagram_data'; // Replace with your endpoint
    try {
        const response = loadJSON(apiUrl);
        const response1 = loadJSON(apiUrl1);

        const data = response;
        const data1 = response1;

        console.log("Data from API:", data1);
        console.log("relations from API:", data);

        fetchedData = data1;
        fetchedDataRelations = data;
    }
    catch (error) {
        console.error("Error fetching data:", error);
    };
};



function preload() {
    fetchAndProcessData();
}; 

function checkNext(){
    Object.entries(fetchedDataRelations).forEach(([key, value]) => {
        let currentIndex = 0;
        let doesItContinue = false;
        for(let i = 0; i < 2; i++){
            if(value[2] == fetchedDataRelations[currentIndex][1]){
                doesItContinue = true;
            }
        };
        currentIndex++;
    });
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


function setup() {
    createCanvas(1425, 725);
    background(255);
    
    new SkillebryterOgSeksjon(100, 100, 150, 100).draw();

    console.log("Fetched data:", fetchedDataRelations[1]['node1']);
};

function draw() {
    noLoop();
};


// noe drit fra før
/* Object.entries(fetchedDataRelations).forEach(([key, value]) => {
    let id1 = value.node1
    let id2 = value.node2
    let from, to = null;
    let finalFrom, finalTo = null;
    Object.entries(fetchedData).forEach(([key, value]) => {
          if (value.id == id1) {
                from = value.path.split('.').pop();
                finalFrom = from.replace(/[0-9]/g, '');
            }
          else if (value.id == id2) {
                to = value.path.split('.').pop(); 
                finalTo = to.replace(/[0-9]/g, '');
            }
          if (from && to) {
                connections.push({finalFrom, finalTo})
                from, to = null;
            }
    })
}); */