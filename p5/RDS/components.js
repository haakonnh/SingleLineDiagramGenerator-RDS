class Component {
    constructor(x1, y1, x2, y2) {
        // hva mere kan vi bruke her?
        this.lastX1 = x1;
        this.lastY1 = y1;
        this.lastX2 = x2;
        this.lastY2 = y2;
    }
}

class Line extends Component {
    constructor(x1, y1, x2, y2) {
        super(x1, y1, x2, y2)

        // connectionX2 and connectionY2 are the ending coords for this element
        this.connectionX1 = this.x1 + myDistX / 2
        this.connectionY1 = this.y1
        this.connectionX2 = this.x1 + myDistX / 2
        this.connectionY2 = this.y1
    }

    draw() {
        line(this.x1, this.y1, this.connectionX, this.connectionY) // temp dist. and y2
    }
}

class Section extends Component {
    constructor(x1, y1, x2, y2) {
        // coords for the last line, trenger egnt ikke dette?
        super(x1, y1, x2, y2)

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

class StationLine extends Component {
    constructor(x1, y1, x2, y2) {
        super(x1, y1, x2, y2)

        this.startX = this.lastX1
        this.startY = this.lastY1
        this.endX = this.lastX2
        this.endY = this.lastY2

        this.upperY = this.startY - myDistY / 2

        this.lengthOfLine = myDistX / 3
    }

    draw() {
        stroke('blue')
        line(this.startX, this.startY, this.startX + this.lengthOfLine, this.upperY) // temp dist. and y2
        line(this.startX + this.lengthOfLine, this.upperY, this.startX + 2*this.lengthOfLine, this.upperY)
        line(this.x1 - myDistX / 6 , this.upperY, this.endX, this.endY)
        stroke('black')
    }
}

