/// <reference path="p5files/p5.global-mode.d.ts" />
/// <reference path="p5files/p5.d.ts" />
// import fs as es module

/* 
This file contains the functions that are used to draw the components on the screen.
*/


/**
 * @param {Component} node 
 * @param {Connection[]} connections 
 * @returns {Component[]}
 */
function getParallellLines(node, connections) {
      let neighbours = []
      for (let connection of connections) {
            if (connection.Component1.ID == node.ID && connection.Component2.Type.getWord() == "WBC") {
                  neighbours.push(connection.Component2)
            }
      }
      return neighbours
}

/**
 * draws a triple track station to the screen, instantiates a new 
 * track component state and appends it to the drawnComponents array
 * @param {Coordinates} lastComponentCoords 
 * @param {number} length 
 * @param {ComponentState[]} drawnComponents 
 * @param {Component[]} stationLines 
 */
function drawTripleTrackStation(lastComponentCoords, length, drawnComponents, stationLines) {
      const x1 = lastComponentCoords.x + 10;
      const y1 = lastComponentCoords.y;

      const x2 = x1 + length;
      const y2 = y1;

      const x3 = x1 + 5;
      const x4 = x2 - 5;

      const y3 = y1 - 20;
      const x5 = x3 + 10;
      const x6 = x4 - 10;

      const y4 = y1 + 20;

      // create three new components for the middle, upper and lower connections and add them to the drawnComponents array
      const connUpperX = x1 + length / 2;
      const connUpperY = y3;

      upperComponent = new ComponentState(connUpperX, connUpperY, stationLines[0].ID, "WBC")
      drawnComponents.push(upperComponent)

      const connLowerX = x1 + length / 2;
      const connLowerY = y4;
      lowerComponent = new ComponentState(connLowerX, connLowerY, stationLines[1].ID, "WBC")
      drawnComponents.push(lowerComponent)

      // main line
      const connMiddleX = x1 + length + 10;
      const connMiddleY = y1;
      middleComponent = new ComponentState(connMiddleX, connMiddleY, stationLines[2].ID, "WBC")
      drawnComponents.push(middleComponent)

      // straight middle line
      line(x1 - 10, y1, x2 + 10, y2);

      // upper line
      line(x3, y1, x5, y3);
      line(x4, y1, x6, y3);
      line(x5, y3, x6, y3);

      // lower line
      line(x3, y1, x5, y4);
      line(x4, y1, x6, y4);
      line(x5, y4, x6, y4);

      fill('black');
      text(getLast(stationLines[0].Path), connUpperX - 15, connUpperY + 14);
      text(getLast(stationLines[2].Path), connMiddleX - length / 2 - 25, connMiddleY + 14);
      text(getLast(stationLines[1].Path), connLowerX - 15, connLowerY + 14);
      noFill()
}

/**
 * draws a double track station to the screen, instantiates a new 
 * track component state and appends it to the drawnComponents array
 * @param {Coordinates} lastComponentCoords 
 * @param {number} length 
 * @param {ComponentState[]} drawnComponents
 * @param {Component[]} stationLines
 */
function drawDoubleTrackStation(lastComponentCoords, length, drawnComponents, stationLines, stationType) {
      const x1 = lastComponentCoords.x + 10;
      const y1 = lastComponentCoords.y;

      const x2 = x1 + length;
      const y2 = y1;

      const x3 = x1 + 5;
      const x4 = x2 - 5;

      const y3 = y1 - 20;
      const x5 = x3 + 10;
      const x6 = x4 - 10;

      // create two new components for the two lines and add them to the drawnComponents array
      const connUpperX = x1 + length / 2;
      const connUpperY = y3;

      if (stationType == "KL1") {
            upperComponent = new ComponentState(connUpperX, connUpperY, stationLines[0].ID, "WBC")
            drawnComponents.push(upperComponent)
            text(getLast(stationLines[0].Path), connUpperX - 15, connUpperY + 14);

            line(x3, y1, x5, y3);
            line(x4, y1, x6, y3);
            line(x5, y3, x6, y3);
      } else if (stationType == "KL2") {
            let lowerY = y1 + 20
            lowerComponent = new ComponentState(connUpperX, lowerY, stationLines[0].ID, "WBC")
            drawnComponents.push(lowerComponent)
            
            text(getLast(stationLines[0].Path), connUpperX - 15, lowerY + 14);
            line(x3, y1, x5, lowerY);
            line(x4, y1, x6, lowerY);
            line(x5, lowerY, x6, lowerY);
      }

      const connMiddleX = x1 + length + 10;
      const connMiddleY = y1;
      const middleComponent = new ComponentState(connMiddleX, connMiddleY, stationLines[1].ID, "WBC")
      drawnComponents.push(middleComponent)

      // TODO FIX THE INDEX THING HER

      // middle line
      line(x1 - 10, y1, x2 + 10, y2);



      fill('black');
      text(getLast(stationLines[1].Path), connMiddleX - length / 2 - 25, connMiddleY + 14);
      noFill()
}


/**
 * draws a station dependent on the number of tracks on the station
 * @param {Component} fromComponent the component which the station is connected to
 * @param {Component} mainLine the node which the station is connected to
 * @param {ComponentState[]} drawnComponents  this is wrong, drawn components is a ComponentState[]
 * @param {Connection[]} connections list of connections
 */
function drawStation(fromComponent, mainLine, drawnComponents, connections) {
      /**
       * list of neighbor nodes
       * @type {Component[]}
       */
      let neighbours = getParallellLines(mainLine, connections)
      // filter out the neighbours that are not WBC
      /**
       * list of lines composing the station.
       * last element should always be the last component
       * @type {Component[]}
       */
      neighbours.push(mainLine)

      const fromComponentState = findComponentState(fromComponent.ID, drawnComponents)

      const length = 100

      /** @type {Coordinates} */
      let coords = {
            x: fromComponentState.x,
            y: fromComponentState.y
      }

      if (neighbours.length == 2) { // two tracks
            const splitArray = neighbours[0].Path.split('.')
            let higherTechnicalPath = ""
            for (let i = 0; i < splitArray.length - 2; i++) {
                  higherTechnicalPath += splitArray[i] + "."
            }
            /** @type {Component} */
            let higherTechnicalObject;
            higherTechnicalPath = higherTechnicalPath.substring(0, higherTechnicalPath.length - 1)
            Object.entries(fetchedData).forEach(([key, value]) => {
                  if (value.Path == higherTechnicalPath) {
                        higherTechnicalObject = value
                  }
            });

            drawDoubleTrackStation(coords, length, drawnComponents, neighbours, higherTechnicalObject.Type)
      }

      if (neighbours.length == 3) { // three tracks
            drawTripleTrackStation(coords, length, drawnComponents, neighbours)
      }

      //console.log("Drawn: ", drawnComponents)
}

/**
 * 
 * @param {Coordinates} lastComponentCoords
 * @param {number} length
 * @param {ComponentState[]} drawnComponents
 * @param {Component} switchComponent
 */
function drawSwitchForSection(lastComponentCoords, length, drawnComponents, switchComponent) {
      const x1 = lastComponentCoords.x;
      const x2 = x1 - 50;

      const bottomPointY = lastComponentCoords.y;
      const topPointY = lastComponentCoords.y - 25;

      const gapForSwitch1 = x1 - 15;
      const gapForSwitch2 = x2 + 35;

      const motorLineTopPoint = topPointY - 25;

      const cricleGap = x1 - 20;

      line(x1, bottomPointY, x1, topPointY);
      line(x2, bottomPointY, x2, topPointY);

      line(x1, topPointY, gapForSwitch1, topPointY);
      line(cricleGap, topPointY, x2, topPointY);


      strokeWeight(2);
      line(gapForSwitch2, topPointY + 5, gapForSwitch2, topPointY - 5);
      line(gapForSwitch1 - 20, topPointY, gapForSwitch2, topPointY);
      strokeWeight(1);
      if (switchComponent.Type == "QBA2") {
            fill('white');
            circle((cricleGap + gapForSwitch2) / 2, topPointY, 5);
      } else if (switchComponent.Type == "QBA3") {
            fill('white');
            line(
                  gapForSwitch1 - 5,
                  topPointY,
                  gapForSwitch1 - 5,
                  motorLineTopPoint
            );
            circle(gapForSwitch1 - 5, motorLineTopPoint - 5, 10);

            fill('black');
            textSize(8);
            text("M", gapForSwitch1 - 8, motorLineTopPoint - 3);

      } else if (switchComponent.Type == "QBA4") {
            fill('white');
            circle((cricleGap + gapForSwitch2) / 2, topPointY, 5);


            line(
                  gapForSwitch1 - 5,
                  topPointY,
                  gapForSwitch1 - 5,
                  motorLineTopPoint
            );
            circle(gapForSwitch1 - 5, motorLineTopPoint - 5, 10);
            fill('black');
            textSize(8);
            text("M", gapForSwitch1 - 8, motorLineTopPoint - 3);
      }
      textSize(12)


      stroke('black');
      fill('black');
      text(getLast(switchComponent.Path), cricleGap - 20, topPointY - 10);
      noFill();
}

/**
 * 
 * @param {Coordinates} lastComponentCoords
 * @param {number} length
 * @param {ComponentState[]} drawnComponents
 * @param {Component} switchComponent
 */
function drawSwitchForTransformer(lastComponentCoords, length, drawnComponents, switchComponent) {
      const x1 = lastComponentCoords.x;
      const switchWidth = 3;

      const y1 = lastComponentCoords.y;
      const y2 = y1 - 50;

      const startOfSwitch = y2 + 10

      const state = new ComponentState(x1, y2, switchComponent.ID, "QBA")
      drawnComponents.push(state)

      line(x1, y1, x1, y2);

      strokeWeight(2);
      line(x1, startOfSwitch, x1, y2);
      line(x1 + switchWidth, y2, x1 - switchWidth, y2);

      strokeWeight(1);
      fill('black');
      stroke('black')
      text(getLast(switchComponent.Path), x1 + 8, y2 + 7.5);
}

/**
 * 
 * @param {Coordinates} lastComponentCoords
 * @param {number} length
 * @param {ComponentState[]} drawnComponents
 * @param {Component} switchComponent
 */
function drawSwitchForTransformerOnMainLine(lastComponentCoords, length, drawnComponents, switchComponent) {
      const x1 = lastComponentCoords.x - myDistX / 2;
      const switchWidth = 3;

      const y1 = lastComponentCoords.y;
      const y2 = y1 - 50;

      const startOfSwitch = y2 + 10

      const state = new ComponentState(x1, y2, switchComponent.ID, "QBA")
      drawnComponents.push(state)

      line(x1, y1, x1, y2);

      strokeWeight(2);
      line(x1, startOfSwitch, x1, y2);
      line(x1 + switchWidth, y2, x1 - switchWidth, y2);
      strokeWeight(1);
      fill('black');
      stroke('black')
      text(getLast(switchComponent.Path), x1 + 8, y2 + 7.5);
      noFill()
}

/**
 * 
 * @param {Coordinates} lastComponentCoords
 * @param {number} length
 * @param {ComponentState[]} drawnComponents
 * @param {Component} switchComponent
 */
function drawSwitchForPowerSwitch(lastComponentCoords, length, drawnComponents, switchComponent) {
      const x1 = lastComponentCoords.x
      const switchWidth = 4;
      const x2 = x1 + 25
      const y1 = lastComponentCoords.y;
      const y2 = y1;


      const state = new ComponentState(x2 + 30, y2, switchComponent.ID, "QBA")
      drawnComponents.push(state)

      line(x1, y1, x2, y2);

      strokeWeight(2);
      line(x2, y1, x2 + 20, y2);
      line(x2 + 20, y2 + switchWidth, x2 + 20, y2 - switchWidth);
      strokeWeight(1);
      line(x2 + 20, y2, x2 + 30, y2);
      
      stroke('black')
      text(getLast(switchComponent.Path), x2 - 3, y2 + 15);
      noFill()
}



/**
 * 
 * @param {Component} fromComponent 
 * @param {Component} switchComponent 
 * @param {ComponentState[]} drawnComponents 
 * @param {Connection[]} connections 
 */
function drawSwitch(fromComponent, switchComponent, drawnComponents, connections) {
      const fromComponentState = findComponentState(fromComponent.ID, drawnComponents)
      /** @type {Coordinates} */
      let coords = {
            x: fromComponentState.x,
            y: fromComponentState.y
      }
      
      if (getLast(fromComponent.Path).getWord() == "UAA") {
            drawSwitchForSection(coords, 100, drawnComponents, switchComponent)
      } else if (fromComponent.Type == "WBC1") {
            drawSwitchForTransformerOnMainLine(coords, 100, drawnComponents, switchComponent)
      } else if (getLast(fromComponent.Path).getWord() == "WBC" || getLast(fromComponent.Path).getWord() == "XBA") {
            drawSwitchForTransformer(coords, 100, drawnComponents, switchComponent)
      } else if (getLast(fromComponent.Path).getWord() == "QAB") {
            drawSwitchForPowerSwitch(coords, 100, drawnComponents, switchComponent)
      }
}

/**
 * 
 * @param {Component} fromComponent
 * @param {Component} transformerComponent
 * @param {ComponentState[]} drawnComponents
 * @param {Connection[]} connections
 */
function drawTransformer(fromComponent, transformerComponent, drawnComponents) {
      const fromComponentState = findComponentState(fromComponent.ID, drawnComponents)
      /** @type {Coordinates} */
      let coords = {
            x: fromComponentState.x,
            y: fromComponentState.y
      }

      const yBottomCircleMid = fromComponentState.y - 35;
      const yTopCircleMid = fromComponentState.y - 45;

      const d = 12;

      
      if (fromComponent.Type == "WBC1") {
            line(fromComponentState.x - myDistX / 2, yBottomCircleMid + 6, fromComponentState.x - myDistX / 2, fromComponentState.y);
            circle(fromComponentState.x - myDistX / 2, yBottomCircleMid, d);
            circle(fromComponentState.x - myDistX / 2, yTopCircleMid, d);
            stroke('black')
            fill('black')
            strokeWeight(1)
            text(getLast(transformerComponent.Path), fromComponentState.x - myDistX / 2 + 10, yTopCircleMid + d - 3)
            noFill()

      } else {
            line(fromComponentState.x, yBottomCircleMid + 6, fromComponentState.x, fromComponentState.y);
            circle(fromComponentState.x, yBottomCircleMid, d);
            circle(fromComponentState.x, yTopCircleMid, d);
            stroke('black')
            fill('black')
            strokeWeight(1)
            text(getLast(transformerComponent.Path), fromComponentState.x + 10, yTopCircleMid + d - 3)
      }


      strokeWeight(1)

}

/**
 * 
 * @param {Component} fromComponent
 * @param {Component} fuseComponent
 * @param {ComponentState[]} drawnComponents
 * @param {Connection[]} connections
 */
function drawFuse(fromComponent, fuseComponent, drawnComponents) {
      const fromComponentState = findComponentState(fromComponent.ID, drawnComponents)
      /** @type {Coordinates} */
      let coords = {
            x: fromComponentState.x,
            y: fromComponentState.y
      }

      
      if (fromComponent.Type == "WBC1") {
            line(coords.x - myDistX / 2, coords.y, coords.x - myDistX / 2, coords.y - 30);


            line(coords.x - myDistX / 2, coords.y - 30, coords.x - myDistX / 2, coords.y - 40);
            rect(coords.x - myDistX / 2 - 2.5, coords.y - 40, 5, 10);
            stroke('black')
            fill('black')
            strokeWeight(1)
            text(getLast(fuseComponent.Path), coords.x - myDistX / 2 + 8.5, coords.y - 31)
            noFill()

            const state = new ComponentState(coords.x - myDistX / 2, coords.y - 40, fuseComponent.ID, "FCA")
            drawnComponents.push(state)

      } else {
            line(coords.x, coords.y, coords.x, coords.y - 15);

            line(coords.x, coords.y - 15, coords.x, coords.y - 25);
            rect(coords.x - 2.5, coords.y - 25, 5, 10);
            stroke('black')
            fill('black')
            strokeWeight(1)
            text(getLast(fuseComponent.Path), coords.x + 8.5, coords.y - 16)

            const state = new ComponentState(coords.x, coords.y - 25, fuseComponent.ID, "FCA")
            drawnComponents.push(state)
      }

}