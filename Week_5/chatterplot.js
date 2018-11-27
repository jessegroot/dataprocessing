function start () {
  // make title of site
  d3.select("head")
    .append("title")
    .text("chatterplot");

  // make title of graph
  d3.select("body")
    .append("h1")
    .text("the GDP of a country VS crimerate")

  // make div where the graph will be
  d3.select("body")
    .append("div")
    .attr("class", "chatterContainer");

  // call function to make the graph
  graph ();

  // make discription of the graph
  d3.select("body")
    .append("h3")
    .text("this graph shows corralation between GDP and the Crime rate in a country");

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
      margin = { top: 20, right: 20, bottom: 40, left: 60 };

  // the data since loading didnt work
  yData = [25, 8, 67, 25, 47, 13, 43, 95, 67, 26];
  xData = [25, 8, 67, 25, 47, 13, 43, 95, 67, 26];

  // make width and height for graph (exluding space for labels)
  var width = canvasWidth - margin.left - margin.right;
  var height = canvasHeight - margin.bottom - margin.top;
  // make width of each bar
  var barWidth = (width/(data.length));

  // make canvas in correct place
  canvas = d3.select(".chatterContainer")
    .append("svg")
    .attr("width", canvasWidth)
    .attr("height", canvasHeight);

  // make the correct scaling for the x and y
  var xScale = d3.scaleLinear()
    .domain([0, d3.max(xData)])
    .range([0, width]);
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(yData)])
    .range([height, 0]);

  // make the x and y axis somehow also does labeling....
  var x_axis = d3.axisBottom()
    .scale(xScale)
  var y_axis = d3.axisLeft()
    .scale(yScale)

  // makes sure g (the y axis) starts at the right place
  canvas.append("g")
    .attr("transform", "translate(50, 0)")
    .call(y_axis);

  //// makes sure g (the x axis) starts at the right place
  canvas.append("g")
    .attr("transform", "translate(50, "+ (height+margin.top) + ")")
    .call(x_axis);

  // text label for the x axis
  canvas.append("text")
    .attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("The GDP of lands in millions");

  // text label for the y axis
  canvas.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", margin.left/2)
    .attr("x", -(height / 2)-20)
    .style("text-anchor", "middle")
    .text("The Crime Rate in % of population");

  // makes the bars
  canvas.selectAll("circle")
    .data(data)
    .enter() // makes it iterate over the date as --> d
    .append("circle")
    .attr("y", function(d) {
      return d.y.scale(yScale);
    })
    .attr("x", function(d) {
      return d.x.scale(xScale);
    })
    .attr("r", 5)
    .attr("transform", function (d,i) {
      var translate = [(barWidth/2 + barWidth * i + margin.left + barPadding/2), 0];
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


  // var scaling = d3.scale.linear()
  //   .domain(graphData)
  //   .range([0,w]);

  // canvas = d3.select(".chatterContainer")
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
