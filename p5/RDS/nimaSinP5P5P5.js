/// <reference path="../p5.global-mode.d.ts" />
/// <reference path="../p5.d.ts" />
// import fs as es module

let imgs = [];
const size = 200;

let data = {};

let fetchedData = {};

let fetchedData1 = {};

let dataArray = [];

let dataArray1 = [];

let components = [];

let loadedImages = {
    'KL': null,
    'KF': null,
    'KJ': null,
};

async function fetchAndProcessData() {
    const apiUrl = 'http://localhost:8000/diagram_data_connections'; // Replace with your endpoint

    const apiUrl1 = 'http://localhost:8000/diagram_data'; // Replace with your endpoint
    try {
        const response = loadJSON(apiUrl);
        const response1 = loadJSON(apiUrl1);

        const data = response;
        const data1 = response1;

        console.log("Data from API:", data1);
        console.log("Data from API:", data);

        fetchedData = data;
        fetchedData1 = data1;
    }
    catch (error) {
        console.error("Error fetching data:", error);
    }
}



function preload() {
    fetchAndProcessData();

    data = loadJSON('./test.json');
   /*  Object.entries(loadedImages).forEach(([key, value]) => {
        loadedImages[key] = loadImage('../images/' + componentToPath[key]);
    });
    console.log(loadedImages);*/
}; 


function toCoords(x, y) {
    return { x: x, y: y + size / 2 };
}

const pattern = /[A-Za-z]+/;

function keepLastLetters(string) {
    // Split into segments
    const segments = string.split(".");
  
    // Get the last segment
    const lastSegment = segments.pop();  // Or segments[segments.length - 1]
  
    // Return the letters as a string (you can join them if desired)
    return lastSegment;  
  }


function setup() {
    Object.entries(fetchedData).forEach(([key, value]) => {
        dataArray.push(value);
    });

    Object.entries(fetchedData1).forEach(([key, value]) => {
        dataArray1.push(value);
    });

           dataArray.forEach(element => {
            console.log("hallo", element);
            });
    
            dataArray1.forEach(element => {
                console.log("hei", element);
                }); 

    createCanvas(1425, 725);
    background(255);
    console.log("DataARRAY!:", dataArray);
    console.log("DataARRAY!:", dataArray1);

    Object.entries(dataArray1).forEach(([key, value]) => {
        components.push(keepLastLetters(value[0]));

    });

    /* for (let i = 0; i < newComponents.length; i++) {
    if (newComponents[i] == "JE") {
        stroke(0);
        strokeWeight(2);
        lineCoords = toCoords(lastCoords.x, lastCoords.y);
        new Line(lineCoords.x, lineCoords.y, lineCoords.x, lineCoords.y).draw();
        }
    } */
    /* for (let i = 0; i < newComponents.length; i++) {
          
          if (newComponents[i] == "JE") { 
                stroke(0);
                strokeWeight(2);
                //lineCoords = toCoords(lastCoords.x, lastCoords.y);
                //line(lineCoords.x, lineCoords.y, lineCoords.x + size, lineCoords.y);
                lastCoords = {x: lastCoords.x + size, y: lastCoords.y};
                //line(lineCoords.x, lineCoords.y, lineCoords.x, lineCoords.y + size / 2);
                //lastCoords = {x: lastCoords.x, y: lastCoords.y + size / 2};
          } else {
                //console.log(imgIndex, imgs[imgIndex], newComponents[i]);
                
                //image(imgs[imgIndex], lastCoords.x, lastCoords.y, size, size);
                lastCoords = {x: lastCoords.x + size, y: lastCoords.y}; 
                imgIndex++;
          }
    } */



}

function draw() {
    console.log("Draw:", imgs[0])
    //image(imgs[0], 0,0, size, size);
    noLoop()
}