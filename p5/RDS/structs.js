
let canvasHeight = 1425 * 0.70707;
let canvasWidth = 1425;
let myDistX = 100
let myDistY = canvasHeight / 20;


/**Seksjon */
class UAA1 {
      /**
       * 
       * @param {number} x1 
       * @param {number} y1 
       */
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
            line(this.line1StartX, this.lineY, this.line1EndX, this.lineY);
            // first section
            line(this.line1EndX, this.lineY, this.sectionEndX, this.sectionTopY);
            // second section
            line(this.sectionEndX, this.sectionBottomY, this.line2StartX, this.lineY);
            //line from second section to right
            line(this.line2StartX, this.lineY, this.line2EndX, this.lineY);
            strokeWeight(1);
            stroke('black');
            fill('black');
            text('UAA1', this.line1EndX - 10, this.sectionBottomY + 12);
            noFill()


      }

      /**
       * 
       * @param {string} id 
       * @returns {ComponentState} returns a new component state based on the coordinates of the component
       */
      makeComponentState(id) {
            return new ComponentState(this.line2EndX, this.lineY, id, "UAA1");
      }
}

/** Section insulator */
class UAA2 {
      /**
       * 
       * @param {number} x1 
       * @param {number} y1 
       */
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
            line(this.line1StartX, this.lineY, this.line1EndX, this.lineY);
            // first section
            line(
                  this.line1EndX,
                  this.sectionBottomY,
                  this.sectionEndX,
                  this.sectionTopY
            );
            // second section
            line(
                  this.line2StartX,
                  this.sectionBottomY,
                  this.line2StartX,
                  this.sectionTopY
            );
            //line from second section to right
            line(this.line2StartX, this.lineY, this.line2EndX, this.lineY);
            text('UAA1', this.line1EndX - 10, this.sectionBottomY + 12);      
      }

      /**
       * 
       * @param {string} id 
       * @returns {ComponentState} returns a new component state based on the coordinates of the component
       */
      makeComponentState(id) {
            return new ComponentState(this.line2EndX, this.lineY, id, "UAA2");
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

            text('WBC1', this.x1 + myDistX / 2 - 15, this.y1 +20)
      }

      makeComponentState(id) {
            return new ComponentState(this.endPointX, this.endPointY, id, "WBC1");
      }
}

class FCA{
    constructor(x1, y1){
        this.x1 = x1;
        this.y1 = y1;
        this.endPointY = y1 + 10;
    }

    draw(){
        line(this.x1, this.y1, this.x1, this.endPointY);
        rect(this.x1 +2, this.y1, 4, 10);
    }

    makeComponentState(id) {
        return new ComponentState(this.x1, this.y1, id, "FCA");
  }
}

class XBA{ 
    constructor(x, y) {
            this.x = x;
            this.y = y;
    }

    draw() {
            line (this.x , this.y, this.x, this.y - 5);
            triangle(this.x - 2, this.y-5 , this.x +2, this.y-5 , this.x, this.y -10);
            text('XBA1', this.x + 9, this.y)
    }

    makeComponentState(id) {
            return new ComponentState(this.x, this.y, id, "XBA");
    }
}


class B {
      constructor(x, y) {
            this.x = x;
            this.y = y;
            this.d = 30;
      }

      draw() {
            line(this.x, this.y, this.x + this.d, this.y);
            line(this.x + this.d, this.y, this.x + this.d, this.y - 30);
            strokeWeight(2);
            line(this.x + this.d - 5, this.y - 30, this.x + 2*this.d + 5, this.y - 30);
            strokeWeight(1);
            line(this.x + 2 * this.d, this.y - 30, this.x + 2 * this.d, this.y);
            line(this.x + 2 * this.d, this.y, this.x + 3 * this.d, this.y);
            text('WBC1', this.x + 15, this.y - 35)

      }
      makeComponentState(id) {
            return new ComponentState(this.x + 3 * this.d, this.y, id, "WBC");
      }

}


/** Trafo */
class TAA {
      /**
       * 
       * @param {number} x 
       * @param {number} y 
       */
      constructor(x, y) {
            this.x = x;
            this.y = y;

            this.yBottomCircleMid = y - 25;
            this.yTopCircleMid = y - 35;

            this.d = 12;
      }

      draw() {
            noFill();
            circle(this.x, this.yBottomCircleMid, this.d);
            circle(this.x, this.yTopCircleMid, this.d);
            line(this.x, this.yBottomCircleMid + 6, this.x, this.y);
            text('TAA1', this.x + 9, this.yBottomCircleMid )
      }

      makeComponentState(id) {
            return new ComponentState(this.x, this.yTopCircleMid - this.d/2, id, "TAA");
      }
}

class QAB {
    constructor(x1, y1) {
        this.x1 = x1;
        this.x2 = x1 + 30;
        this.y1 = y1;
    }

  draw() {
    
        // Bryteren
        strokeWeight(2);
        line(this.x1, this.y1, this.x1 + 10, this.y1);
        line(this.x1+ 7 , this.y1 - 3, this.x1 + 13, this.y1 + 3);
        line(this.x1+ 7 , this.y1 + 3, this.x1 + 13, this.y1 - 3);
        strokeWeight(1);

        line(this.x1 + 10, this.y1, this.x2, this.y1);

        text('QAB', this.x1 + 5, this.y1 + 15)
  }

  makeComponentState(id) {
    return new ComponentState(this.x2, this.y1 , id, "QAB");
}
}




const componentToPath = {
      UAA1: UAA1,
      UAA2: UAA2,
      /*  QBA1: QBA1,
       QBA2: QBA2,
       QBA3: QBA3, */
      FCA: FCA,
      TAA: TAA,
      XBA: XBA,
      WBC1: WBC1,
      QAB: QAB
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

/** Skillebryter uten motor */
class QBA1 {
      /**
       *
       * @param {number} x1
       * @param {number} y1
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
      /**
       * 
       * @param {number} x1 
       * @param {number} y1 
       */
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