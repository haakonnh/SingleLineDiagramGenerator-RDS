/// <reference path="../p5.global-mode.d.ts" />
/// <reference path="../p5.d.ts" />

function setup() {
      // put setup code here
    createCanvas(1000, 400);
    
}

let db = ["JE1", "KL1", "JE2", "KL2", "JE3"];

const map = new Map();

class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        
    }
    
    draw() {
        line(this.x1, this.y1, this.x2, this.y2);
    }
}

class Section {
    constructor(x1, x2, y1, y2) {
        this.lastX1 = x1;
        this.lastX2 = x2;
        this.lastY1 = y1;
        this.lastY2 = y2;
        this.lastSlope = (y2 - y1) / (x2 - x1);
        this.angle = atan2(y2 - y1, x2 - x1);
        this.length = dist(x1, y1, x2, y2) / 2;
        this.newAngle = this.angle + radians(-60);
        this.upperX = this.lastX2 + cos(this.newAngle) * this.length;
        this.upperY = this.lastY2 + sin(this.newAngle) * this.length;
        this.mot = sin(radians(-60)) * this.length;
        this.hos = sqrt(this.length * this.length - this.mot * this.mot);
        this.lowerX1 = x2 + cos(this.angle) * this.hos;
        this.lowerY1 = y2 + sin(this.angle) * this.hos;
        this.lowerAngle = this.newAngle + radians(180);
        this.lowerX2 = this.lowerX1 + cos(this.lowerAngle) * this.length;
        this.lowerY2 = this.lowerY1 + sin(this.lowerAngle) * this.length;
    }
    
    draw() {
        line(this.lastX2, this.lastY2, this.upperX, this.upperY);
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

console.log(extractedSections);

function draw() {
      // put drawing code here
    background(255,255, 255);
    let x = 200;
    let y = 0;
    let elements = [];
    let x1 = 100;
    let y1 = 100;
    let x2 = 200;
    let y2 = 200;
    
      
    drawOriginalLine(x1, y1, x2, y2);
    const sect = new Section(x1, x2, y1, y2);
    sect.draw();
    drawOriginalLine(sect.lowerX1, sect.lowerY1, 
    sect.lowerX1 + cos(sect.angle) * sect.length * 2, sect.lowerY1 + sin(sect.angle) * sect.length * 2);
    //drawSteeperLine(x1, y1, x2, y2, -60);
    
  
  
}
















      /* extractedSections.forEach(section => {
        if (map.has(section)) {
            const Class = map.get(section);
            if (section === "JE") {
                const obj = new Class(x, 100, x + 100, 100); // Instantiate JE class with coordinates
                obj.draw();
                x += 100;
                elements.push(obj);
            }
            if (section === "KL") {
                const obj = new Class(x + 15, 75, x + 30, 125); // Instantiate JE class with coordinates
                obj.draw();
                x += 45;
                elements.push(obj);
            }
        }
    }); */