/// <reference path="../p5.global-mode.d.ts" />
/// <reference path="../p5.d.ts" />

function setup() {
      // put setup code here
    createCanvas(1000, 400);
    
}

let db = ["JE1", "KL1", "JE2", "KL2", "JE3", "KL3", "JE4"];

const map = new Map();
const myDist = 50;

class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        this.connectionX1 = this.x1;
        this.connectionY1 = this.y1;
        this.connectionX2 = this.x1 + myDist;
        this.connectionY2 = this.y1;
    }
    
    draw() {
        line(this.x1, this.y1, this.x1 + myDist, this.y1); // temp dist. and y2
    }
}

class Section {
    constructor(x1, y1, x2, y2) {
        // coords for the last line
        this.lastX1 = x1;
        this.lastX2 = x2;
        this.lastY1 = y1;
        this.lastY2 = y2;

        // slope, angle and length of the last line
        this.lastSlope = (y2 - y1) / (x2 - x1);
        this.angle = atan2(y2 - y1, x2 - x1);
        this.length = dist(x1, y1, x2, y2) / 2;

        // the desired angle of the upper line
        this.newAngle = this.angle + radians(-60);

        // calculated coords for the upper line
        this.upperX = this.lastX2 + cos(this.newAngle) * this.length;
        this.upperY = this.lastY2 + sin(this.newAngle) * this.length;

        // pytahgorean theorem to calculate the coords for the lower line
        this.mot = sin(radians(-60)) * this.length;
        this.hos = sqrt(this.length * this.length - this.mot * this.mot);
        this.lowerX1 = x2 + cos(this.angle) * this.hos;
        this.lowerY1 = y2 + sin(this.angle) * this.hos;
        this.lowerAngle = this.newAngle + radians(180); // angle flipped by 180 degrees for lower line
        this.lowerX2 = this.lowerX1 + cos(this.lowerAngle) * this.length;
        this.lowerY2 = this.lowerY1 + sin(this.lowerAngle) * this.length;

        // output coords for "last element"
        this.connectionX1 = this.lowerX1;
        this.connectionY1 = this.lowerY1;

    }
    
    draw() {
        // draw upper and lower line
        line(this.lastX2, this.lastY2, this.upperX, this.upperY);
        line(this.lowerX1, this.lowerY1, this.lowerX2, this.lowerY2);
    }
}

class SectionIsolator {
    constructor(x1, x2, y1, y2) {
        this.lastX1 = x1;
        this.lastX2 = x2;
        this.lastY1 = y1;
        this.lastY2 = y2;

        // Calculate the perpendicular line coordinates
        const angle = atan2(y2 - y1, x2 - x1);
        const length = 50; // Set your desired length here
        const parallelOffset = -20; // Set the desired offset for parallel lines

        // Calculate coordinates for both ends of the perpendicular line
        [this.upperX1, this.upperY1] = [x2 + cos(angle + HALF_PI) * length, y2 + sin(angle + HALF_PI) * length];
        [this.upperX2, this.upperY2] = [x2 + cos(angle - HALF_PI) * length, y2 + sin(angle - HALF_PI) * length];

        // Calculate coordinates for both ends of the parallel line
        const parallelLength = dist(this.upperX1, this.upperY1, this.upperX2, this.upperY2);
        const parallelAngle = angle + PI; // Opposite direction

        this.parallelX1 = this.upperX1 + cos(parallelAngle) * parallelOffset;
        this.parallelY1 = this.upperY1 + sin(parallelAngle) * parallelOffset;
        this.parallelX2 = this.upperX2 + cos(parallelAngle) * parallelOffset;
        this.parallelY2 = this.upperY2 + sin(parallelAngle) * parallelOffset;

        [this.lowerX1, this.lowerY1] = [x2, y2];
        [this.lowerX2, this.lowerY2] = [x2 + cos(angle + PI) * length, y2 + sin(angle + PI) * length];
        const midX = (this.parallelX1 + this.parallelX2) / 2;
        const midY = (this.parallelY1 + this.parallelY2) / 2;
    }

    draw() {
        line(this.upperX1, this.upperY1, this.upperX2, this.upperY2);
        line(this.parallelX1, this.parallelY1, this.parallelX2, this.parallelY2);
        line(this.lowerX1, this.lowerY1, this.lowerX2, this.lowerY2);
    }
}



function drawOriginalLine(x1, y1, x2, y2) {
    line(x1, y1, x2, y2);
}



// Store functions in the map
map.set("JE", Line);  
map.set("KL", Line);

// Regex pattern to extract the section
const pattern = /[A-Za-z]+/;
const extractedSections = [];

db.forEach(element => {
      const match = element.match(pattern);
      if (match) {
            extractedSections.push(match[0]);
      }
});

class lastElementCoordinates {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2; 
    }
}

function draw() {
      // put drawing code here
    background(255,255, 255);
    let x = 200;
    let y = 0;
    let elements = [];
    let x1 = 50;
    let y1 = 100;
    let x2 = 200;
    let y2 = 200;
    
      
    drawOriginalLine(x1, y1, x2, y2);
    const sect = new Section_isolator(x1, x2, y1, y2);
    sect.draw();
    drawOriginalLine(sect.lowerX1, sect.lowerY1, 
    sect.lowerX1 + cos(sect.angle) * sect.length * 2, sect.lowerY1 + sin(sect.angle) * sect.length * 2);
    //drawSteeperLine(x1, y1, x2, y2, -60);
    
  
  
}











