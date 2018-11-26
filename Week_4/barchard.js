function start () {
  d3.select("head")
    .append("title")
    .text("Barchard, National Depth");

  d3.select("body")
    .append("h1")
    .text("2015 Depth per European country in % to the GPD")

  d3.select("body")
    .append("div")
    .attr("class", "barContainer");

  graph ();

  d3.select("body")
    .append("h3")
    .text("this graph shows the depth of each european country in % of the GDP in 2015");

  d3.select("body")
    .append("h5")
    .text("This graph is made by Jesse Groot 10112579");
};

function graph () {

  var graphData = [0,250],
      w         = 1000,
      h         = 500;

  // xData = []
  // yData = []

  data1 = []

  d3.csv("data.csv", function(data) {
    data2 = []
    x = 0
    for (variable in data) {
      if (variable === "LOCATION") {
        xData.push(data[variable])
      } else if (variable === "Value") {
        yData.push(data[variable])
        x = 1
      } else if (x === 1) {
        data1.push()
      };
    };
    console.log(data)
    canvas = d3.select(".barContainer")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    canvas.selectAll("div")
      .data(data)
      .enter()
      .append("div")
        .attr("class", "bar")
          .attr("transform", function(d){
            return "translate(" + xData + "," + yData + ")";
          })
  });

  // d3.csv("path/to/file.csv")
  //   .row(function(d) { return {key: d.key, value: +d.value}; })
  //   .get(function(error, rows) { console.log(rows); });

  // // get json file name and call XMLHttpRequest
  // var fileName = "data.csv";
  // var txtFile = new XMLHttpRequest();
  // txtFile.onreadystatechange = function() {
  //     // When file loaded
  //     if (txtFile.readyState === 4 && txtFile.status == 200) {
  //       d3.csv(fileName, function(d) {
  //         console.log(d[0])
  //       })
  //     };
  // };
  // txtFile.open("GET", fileName);
  // txtFile.send();


  // var scaling = d3.scale.linear()
  //   .domain(graphData)
  //   .range([0,w]);

  // canvas = d3.select(".barContainer")
  //   .append("svg")
  //   .attr("width", w)
  //   .attr("height", h);
  //
  // canvas.selectAll("div")
  //   .data(data)
  //   .enter()
  //   .append("div")
  //     .attr("class", "bar")
  //       .attr("transform", function(d){
  //         return "translate(" + xData + "," + yData + ")";
  //       })
      // .style("height", function(d) {
      //   var barHeight = d * 5;
      //   return barHeight + "px";
      // });

  // var graphBars = canvas.selectAll("rect")
  //   .data(dataset)
  //   .enter()
  //   .append("rect")
  //   .attr("fill", "blue")
  //   .attr("width", function (d)
  //   {
  //     return d;
  //   })
  //   .attr("height", 20)
  //   .attr("y", function (d, i)
  //   {
  //     return i * 30;
  //   });


    // var rect = canvas.selectAll("div")
    //   .data(dataset)
    //   .enter()
    //   .append("div")
    //   .attr("class", "bar")
    //   .style("height", function(d) {
    //     var barHeight = d * 5;
    //     return barHeight + "px";
    //   })
    //   // .attr("fill", "orange")
    //   // .attr("cx", function (d,i)
    //   // {
    //   //   return d + (i * 100);
    //   // })
    //   // .attr("cy", function (d)
    //   // {
    //   //   return d;
    //   // })
    //   // .attr("r", function (d)
    //   // {
    //   //   return d;
    //   // });


  // var dataset = [];                        //Initialize empty array
  // for (var i = 0; i < 25; i++) {           //Loop 25 times
  //     var newNumber = Math.random() * 30;  //New random number (0-30)
  //     dataset.push(newNumber);             //Add new number to array
  // };
  //
  // var svg = d3.select("body")
  //   .append("svg")
  //   .attr("width", w)
  //   .attr("height", h);
  //
  // var bar = svg.selectAll("bar")
  //   .data(dataset)
  //   .enter()
  //   .append("bar");
  //
  // bar.attr("cx", function(d, i) {
  //     return (i * 50) + 25;
  //   })
  //   .attr("cy", h/2)
  //   .attr("r", function(d) {
  //     return d;
  //   });

  //   var dataset = [];                        //Initialize empty array
  // for (var i = 0; i < 25; i++) {           //Loop 25 times
  //     var newNumber = Math.random() * 30;  //New random number (0-30)
  //     dataset.push(newNumber);             //Add new number to array
  // }
  //
  // d3.select("body").selectAll("div")
  //   .data(dataset)  // <-- The answer is here!
  //   .enter()
  //   .append("div")
  //   .attr("class", "bar")
  //   .style("height", function(d) {
  //       var barHeight = d * 5;
  //       return barHeight + "px";
  //   });
  //
  // d3.select("body").selectAll("p")
  //   .data(dataset)
  //   .enter()
  //   .append("p")
  //   .style("color", function(d) {
  //     if (d > 15) {
  //         return "red";
  //     } else {
  //         return "black";
  //     }
  //   })
  //   .text(function(d) { return d });
  //
  // console.log(d3.selectAll("p"))
}
