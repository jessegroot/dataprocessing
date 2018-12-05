// python -m http.server 8888
var data;
var dataStyle;

window.onload = function() {
  startProgram("Netherlands");
};

function start(country){
  console.log(country)
}

function startProgram (country) {

  // load in dataset
  var womenInScience = "https://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var consConf = "https://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

  var requests = [d3.json(womenInScience), d3.json(consConf)];

  // txtFile.send();

  // only continues if all requests are complete
  Promise.all(requests).then(function(response) {
    data = doFunction(response);
    dataStyle = makeAxis(data[0], data[1], data[2]);
    console.log(data[0])
    makeChatter(data[0], country, dataStyle, data[1], data[2])
  }).catch(function(e){
    throw(e);
  });


};

function makeChatter(data, land, dataStyle, yRange, xRange) {

  var xScale = d3.scaleLinear()
    .domain([d3.min(xRange)-dataStyle.radius, d3.max(xRange)+dataStyle.radius])
    .range([0, dataStyle.width]);
  var yScale = d3.scaleLinear()
    .domain([d3.max(yRange)+dataStyle.radius, d3.min(yRange)-dataStyle.radius])
    .range([0, dataStyle.height]);

  var totalLands = []
  var totalList = []
  // make take the lands as string and loop over them
  var lands = Object.keys(data);

  lands.forEach(function(dataLand, i){
    let list = [];
    var years = Object.keys(data[dataLand]);
    years.forEach(function(year) {
      if (i === 0){
        colorLand = "#e57b22"
      } else if (i === 1) {
        colorLand = "#000fe3"
      } else if (i === 2) {
        colorLand = "#fff85b"
      } else if (i === 3) {
        colorLand = "#000000"
      } else if (i === 4) {
        colorLand = "#183133"
      } else {
        colorLand = "#34a95f"
      }
      array = [xScale(data[dataLand][year].WomenPercentage)+dataStyle.margin.left, yScale(data[dataLand][year].ConsumerConf)+dataStyle.margin.top, year, colorLand, dataLand];
      list.push(array);
    });
    totalList.push(list)
    totalLands.push(dataLand)
  })
  //
  // var years = Object.keys(data[land]);
  // years.forEach(function(year) {
  //   array = [xScale(data[land][year].WomenPercentage)+dataStyle.margin.left,yScale(data[land][year].ConsumerConf)+dataStyle.margin.top,year];
  //   list.push(array);
  // });

  // color = d3.scaleLinear()
  //   .domain([d3.min(years),d3.max(years)])
  //   .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);
  //
  // console.log(color(2012))
  canvas = dataStyle.canvas.selectAll("circle")
  totalList.forEach(function(d, q){
    canvas
      .data(d)
      .enter()
      .append("circle")
      .attr("cx", function(d){ return d[0] })
      .attr("cy", function(d){ return d[1] })
      .attr("r", 5)
      .style("fill", function(d){ return d[3] })
  })

  d3.select("body").select("#graph").select("ul").selectAll("li")
    .data(totalList)
    .enter()
    .append("li")
    .append("a")
    .text(function(d, i){ return d[0][4] })
    .on("mouseover", function(d, i){
      handleMouseOver(totalList, dataStyle, i)})
    .on("mouseout", function(d, i){
      handleMouseOut(totalList, dataStyle, i)});
}

function handleMouseOver(totList, dataStyle, i) {
  dataStyle.canvas.selectAll("circle").remove()

  dataStyle.canvas.selectAll("circle")
    .data(totList[i])
    .enter()
    .append("circle")
    .attr("cx", function(d){ return d[0] })
    .attr("cy", function(d){ return d[1] })
    .attr("r", 5)
    .style("fill", function(d){ return d[3] })

  node = dataStyle.canvas.selectAll(".node")
    .data(totList[i])
    .enter()
    .append("text")
    .attr("dx", function(d){ return (d[0]+5) })
    .attr("dy", function(d){ return d[1] })
    .style("font-size", "10px")
    .text(function(d){ return d[2] });
}

function handleMouseOut(totList, dataStyle, i) {
  node.remove()
  dataStyle.canvas.selectAll("circle").remove()

  canvas = dataStyle.canvas.selectAll("circle")
  totList.forEach(function(d, q){
    canvas
      .data(d)
      .enter()
      .append("circle")
      .attr("cx", function(d){ return d[0] })
      .attr("cy", function(d){ return d[1] })
      .attr("r", 5)
      .style("fill", function(d){ return d[3] })
  })
}

function makeAxis (data, yRange, xRange) {

  // neurtal data of the chatterplot
  var canvasWidth = 700,
      canvasHeight = 400,
      margin = { top: 50, right: 100, bottom: 50, left: 50 }
      r = 1;

    // make width and height for graph (exluding space for labels)
    var width = canvasWidth - margin.left - margin.right;
    var height = canvasHeight - margin.bottom - margin.top;

  // make the correct scaling for the x and y labels
  var xScale = d3.scaleLinear()
    .domain([d3.min(xRange)-r, d3.max(xRange)+r])
    .range([0, width]);
  var yScale = d3.scaleLinear()
    .domain([d3.max(yRange)+r, d3.min(yRange)-r])
    .range([0, height]);

  colorScale = d3.scaleOrdinal()
    .domain(function())
    .range(d3.schemeCategory10)

  console.log(colorScale("Netherlands"));

  // make the x and y axis somehow also does labeling....
  var x_axis = d3.axisBottom()
    .scale(xScale);
  var y_axis = d3.axisLeft()
    .scale(yScale);

  // make canvas in correct place for chatterplot
  canvas = d3.select(".chatterContainer")
    .append("svg")
    .attr("width", canvasWidth)
    .attr("height", canvasHeight);

  // makes sure g (the y axis) starts at the right place
  canvas.append("g")
    .attr("transform", "translate("+ margin.left +"," + margin.top +")")
    .call(y_axis);

  //// makes sure g (the x axis) starts at the right place
  canvas.append("g")
    .attr("transform", "translate( " + margin.left + "," + (height+margin.top) +")")
    .call(x_axis);

  // text label for the x axis
  canvas.append("text")
    .attr("transform","translate(" + (width/2) + " ," + (canvasHeight - margin.bottom + 40) + ")")
    .style("text-anchor", "middle")
    .text("The Woman Percentage in working industries");

  canvas.append("text")
    .attr("transform","translate(" + (margin.left - 30) +" ," + (margin.top - 10) + ")")
    .style("font-weight", "bold")
    .style("font-size", "15px")
    .text("The Woman Percentage in working industries versus The Consumer Confidence");

  // text label for the y axis
  canvas.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 + margin.left - 35)
    .attr("x", -((height + margin.top)/2))
    .style("text-anchor", "middle")
    .text("The Consumer Confidence");

  graphStyle = {width: width, height: height, margin: margin, radius: 2, xScale, yScale, canvas};

  return graphStyle;
}
//   // makes the bars
//   canvas.selectAll("circle")
//     .data(data)
//     .enter() // makes it iterate over the date as --> d
//     .append("circle")
//     .attr("y", function(d) {
//       return d.y.scale(yScale);
//     })
//     .attr("x", function(d) {
//       return d.x.scale(xScale);
//     })
//     .attr("r", 5)
//     .attr("transform", function (d,i) {
//       var translate = [(barWidth/2 + barWidth * i + margin.left + barPadding/2), 0];
//       return ("translate("+ translate +")")
//     })
// }
function doFunction (requests) {
  dataset1 = transformResponse(requests[0], 0);
  dataset2 = transformResponse(requests[1], 1);

  var dataDict = {};
  var yRange = [];
  var xRange = [];

  var land;
  dataset1.forEach(function(data, i) {
    if (land !== data["Country"]) {
      dataDict[data["Country"]] = {};
      dataDict[data["Country"]][data["time"]] = {};
      dataDict[data["Country"]][data["time"]]["WomenPercentage"] = data["datapoint"];
    } else {
      dataDict[data["Country"]][data["time"]] = {};
      dataDict[data["Country"]][data["time"]]["WomenPercentage"] = data["datapoint"];
    }
    land = data["Country"];
    xRange.push(data["datapoint"]);
  });
  dataset2.forEach(function(data, i) {
    if (dataDict[data["Country"]][data["time"]] != undefined) {
      dataDict[data["Country"]][data["time"]]["ConsumerConf"] = data["datapoint"]
    }
    yRange.push(data["datapoint"]);
  });

  return [dataDict, yRange, xRange];
};

function transformResponse(data, type){

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach(function(string, index){

        if (type === 0) {
          var country = data.structure.dimensions.series[1].values[index]["name"];
        }

        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){


                // set up temporary object
                let tempObj = {};

                if (type === 0) {
                  tempObj["Country"] = country;
                };

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            }
        });
    });

    // return the finished product!
    return dataArray;
}

// x_axis.domain(data.map(function(function(d) {return d.name; })));
// countries = data.map(function(function(d) {return d.name; }));
// x.domain(countries)
// x_axis.domain(d3.max([data, function(d) {return d.value; })]);
