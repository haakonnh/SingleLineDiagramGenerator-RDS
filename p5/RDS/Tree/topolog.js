const connData = [{"Node1":73,"Node2":72},{"Node1":4,"Node2":18},{"Node1":77,"Node2":76},{"Node1":25,"Node2":26},{"Node1":25,"Node2":30},{"Node1":75,"Node2":74},{"Node1":18,"Node2":6},{"Node1":76,"Node2":72},{"Node1":26,"Node2":27},{"Node1":26,"Node2":24},{"Node1":30,"Node2":28},{"Node1":30,"Node2":34},{"Node1":74,"Node2":72},{"Node1":28,"Node2":29},{"Node1":34,"Node2":35},{"Node1":34,"Node2":36},{"Node1":34,"Node2":33},{"Node1":72,"Node2":79},{"Node1":36,"Node2":37},{"Node1":33,"Node2":31},{"Node1":33,"Node2":38},{"Node1":79,"Node2":78},{"Node1":79,"Node2":92},{"Node1":31,"Node2":32},{"Node1":38,"Node2":39},{"Node1":38,"Node2":42},{"Node1":92,"Node2":89},{"Node1":42,"Node2":40},{"Node1":42,"Node2":46},{"Node1":40,"Node2":41},{"Node1":46,"Node2":47},{"Node1":46,"Node2":45},{"Node1":47,"Node2":48},{"Node1":45,"Node2":43},{"Node1":45,"Node2":50},{"Node1":48,"Node2":49},{"Node1":43,"Node2":44},{"Node1":50,"Node2":52},{"Node1":52,"Node2":51},{"Node1":51,"Node2":56},{"Node1":56,"Node2":57},{"Node1":56,"Node2":55},{"Node1":57,"Node2":58},{"Node1":55,"Node2":53},{"Node1":55,"Node2":60},{"Node1":58,"Node2":59},{"Node1":53,"Node2":54},{"Node1":60,"Node2":62},{"Node1":62,"Node2":61},{"Node1":62,"Node2":67},{"Node1":61,"Node2":63},{"Node1":67,"Node2":68},{"Node1":67,"Node2":69},{"Node1":67,"Node2":66},{"Node1":66,"Node2":64},{"Node1":66,"Node2":70},{"Node1":64,"Node2":65},{"Node1":70,"Node2":71},{"Node1":71,"Node2":119},{"Node1":119,"Node2":88},{"Node1":88,"Node2":87},{"Node1":88,"Node2":89},{"Node1":88,"Node2":84},{"Node1":87,"Node2":91},{"Node1":87,"Node2":94},{"Node1":84,"Node2":95},{"Node1":91,"Node2":93},{"Node1":95,"Node2":97},{"Node1":97,"Node2":96},{"Node1":97,"Node2":101},{"Node1":101,"Node2":102},{"Node1":101,"Node2":100},{"Node1":102,"Node2":104},{"Node1":100,"Node2":98},{"Node1":100,"Node2":105},{"Node1":98,"Node2":99}]



const hierarchy = {
      name: "",
      value: "",
      children: []
};

const nodeMap = new Map();

function createNodeIfMissing(name, value) {
      if (!nodeMap.has(name)) {
            nodeMap.set(name, {
                  name,
                  value,
                  children: []
            });
            return true;
      }
      return false;
}

const mapper = fetch("http://localhost:9090/idpath").then((response) => response.json()).then((data) => {
      for (const conn of connData) {
            conn.Node1 = data[conn.Node1]
            conn.Node2 = data[conn.Node2]
      }
      console.log("HEIEEHHE",connData)
      for (const link of connData) {
            const parentName = link.Node1.toString();
            const childName = link.Node2.toString();
      
            // Create parent if it doesn't exist
            if (createNodeIfMissing(parentName, parentName.slice(-4))) {
                  hierarchy.children.push(nodeMap.get(parentName));
            }
      
            // Create child if it doesn't exist 
            if (createNodeIfMissing(childName, childName.slice(-4))) {
                  nodeMap.get(parentName).children.push(nodeMap.get(childName));
            }
      }
      
      console.log(hierarchy);
      parentFunction(hierarchy);
      return data;
}
);


/* fetch("myData.json")
      .then(function (resp) {
            return resp.json();
      })
      .then(function (data) {
            console.log("Test");
            parentFunction(data);
      }); */

function parentFunction(jsondata) {
      console.log("the data is");
      console.log(jsondata);

      let mouseX = 0;
      //these global variables I should later get via closure
      let buttonTracker = [];
      let rootNode = d3.hierarchy(jsondata, (d) => d.children);
      var pathLinks = rootNode.links();
      var updatePathLinks;

      var circleLinks = rootNode.descendants();
      var updateCircleLinks;

      var textLinks = rootNode.descendants();
      var updateTextLinks;

      let dim = {
            width: window.screen.width * 2,
            height: window.screen.height * 3.7,
            margin: 40,
      };

      let svg = d3
            .select("#chart")
            .append("svg")
            .style("background", "black")
            .attrs(dim);

      document.querySelector("#chart").classList.add("center");

      //let rootNode = d3.hierarchy(data);

      let g = svg.append("g").attr("transform", "translate(140,50)");

      let layout = d3.tree().size([dim.height - 50, dim.width - 320]);

      layout(rootNode);
      console.log(rootNode.links());
      console.log("----------------------");
      console.log(rootNode.descendants());
      //console.log(rootNode.descendants());
      //first lets create a path
      let lines = g.selectAll("path");

      function update(data) {
            let group = g
                  .selectAll("path")
                  .data(data, (d, i) => d.target.data.name)
                  .join(
                        function (enter) {
                              return enter.append("path").attrs({
                                    d: d3
                                          .linkVertical()
                                          .x((d) => mouseX)
                                          .y((d) => d.x),
                                    fill: "none",
                                    stroke: "white",
                              });
                        },
                        function (update) {
                              return update;
                        },
                        function (exit) {
                              return exit.call((path) =>
                                    path
                                    .transition()
                                    .duration(300)
                                    .remove()
                                    .attr(
                                          "d",
                                          d3
                                          .linkVertical()
                                          .x((d) => mouseX)
                                          .y((d) => d.x)
                                    )
                              );
                        }
                  )
                  .call((path) =>
                        path
                        .transition()
                        .duration(1000)
                        .attr(
                              "d",
                              d3
                              .linkHorizontal()
                              .x((d) => d.y)
                              .y((d) => d.x)
                        )
                        .attr("id", function (d, i) {
                              return "path" + i;
                        })
                  );
      }
      update(pathLinks); //rootNode.links()

      function updateCircles(data) {
            g.selectAll("circle")
                  .data(data, (d) => d.data.name)
                  .join(
                        function (enter) {
                              return enter.append("circle").attrs({
                                    cx: (d) => mouseX,
                                    cy: (d) => d.x,
                                    r: 15,
                                    fill: (d) => {
                                          if (d.children == undefined) {
                                                return "red";
                                          }
                                          return "green";
                                    },
                                    id: (d, i) => d.data.name,
                                    class: "sel",
                              });
                        },
                        function (update) {
                              return update;
                        },
                        function (exit) {
                              return exit.call((path) =>
                                    path
                                    .transition()
                                    .duration(300)
                                    .remove()
                                    .attrs({
                                          cx: (d) => mouseX,
                                          r: (d) => 0,
                                    })
                              );
                        }
                  )
                  .call((circle) =>
                        circle
                        .transition()
                        .duration(1000)
                        .attr("cx", (d) => d.y)
                  )

                  .on("mouseover", function (d) {
                        d3.select(this)
                              .attrs({
                                    fill: "orange",
                              })
                              .transition()
                              .duration(100)
                              .attr("r", 12);
                  })
                  .on("mouseout", function (d) {
                        d3.select(this)
                              .attr("fill", (d) => {
                                    if (d.children == undefined) {
                                          return "red";
                                    }
                                    return "green";
                              })
                              .transition()
                              .duration(100)
                              .attr("r", 16);
                  })
                  .on("click", async function (d) {
                        let buttonId = d3.select(this)["_groups"][0][0]["attributes"].id.value;
                        mouseX = d3.select(this)["_groups"][0][0]["attributes"].cx.value;
                        //check to see if button already exists aka has been clicked
                        //if it does, we need to send that data to update function
                        //and remove that object

                        let checkButtonExists = buttonTracker.filter(
                              (button) => button.buttonId == buttonId
                        );

                        if (checkButtonExists[0] != undefined) {
                              //also remove this item from button tracker
                              buttonTracker = buttonTracker.filter(
                                    (button) => button.buttonId != buttonId
                              );

                              //handle path update
                              pathLinks = checkButtonExists[0].buttonPathData.concat(pathLinks);

                              update(pathLinks);

                              //handle  circle update
                              circleLinks =
                                    checkButtonExists[0].buttonCircleData.concat(circleLinks);
                              updateCircles(circleLinks);

                              //handle text update

                              textLinks = checkButtonExists[0].buttonTextData.concat(textLinks);
                              updateText(textLinks);

                              return;
                        }

                        var valueArray = await processedlinks(d.links());

                        updatePathLinks = pathLinks.filter(function (item) {
                              return !valueArray.includes(item.target.data.name);
                        });

                        //now run the filter to get unfiltered items
                        var clickedPathData = pathLinks.filter(function (item) {
                              return valueArray.includes(item.target.data.name);
                        });

                        updateCircleLinks = circleLinks.filter(function (item) {
                              return !valueArray.includes(item.data.name);
                        });

                        var clickedCircleData = circleLinks.filter(function (item) {
                              return valueArray.includes(item.data.name);
                        });

                        updateTextLinks = textLinks.filter(function (item) {
                              return !valueArray.includes(item.data.name);
                        });

                        var clickedTextData = textLinks.filter(function (item) {
                              return valueArray.includes(item.data.name);
                        });

                        //now we push the circleData to an array
                        buttonTracker.push({
                              buttonId: buttonId,
                              buttonPathData: clickedPathData,
                              buttonCircleData: clickedCircleData,
                              buttonTextData: clickedTextData,
                        });

                        update(updatePathLinks);
                        updateCircles(updateCircleLinks);
                        updateText(updateTextLinks);
                        async function processedlinks(dlinks) {
                              var valueArray = [];

                              return new Promise((resolve, reject) => {
                                    dlinks.forEach(async (element) => {
                                          valueArray.push(element.target.data.name);
                                    });
                                    resolve(valueArray);
                              });
                        }

                        pathLinks = updatePathLinks;
                        circleLinks = updateCircleLinks;
                        textLinks = updateTextLinks;
                  });
      }

      updateCircles(rootNode.descendants());

      function updateText(data) {
            g.selectAll("text")
                  .data(data, (d) => d.data.value)
                  .join(
                        function (enter) {
                              return enter
                                    .append("text")
                                    .attrs({
                                          x: (d) => mouseX,
                                          y: (d) => d.x,
                                          "font-size": 0,
                                    })
                                    .text((d) => d.data.value);
                        },
                        function (update) {
                              return update;
                        },
                        function (exit) {
                              return exit.call((text) =>
                                    text
                                    .transition()
                                    .duration(300)
                                    .remove()
                                    .attrs({
                                          x: (d) => mouseX,
                                          "font-size": 0,
                                    })
                              );
                        }
                  )
                  .call((text) =>
                        text
                        .transition()
                        .duration(1000)
                        .attrs({
                              x: (d) => d.y + 20,
                              "font-size": 15,
                              fill: "yellow",
                        })
                  );
      }

      updateText(textLinks);
}