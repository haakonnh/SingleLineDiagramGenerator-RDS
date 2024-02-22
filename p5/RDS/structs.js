class Component {
    constructor(path = '') {
        this.path = path;
    }
    get path() {
        return this.path;
    }
}

const componentToPath = {
    'KL': 'Skillebryter.png',
    'KJ': 'SeksjonsIsolator.png',
    'KF': 'trafo.png',
};


// linje
class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        // connectionX1 and connectionY1 are the starting coords for this element
        // connectionX2 and connectionY2 are the ending coords for this element
        this.connectionX1 = this.x1;
        this.connectionY1 = this.y1;
        this.connectionX2 = this.x1 + myDistX;
        this.connectionY2 = this.y1 + myDistY;
    }

    draw() {
        line(this.x1, this.y1, this.x1 + myDistX, this.y1 + myDistY); // temp dist. and y2
    }
}


//sekjson
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
        this.length = dist(x1, y1, x2, y2) / 6;

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

        // output coords for "last element", connection points essentially
        this.connectionX1 = this.lowerX1;
        this.connectionY1 = this.lowerY1;
        this.connectionX2 = this.lowerX2;
        this.connectionY2 = this.lowerY2;

    }

    draw() {
        // draw upper and lower line
        line(this.lastX2, this.lastY2, this.upperX, this.upperY);
        line(this.lowerX1, this.lowerY1, this.lowerX2, this.lowerY2);
    }
}

//paralell stasjon, denne må endres
class ParallelStasjonBane {
    constructor(x1, y1, x2, y2, antallParallelle) {
        // coords for the last line
        this.lastX1 = x1;
        this.lastX2 = x2;
        this.lastY1 = y1;
        this.lastY2 = y2;

        // vet ikke om paralelle linjer alltid kommer i planet, men hvis ikke så er det greit å ha med dette
        this.lastSlope = (y2 - y1) / (x2 - x1);
        this.angle = atan2(y2 - y1, x2 - x1);
        this.length = dist(x1, y1, x2, y2) / 3;

        // the desired angle of the upper line
        this.newAngle = this.angle + radians(-30);

        // calculated coords for the upper line
        this.upperX = this.lastX1 + cos(this.newAngle) * this.length;
        this.upperY = this.lastY1 + sin(this.newAngle) * this.length;

    }
    draw() {
        line(this.lastX1, this.lastY1, this.upperX, this.upperY);
        line(this.upperX, this.upperY, this.upperX + this.length, this.upperY);
        line(this.upperX + this.length, this.upperY, this.lastX2, this.lastY2);
    }

}

//seksjonisolator 
class SectionIsolator {
    constructor(x1, y1, x2, y2) {
        this.lastX1 = x1;
        this.lastX2 = x2;
        this.lastY1 = y1;
        this.lastY2 = y2;
        // Calculate the perpendicular line coordinates
        const angle = atan2(y2 - y1, x2 - x1);
        const length = 15; // Set your desired length here
        const parallelOffset = -10; // Set the desired offset for parallel lines

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

        // find connection point, which is halfway on the right line
        this.connectionX1 = (this.parallelX1 + this.parallelX2) / 2;
        this.connectionY1 = (this.parallelY1 + this.parallelY2) / 2;
        this.connectionX2 = this.connectionX1;
        this.connectionY2 = this.connectionY1;
    }

    draw() {
        line(this.upperX1, this.upperY1, this.upperX2, this.upperY2);
        line(this.parallelX1, this.parallelY1, this.parallelX2, this.parallelY2);
        //line(this.lowerX1, this.lowerY1, this.lowerX2, this.lowerY2);
    }
}


//last element coordinate
class lastElementCoordinates {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

// Regex pattern to extract the section
const pattern = /[A-Za-z]+/;
const extractedSections = [];

db.forEach(element => {
    const match = element.match(pattern);
    if (match) {
        extractedSections.push(match[0]);
    }
});


//tegne ?

function draw() {
    // put drawing code here
    background(255, 255, 255);
    let x = 200;
    let y = 0;
    let elements = [];
    let x1 = 50;
    let y1 = 100;
    let x2 = 500;
    let y2 = 200;




  let lastElement = new lastElementCoordinates(x1, y1, x2, y2);
  extractedSections.forEach(section => {
        if (map.has(section)) {
                // map contains the class, so create an instance of it depenedent on element
                const ClassType = map.get(section);
                const obj = new ClassType(lastElement.x1, lastElement.y1, lastElement.x2, lastElement.y2);
                obj.draw();
                elements.push(obj);
                lastElement = new lastElementCoordinates(obj.connectionX1, obj.connectionY1, obj.connectionX2, obj.connectionY2);
        }
    });
}
