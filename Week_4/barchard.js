// Name: Jesse Groot
// Student number: 11012579

/**
This program draws a barchard of the % depth against the GDP per country
**/

function start () {
  // make title of site
  d3.select("head")
    .append("title")
    .text("Barchard, National Depth");

  // make title of graph
  d3.select("body")
    .append("h1")
    .text("2015 Depth per European country in % to the GPD")

  // make div where the graph will be
  d3.select("body")
    .append("div")
    .attr("class", "barContainer");

  // call function to make the graph
  graph ();

  // make discription of the graph
  d3.select("body")
    .append("h3")
    .text("this graph shows the depth of each european country in % of the GDP in 2015");

  // make made by
  d3.select("body")
    .append("h5")
    .text("This graph is made by Jesse Groot 10112579");
};

function graph () {

  // standard variables
  var graphData = [0,250],
      canvasWidth = 1000,
      canvasHeight = 500,
      barPadding = 5,
      margin = { top: 20, right: 20, bottom: 50, left: 50 };

  // the data since loading didnt work
  var data = [];
  for (var i = 0; i < 10; i++) {
      // creates random number between 0 and 250
      var newNumber = Math.random() * 250;
      data.push(newNumber);
  };
  xData = ["NET","BED", "KET", "GET", "SLE", "TTT", "WDF", "OPT", "GRC", "IHD"];

  // make width and height for graph (exluding space for labels)
  var width = canvasWidth - margin.left - margin.right;
  var height = canvasHeight - margin.bottom;
  // make width of each bar
  var barWidth = (width/(data.length));

  // the data in a few ways but non worked...
  // xData = []
  // yData = []
  //
  // d3.csv("data.csv"), function(data) {
  //   for (variable in data) {
  //     if (variable === "LOCATION") {
  //       xData.push(data[variable]);
  //     } else if (variable === "Value") {
  //       yData.push(data[variable]);
  //       console.log(data[variable]);
  //     };
  //   };
  // };
  // // console.log(yData)
  //
  // // Get the data
  // d3.csv("data.csv", function(error, data) {
  //   if (error) throw error;
  //
  //   // format the data
  //   data.forEach(function(d) {
  //     d.LOCATION = +d.LOCATION;
  //     d.Value = +d.Value;
  //     console.log(d)
  //     console.log(d.LOCATION)
  //   });
  //
  //   // console.log(data)
  //   // console.log(d.LOCATION)
  //   // console.log(d.Value)
  // })

  // make canvas in correct place
  canvas = d3.select(".barContainer")
    .append("svg")
    .attr("width", canvasWidth)
    .attr("height", canvasHeight);

  // make the correct scaling for the x and y labels
  var xScale = d3.scaleLinear()
    .domain([0, xData.length-1])
    .range([(margin.left + barWidth/2), width])
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([height, margin.top]);

  // makes a line so X and Y label hit each other
  var line = canvas.append("line")
    .attr("x1", 50)
    .attr("x2", width+50)
    .attr("y1", height)
    .attr("y2", height)
    .attr("stroke", "black")
    .attr("stroke-width", 2)

  // make the x and y axis somehow also does labeling....
  var x_axis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(function(d) { return xData[d]; });
  var y_axis = d3.axisLeft()
    .scale(yScale);

  // makes sure g (the y axis) starts at the right place
  canvas.append("g")
    .attr("transform", "translate("+ margin.left +", 0)")
    .call(y_axis);

  //// makes sure g (the x axis) starts at the right place
  canvas.append("g")
    .attr("transform", "translate( 0," + height +")")
    .call(x_axis);

  // text label for the x axis
  canvas.append("text")
      .attr("transform","translate(" + (width/2) + " ," + (canvasHeight - margin.bottom + 40) + ")")
      .style("text-anchor", "middle")
      .text("Lands");

  // text label for the y axis
  canvas.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 + margin.left - 30)
    .attr("x", -((height + margin.top)/2))
    .style("text-anchor", "middle")
    .text("The % depth");

  // makes the bars
  canvas.selectAll("rect")
    .data(data)
    // makes it iterate over the date as --> d
    .enter()
    // makes bar
    .append("rect")
    // selects height of bar from where it has to start
    .attr("y", function(d) {
      return height - (height-margin.top)/d3.max(data)*d;
    })
    // height of the bar
    .attr("height", function(d) {
      return (height-margin.top)/d3.max(data)*d;
    })
    // selects barPadding
    .attr("width", barWidth - barPadding)
    // makes sure bars are placed after each other
    .attr("transform", function (d,i) {
    var translate = [(barWidth * i + margin.left + barPadding/2), 0];
      return ("translate("+ translate +")")
    })
}

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
