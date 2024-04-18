class Component {
      constructor(path = "") {
            this.path = path;
      }
      get path() {
            return this.path;
      }
}
let canvasHeight = 725;
let canvasWidth = 1425;
let myDistX = canvasWidth / 20;
let myDistY = canvasHeight / 20;

/**Seksjon */

class UAA1 {
      constructor(x1, y1) {
           this.lineLength = 20;
            
            // Start and end points for the first line
           this.line1StartX = x1;
           this.lineY = y1;
           this.line1EndX = x1 + this.lineLength;

           // Start and end points for the first section
           this.sectionEndX = this.line1EndX + 5;
           this.sectionTopY = this.lineY - 8;
           this.sectionBottomY = this.lineY + 8;

           this.line2StartX = this.sectionEndX + 5;
           this.line2EndX = this.line2StartX + this.lineLength;


           
           
      }

      draw() {
            // draw upper and lower line
            strokeWeight(1);
            // line from left to first section
            stroke("blue");
            line(this.line1StartX, this.lineY, this.line1EndX, this.lineY);
            // first section
            stroke("red");
            line(this.line1EndX, this.lineY, this.sectionEndX, this.sectionTopY);
            // second section
            stroke("green");
            line(this.sectionEndX, this.sectionBottomY, this.line2StartX, this.lineY);
            //line from second section to right
            stroke("black");
            line(this.line2StartX, this.lineY, this.line2EndX, this.lineY);
      }
}

/** Section insulator */
class UAA2 {
    constructor(x1, y1) {
         this.lineLength = 22;
          
          // Start and end points for the first line
         this.line1StartX = x1;
         this.lineY = y1;
         this.line1EndX = x1 + this.lineLength;

         // Start and end points for the first section
         this.sectionEndX = this.line1EndX;
         this.sectionTopY = this.lineY - 8;
         this.sectionBottomY = this.lineY + 8;

         this.line2StartX = this.sectionEndX + 6;
         this.line2EndX = this.line2StartX + this.lineLength;
    }

    draw() {
          // draw upper and lower line
          strokeWeight(1);
          // line from left to first section
          stroke("blue");
          line(this.line1StartX, this.lineY, this.line1EndX, this.lineY);
          // first section
          stroke("red");
          line(this.line1EndX, this.sectionBottomY, this.sectionEndX, this.sectionTopY);
          // second section
          stroke("green");
          line(this.line2StartX, this.sectionBottomY, this.line2StartX, this.sectionTopY);
          //line from second section to right
          stroke("black");
          line(this.line2StartX, this.lineY, this.line2EndX, this.lineY);
    }
}

/**Main track */
class WBC1 {
    /**
     * 
     * @param {number} x1 
     * @param {number} y1 
     */
    constructor(x1, y1) {
        this.x1 = x1;
        this.y1 = y1;
        this.endPointX = x1 + myDistX;
        this.endPointY = y1;
    }

    draw() {
        line(this.x1, this.y1, this.endPointX, this.endPointY);
    }   
}


/** Stasjon med 2 spor */
class JE2 {
      constructor(x, y) {
            this.x = x;
            this.y = y;

            this.length = 100;

            // Start and end points for the first line
            this.x1 = this.x;
            this.y1 = this.y;
            this.x2 = this.x + this.length;
            this.y2 = this.y;

            // Start and end points for the second line
            this.x3 = this.x1 + 5;
            this.x4 = this.x2 - 5;

            // top points of the second line
            this.y3 = this.y - 20;
            this.x5 = this.x3 + 10;
            this.x6 = this.x4 - 10;

            
      }

      draw() {
            // main line
            line(this.x1, this.y1, this.x2, this.y2);

            // second line
            line(this.x3, this.y1, this.x5, this.y3);
            line(this.x4, this.y1, this.x6, this.y3);
            line(this.x5, this.y3, this.x6, this.y3);
      }
}

/**
 * Stasjon med 3 spor
 */
class JE3 {
      constructor(x, y) {
            this.x = x;
            this.y = y;

            this.length = 100;

            // Start and end points for the first line
            this.x1 = this.x;
            this.y1 = this.y;
            this.x2 = this.x + this.length;
            this.y2 = this.y;

            // Start and end points for the second line
            this.x3 = this.x1 + 5;
            this.x4 = this.x2 - 5;

            // top points of the second line
            this.y3 = this.y - 20;
            this.x5 = this.x3 + 10;
            this.x6 = this.x4 - 10;

            // Bottom points of the third line
            this.y4 = this.y + 20;
      }

      draw() {
            // main line
            line(this.x1, this.y1, this.x2, this.y2);

            // second line
            line(this.x3, this.y1, this.x5, this.y3);
            line(this.x4, this.y1, this.x6, this.y3);
            line(this.x5, this.y3, this.x6, this.y3);

            // third line
            line(this.x3, this.y1, this.x5, this.y4);
            line(this.x4, this.y1, this.x6, this.y4);
            line(this.x5, this.y4, this.x6, this.y4);
      }
}

/** Skillebryter uten motor */
class QBA1 {
      /**
       *
       * @param {number} x1
       * @param {number} y1
       * @param {number} x2
       * @param {number} y2
       */
      constructor(x1, y1) {
            this.x1 = x1;
            this.x2 = x1 + 50;

            this.bottomPointY = y1;
            this.topPointY = y1 - 25;

            this.gapForSwitch1 = x1 + 15;
            this.gapForSwitch2 = x1 + 35;

            this.connectionX1 = this.x1 + 30;
            this.connectionY1 = this.y1;
            this.connectionX2 = this.x1;
            this.connectionY2 = this.y1;
      }

      draw() {
            // to paralelle linjer oppover
            line(this.x1, this.bottomPointY, this.x1, this.topPointY);
            line(this.x2, this.bottomPointY, this.x2, this.topPointY);

            // en honisontal linje øverst
            line(this.x1, this.topPointY, this.gapForSwitch1, this.topPointY);
            line(this.gapForSwitch2, this.topPointY, this.x2, this.topPointY);

            // Bryteren
            line(
                  this.gapForSwitch2,
                  this.topPointY + 5,
                  this.gapForSwitch2,
                  this.topPointY - 5
            );
            strokeWeight(2);
            line(
                  this.gapForSwitch1,
                  this.topPointY,
                  this.gapForSwitch2,
                  this.topPointY
            );
            strokeWeight(1);
      }
}

/** Lastskillebryter uten motor */
class QBA2 {
      /**
       *
       * @param {number} x1
       * @param {number} y1
       * @param {number} x2
       * @param {number} y2
       */
      constructor(x1, y1) {
            this.x1 = x1;
            this.x2 = x1 + 50;

            this.bottomPointY = y1;
            this.topPointY = y1 - 25;

            this.gapForSwitch1 = x1 + 15;
            this.gapForSwitch2 = x1 + 35;

            this.cricleGap = x1 + 40;

            this.connectionX1 = this.x1 + 30;
            this.connectionY1 = this.y1;
            this.connectionX2 = this.x1;
            this.connectionY2 = this.y1;
      }

      draw() {
            // to paralelle linjer oppover
            line(this.x1, this.bottomPointY, this.x1, this.topPointY);
            line(this.x2, this.bottomPointY, this.x2, this.topPointY);

            // en honisontal linje øverst
            line(this.x1, this.topPointY, this.gapForSwitch1, this.topPointY);
            line(this.cricleGap, this.topPointY, this.x2, this.topPointY);

            // Bryteren
            circle((this.cricleGap + this.gapForSwitch2) / 2, this.topPointY, 5);
            line(
                  this.gapForSwitch2,
                  this.topPointY + 5,
                  this.gapForSwitch2,
                  this.topPointY - 5
            );
            strokeWeight(2);
            line(
                  this.gapForSwitch1,
                  this.topPointY,
                  this.gapForSwitch2,
                  this.topPointY
            );
            strokeWeight(1);
      }
}
/** Sillebryter med motor */
class QBA3 {
      constructor(x1, y1) {
            this.x1 = x1;
            this.x2 = x1 + 50;

            this.bottomPointY = y1;
            this.topPointY = y1 - 25;

            this.gapForSwitch1 = x1 + 15;
            this.gapForSwitch2 = x1 + 35;

            this.motorLineTopPoint = this.topPointY - 15;

            this.connectionX1 = this.x1 + 30;
            this.connectionY1 = this.y1;
            this.connectionX2 = this.x1;
            this.connectionY2 = this.y1;
      }

      draw() {
            // to paralelle linjer oppover
            line(this.x1, this.bottomPointY, this.x1, this.topPointY);
            line(this.x2, this.bottomPointY, this.x2, this.topPointY);

            // en honisontal linje øverst
            line(this.x1, this.topPointY, this.gapForSwitch1, this.topPointY);
            line(this.gapForSwitch2, this.topPointY, this.x2, this.topPointY);

            //motoren
            line(
                  this.gapForSwitch1,
                  this.topPointY,
                  this.gapForSwitch1,
                  this.motorLineTopPoint
            );
            circle(this.gapForSwitch1, this.motorLineTopPoint + 5, 10);

            textSize(8);
            text("M", this.gapForSwitch1 - 3, this.motorLineTopPoint + 8);
            // Bryteren
            line(
                  this.gapForSwitch2,
                  this.topPointY + 5,
                  this.gapForSwitch2,
                  this.topPointY - 5
            );
            strokeWeight(2);
            line(
                  this.gapForSwitch1,
                  this.topPointY,
                  this.gapForSwitch2,
                  this.topPointY
            );
            strokeWeight(1);
      }
}

/** Lastskillebryter med motor */
class QBA4 {
      /**
       *
       * @param {number} x1
       * @param {number} y1
       * @param {number} x2
       * @param {number} y2
       */
      constructor(x1, y1) {
            this.x1 = x1;
            this.x2 = x1 + 50;

            this.bottomPointY = y1;
            this.topPointY = y1 - 25;

            this.gapForSwitch1 = x1 + 15;
            this.gapForSwitch2 = x1 + 35;

            this.motorLineTopPoint = this.topPointY - 15;

            this.cricleGap = x1 + 40;

            this.connectionX1 = this.x1 + 30;
            this.connectionY1 = this.y1;
            this.connectionX2 = this.x1;
            this.connectionY2 = this.y1;
      }

      draw() {
            // to paralelle linjer oppover
            line(this.x1, this.bottomPointY, this.x1, this.topPointY);
            line(this.x2, this.bottomPointY, this.x2, this.topPointY);

            // en honisontal linje øverst
            line(this.x1, this.topPointY, this.gapForSwitch1, this.topPointY);
            line(this.cricleGap, this.topPointY, this.x2, this.topPointY);

            //motoren
            line(
                  this.gapForSwitch1,
                  this.topPointY,
                  this.gapForSwitch1,
                  this.motorLineTopPoint
            );
            circle(this.gapForSwitch1, this.motorLineTopPoint + 5, 10);

            textSize(8);
            text("M", this.gapForSwitch1 - 3, this.motorLineTopPoint + 8);

            // Bryteren
            circle((this.cricleGap + this.gapForSwitch2) / 2, this.topPointY, 5);
            line(
                  this.gapForSwitch2,
                  this.topPointY + 5,
                  this.gapForSwitch2,
                  this.topPointY - 5
            );
            strokeWeight(2);
            line(
                  this.gapForSwitch1,
                  this.topPointY,
                  this.gapForSwitch2,
                  this.topPointY
            );
            strokeWeight(1);
      }
}

class Trafo {
      constructor(x1, y1, x2, y2) {
            // coords for the last line
            this.x = x2;
            this.y = y2;
            this.d = 50;
      }

      draw() {
            noFill();
            circle(this.x, this.y - 25, this.d);
            circle(this.x, this.y - 50, this.d);
      }
}

class Sikring {
      constructor(x1, y1, x2, y2) {
            this.x = x2;
            this.y = y2;
            this.d = 5;
      }

      draw() {
            fill("black");
            circle(this.x, this.y, this.d);
      }
}

class Trafosamling {
      constructor(x1, y1, x2, y2) {
            this.x = x2;
            this.y = y2;
            this.d = 5;
            this.d2 = 30;
            this.connectionX1 = this.x + this.d;
            this.connectionY1 = this.y;

            //endepunkt for linje
            this.endepunktY = this.y + myDistX - 65;
      }

      draw() {
            fill("black");
            circle(this.x, this.y, this.d);
            line(this.x, this.y, this.x, this.endepunktY + myDistX - 35);
            noFill();
            circle(this.x, this.y + myDistX * 1.5 - 25, this.d2);
            circle(this.x, this.y + myDistX * 1.5 - 50, this.d2);

            stroke("black");
      }
}


const componentToPath = {
      "UAA1": UAA1,
      "UAA2": UAA2,
      "QBA1": QBA1,
      "QBA2": QBA2,
      "QBA3": QBA3,
      "JE2": JE2,
      "JE3": JE3,
      "TAA": Trafo,
      "WBC1": WBC1,
      "FCA": Sikring,
      "XBA": Trafosamling,
      // TODO: MAKE THESE CLASSES
};

/**
* a class for storing the state of a component

*/
class ComponentState {
      /**
       *
       * @param {number} x
       * @param {number} y
       * @param {number} id
       * @param {string} type
       */
      constructor(x, y, id, type = "component") {
            this.x = x;
            this.y = y;
            this.id = id;
            this.type = type;
      }
}