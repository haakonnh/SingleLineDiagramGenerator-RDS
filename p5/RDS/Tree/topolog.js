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

const dataGetter = async () => {
      return await fetch("http://localhost:9090/relations")
            .then((response) => response.json())
            .then((data) => {
                  console.log("data ja", data);
                  return data;
            });
}

// Alt det bullshittet her er fordi javascript er retard og forstår ikke shit
let connData = await dataGetter();


let links = []

const mapper = fetch("http://localhost:9090/idpath").then((response) => response.json()).then((data) => {
      console.log(connData, "HEHEH")
      let formattedData = [];
      Object.entries(connData).forEach(([key, value]) => {
            formattedData.push(value);
      });
      connData = formattedData;
      //console.log("okkk", connData)
      for (const conn of connData) {
            conn.Node1 = data[conn.Node1]
            conn.Node2 = data[conn.Node2]
      }
      for (const link of connData) {
                  
            links.push({source: link.Node1.slice(-4), target: link.Node2.slice(-4), type: "licensing"})
            console.log(links)
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
});


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
                        .duration(500)
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
                        .duration(500)
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
                                          y: (d) => d.x + 30,
                                          "font-size": 20,
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
                        .duration(500)
                        .attrs({
                              x: (d) => d.y + 20,
                              "font-size": 25,
                              fill: "yellow",
                        })
                  );
      }

      updateText(textLinks);
}