class Component {
      constructor(path = '') {
            this.path = path
      }
      get path() {
            return this.path
      }
}
let canvasHeight = 725
let canvasWidth = 1425
let myDistX = canvasWidth / 10
let myDistY = canvasHeight / 10

// linje
class Line {
      constructor(x1, y1, x2, y2) {
            this.x1 = x1
            this.y1 = y1
            this.x2 = x2
            this.y2 = y2
            // connectionX1 and connectionY1 are the starting coords for this element
            // connectionX2 and connectionY2 are the ending coords for this element
            this.connectionX1 = this.x1 + myDistX 
            this.connectionY1 = this.y1
            this.connectionX2 = this.x1
            this.connectionY2 = this.y1
      }
      draw() {
            line(this.x1, this.y1, this.x1 + myDistX, this.y1) // temp dist. and y2
      }
}

// linje
class StationLine {
      constructor(x1, y1, x2, y2) {
            this.x1 = x1
            this.y1 = y1
            this.x2 = x2
            this.y2 = y2
            // connectionX1 and connectionY1 are the starting coords for this element
            // connectionX2 and connectionY2 are the ending coords for this element
            this.connectionX1 = this.x1 
            this.connectionY1 = this.y1
            this.connectionX2 = this.x1
            this.connectionY2 = this.y1 - myDistY / 2
      }
      
      draw() {
            stroke('blue')
            line(this.x1 - (myDistX - myDistX / 3), this.connectionY2, this.x1 - (myDistX - myDistX / 6), this.y1) // temp dist. and y2
            line(this.x1 - myDistX / 3, this.connectionY2, this.x1 - (myDistX - myDistX / 3), this.connectionY2)
            line(this.x1 - myDistX / 6 , this.y1, this.x1 - myDistX / 3, this.connectionY2)
            stroke('black')
      }
}

// Sekjson
class Section {
      constructor(x1, y1, x2, y2) {
            // coords for the last line
            this.lastX1 = x1
            this.lastX2 = x2
            this.lastY1 = y1
            this.lastY2 = y2

            // slope, angle and length of the last line
            //this.lastSlope = (y2 - y1) / (x2 - x1) 
            this.angle = atan2(y2 - y1, x2 - x1)
            this.length = dist(x1, y1, x2, y2) / 6

            // the desired angle of the upper line
            this.newAngle = this.angle + radians(-60)

            // calculated coords for the upper line
            this.upperX = this.lastX2 + cos(this.newAngle) * this.length
            this.upperY = this.lastY2 + sin(this.newAngle) * this.length

            // pytahgorean theorem to calculate the coords for the lower line
            this.mot = sin(radians(-60)) * this.length
            this.hos = sqrt(this.length * this.length - this.mot * this.mot)
            this.lowerX1 = x2 + cos(this.angle) * this.hos
            this.lowerY1 = y2 + sin(this.angle) * this.hos
            this.lowerAngle = this.newAngle + radians(180) // angle flipped by 180 degrees for lower line
            this.lowerX2 = this.lowerX1 + cos(this.lowerAngle) * this.length
            this.lowerY2 = this.lowerY1 + sin(this.lowerAngle) * this.length

            // output coords for "last element", connection points essentially
            this.connectionX1 = this.lowerX1
            this.connectionY1 = this.lowerY1
            this.connectionX2 = this.lowerX2
            this.connectionY2 = this.lowerY2
      }

      draw() {
            // draw upper and lower line
            line(this.lastX2, this.lastY2, this.upperX, this.upperY)
            line(this.lowerX1, this.lowerY1, this.lowerX2, this.lowerY2)
      }
}

//paralell stasjon, denne må endres
class ParallelStasjonBane {
      constructor(x1, y1, x2, y2, antallParallelle) {

            // coords for the last line
            this.lastX1 = x1
            this.lastX2 = x2
            this.lastY1 = y1
            this.lastY2 = y2

            // vet ikke om paralelle linjer alltid kommer i planet, men hvis ikke så er det greit å ha med dette
            this.lastSlope = (y2 - y1) / (x2 - x1)
            this.angle = atan2(y2 - y1, x2 - x1)
            this.length = dist(x1, y1, x2, y2) / 3

            // the desired angle of the upper line
            this.newAngle = this.angle + radians(-30)

            // calculated coords for the upper line
            this.upperX = this.lastX1 + cos(this.newAngle) * this.length
            this.upperY = this.lastY1 + sin(this.newAngle) * this.length
      }
      draw() {
            line(this.lastX1, this.lastY1, this.upperX, this.upperY)
            line(this.upperX, this.upperY, this.upperX + this.length, this.upperY)
            line(this.upperX + this.length, this.upperY, this.lastX2, this.lastY2)
      }
}

//seksjonisolator
class SectionIsolator {
      constructor(x1, y1, x2, y2) {
            this.lastX1 = x1
            this.lastX2 = x2
            this.lastY1 = y1
            this.lastY2 = y2
            // Calculate the perpendicular line coordinates
            const angle = atan2(y2 - y1, x2 - x1)
            const length = 15 // Set your desired length here
            const parallelOffset = -10 // Set the desired offset for parallel lines

            // Calculate coordinates for both ends of the perpendicular line
            ;
            [this.upperX1, this.upperY1] = [
                  x2 + cos(angle + HALF_PI) * length,
                  y2 + sin(angle + HALF_PI) * length,
            ];
            [this.upperX2, this.upperY2] = [
                  x2 + cos(angle - HALF_PI) * length,
                  y2 + sin(angle - HALF_PI) * length,
            ]

            // Calculate coordinates for both ends of the parallel line
            const parallelLength = dist(
                  this.upperX1,
                  this.upperY1,
                  this.upperX2,
                  this.upperY2
            )
            const parallelAngle = angle + PI // Opposite direction

            this.parallelX1 = this.upperX1 + cos(parallelAngle) * parallelOffset
            this.parallelY1 = this.upperY1 + sin(parallelAngle) * parallelOffset
            this.parallelX2 = this.upperX2 + cos(parallelAngle) * parallelOffset
            this.parallelY2 = this.upperY2 + sin(parallelAngle) * parallelOffset;
            [this.lowerX1, this.lowerY1] = [x2, y2];
            [this.lowerX2, this.lowerY2] = [
                  x2 + cos(angle + PI) * length,
                  y2 + sin(angle + PI) * length,
            ]

            // find connection point, which is halfway on the right line
            this.connectionX1 = (this.parallelX1 + this.parallelX2) / 2
            this.connectionY1 = (this.parallelY1 + this.parallelY2) / 2
            this.connectionX2 = this.connectionX1
            this.connectionY2 = this.connectionY1
      }

      draw() {
            line(this.upperX1, this.upperY1, this.upperX2, this.upperY2)
            line(this.parallelX1, this.parallelY1, this.parallelX2, this.parallelY2)
            //line(this.lowerX1, this.lowerY1, this.lowerX2, this.lowerY2);
      }
}

//skillebryter, draw rectangle
class Skillebryter {
      constructor(x1, y1, x2, y2) {
            this.x1 = x1
            this.y1 = y1
            this.x2 = x2
            this.y2 = y2
            this.connectionX1 = this.x1 + 30
            this.connectionY1 = this.y1
            this.connectionX2 = this.x1
            this.connectionY2 = this.y1
      }

      draw() {
            rect(this.x1, this.y1 - 15, 30, 30)
      }
}

class SkillebryterOgSeksjon {
      constructor(x1, y1, x2, y2, avEllerPå = 0) {
            // coords for the last line
            this.lastX1 = x1
            this.lastX2 = x2
            this.lastY1 = y1
            this.lastY2 = y2

            // slope, angle and length of the last line
            this.lastSlope = (y2 - y1) / (x2 - x1)
            this.angle = atan2(y2 - y1, x2 - x1)
            this.length = dist(x1, y1, x2, y2) / 6

            // the desired angle of the upper line
            this.newAngle = this.angle + radians(-60)

            // calculated coords for the upper line
            this.upperX = this.lastX2 + cos(this.newAngle) * this.length
            this.upperY = this.lastY2 + sin(this.newAngle) * this.length

            // pytahgorean theorem to calculate the coords for the lower line
            this.mot = sin(radians(-60)) * this.length
            this.hos = sqrt(this.length * this.length - this.mot * this.mot)
            this.lowerX1 = x2 + cos(this.angle) * this.hos
            this.lowerY1 = y2 + sin(this.angle) * this.hos
            this.lowerAngle = this.newAngle + radians(180) // angle flipped by 180 degrees for lower line
            this.lowerX2 = this.lowerX1 + cos(this.lowerAngle) * this.length
            this.lowerY2 = this.lowerY1 + sin(this.lowerAngle) * this.length

            // for skillebryter
            this.skillebryterOppX1 = this.lastX2;
            this.skillebryterOppY1 = this.lastY2;
            this.skillebryterOppX2 = this.lowerX1 + 2* myDistX / 5;

            this.skillebryterTopp = this.skillebryterOppY1 - 1.5 * this.length;

            this.skillebryterStartX = this.skillebryterOppX1 + myDistX / 7;

            this.skillebryterSluttX = this.skillebryterOppX2 - myDistX / 7;


            // output coords for "last element", connection points essentially
            this.connectionX1 = this.skillebryterOppX2
            this.connectionY1 = this.lowerY1
            this.connectionX2 = this.lowerX2
            this.connectionY2 = this.lowerY2



      }

      draw() {
            // draw upper and lower line

            strokeWeight(1)
            line(this.lastX2 + myDistX / 5, this.lastY2, this.upperX + myDistX / 5, this.upperY)
            line(this.lowerX1 + myDistX / 5, this.lowerY1, this.lowerX2 + myDistX / 5, this.lowerY2)
            line(this.skillebryterOppX1, this.lastY2, this.lastX2 + myDistX/5, this.lastY2)
            line(this.skillebryterOppX2, this.lowerY1, this.lowerX1+ myDistX / 5, this.lowerY1)

            line(this.skillebryterOppX1, this.skillebryterOppY1, this.skillebryterOppX1, this.skillebryterTopp)
            line(this.skillebryterOppX2, this.lowerY1, this.skillebryterOppX2, this.skillebryterTopp)

            line(this.skillebryterOppX1, this.skillebryterTopp, this.skillebryterStartX, this.skillebryterTopp)
            line(this.skillebryterSluttX, this.skillebryterTopp, this.skillebryterOppX2, this.skillebryterTopp)

            strokeWeight(2)
            line(this.skillebryterSluttX, this.lastY2 - 1.5 * this.length + myDistY / 8, this.skillebryterSluttX, this.lowerY1 - 1.5 * this.length - myDistY / 8)
            line(this.skillebryterStartX, this.skillebryterTopp, this.skillebryterSluttX, this.skillebryterTopp);

            strokeWeight(1)
      }
}


class Trafo {
      constructor(x1, y1, x2, y2) {
            // coords for the last line
            this.x = x2
            this.y = y2
            this.d = 50
      }

      draw() {
            noFill()
            circle(this.x, this.y - 25, this.d)
            circle(this.x, this.y - 50, this.d)
      }
}

class ConnectionDot {
      constructor(x1, y1, x2, y2) {
            // coords for the last line
            this.x = x2
            this.y = y2
            this.d = 5
      }

      draw() {
            fill('black')
            circle(this.x, this.y, this.d)
      }
}

class Sikring {
      constructor(x1, y1, x2, y2) {
            this.x = x2
            this.y = y2
            this.d = 5
      }

      draw() {
            fill('black')
            circle(this.x, this.y, this.d)
      }
}

class Trafosamling {
      constructor(x1, y1, x2, y2) {
            this.x = x2
            this.y = y2
            this.d = 5
            this.d2 = 30
            this.connectionX1 = this.x + this.d
            this.connectionY1 = this.y

            //endepunkt for linje
            this.endepunktY = this.y + myDistX - 65;
      }

      draw() {
            fill('black')
            circle(this.x, this.y, this.d)
            line(this.x, this.y, this.x, this.endepunktY)
            noFill()
            circle(this.x, this.y +myDistX - 25, this.d2)
            circle(this.x, this.y +myDistX - 50, this.d2)

            stroke('black')
      }
}

const componentToPath = {
      "UAA": SkillebryterOgSeksjon,
      "QBA": Skillebryter, //Endrer denne til SkillebryterOgSeksjon, men må finne en bedre løsning
      "TAA": Trafo,
      "WBC": Line,
      "FCA": Sikring,
      "XBA": Trafosamling,
      // TODO: MAKE THESE CLASSES
}

class ComponentState {
      constructor(x, y, id, type = "component") {
            this.x = x
            this.y = y
            this.id = id
            this.type = type
      }
}