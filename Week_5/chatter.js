// python -m http.server 8888

// when html page is loaded start javascript program
window.onload = function() {
  startProgram();
};

function startProgram () {

  // load in dataset
  var womenInScience = "https://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var consConf = "https://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

  // request to data
  var requests = [d3.json(womenInScience), d3.json(consConf)];

  // only continues if all requests are complete
  Promise.all(requests).then(function(response) {
    // get the data in right format
    data = doFunction(response);
    // make the axis and get the information needed to make the graph in the right place
    dataStyle = makeAxis(data[0], data[1], data[2]);
    // make the chatterplot circles
    makeChatter(data[0], dataStyle, data[1], data[2]);
  }).catch(function(e){
    throw(e);
  });
};

function makeChatter(data, dataStyle, yRange, xRange) {

  // list where in each array is going to representate one country
  var totalList = []

  // for each land
  dataStyle.listLands.forEach(function(dataLand, i){
    // make a list
    let list = [];
    var years = Object.keys(data[dataLand]);
    // loop over years
    years.forEach(function(year) {
      // make an array with the x/y coords, year and the land.
      array = ([dataStyle.xScale(data[dataLand][year].WomenPercentage)+dataStyle.margin.left,
      dataStyle.yScale(data[dataLand][year].ConsumerConf)+dataStyle.margin.top, year, dataLand]);
      // append array to the list
      list.push(array);
    });
    // append the list with the values of every year to your totalList
    totalList.push(list)
  })

  // Make all the circles
  handleMouseOut(totalList, dataStyle, 1);

  // make a list with every country
  d3.select("body").select("#graph").select("ul").selectAll("li")
    .data(totalList)
    .enter()
    // create the list and a wherein text will be displayed
    .append("li")
    .append("a")
    .text(function(d, i){ return d[0][3] })
    // give each land a on hover function and a function that will be ran
    .on("mouseover", function(d, i){ handleMouseOver(totalList, dataStyle, i) })
    .on("mouseout", function(d, i){ handleMouseOut(totalList, dataStyle, 0) });
}

function handleMouseOver(totList, dataStyle, i) {
  // remove all existing circles
  dataStyle.canvas.selectAll("circle").remove()

  // make circles by
  dataStyle.canvas.selectAll("circle")
    // using the data points of one land
    .data(totList[i])
    .enter()
    // append circle
    .append("circle")
    .attr("cx", function(d){ return d[0] })
    .attr("cy", function(d){ return d[1] })
    .attr("r", 5)
    .style("fill", function(d){ return dataStyle.colorScale(d[3]) })

  // show years by plotting text after the circle by
  node = dataStyle.canvas.selectAll(".node")
    // plotting over the data
    .data(totList[i])
    .enter()
    // append text with year after the circles
    .append("text")
    .attr("dx", function(d){ return (d[0]+5) })
    .attr("dy", function(d){ return d[1] })
    .style("font-size", "10px")
    .text(function(d){ return d[2] });
}

function handleMouseOut(totList, dataStyle, run) {
  // remove all node/years and circles from canvas
  if (run === 0){
    node.remove()
  }
  dataStyle.canvas.selectAll("circle").remove()

  // select canvas
  canvas = dataStyle.canvas.selectAll("circle")
  // loop over all the lands
  totList.forEach(function(d, q){
    canvas
      // loop over all the data points for each land
      .data(d)
      .enter()
      // append the circle for the data
      .append("circle")
      // select correct x and y values for in the graph
      .attr("cx", function(d){ return d[0] })
      .attr("cy", function(d){ return d[1] })
      .attr("r", 5)
      // select the right color for the country
      .style("fill", function(d){ return dataStyle.colorScale(d[3]) })
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

  // make a list with the lands
  var lands = Object.keys(data)
  var listLands = []
  lands.forEach(function(d){ return listLands.push(d) })

  // make a scale that every land gets his own color
  colorScale = d3.scaleOrdinal()
    .domain(listLands)
    .range(d3.schemeCategory10)

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

  // make a bar for labeling in the color for every country
  canvas.selectAll("bar")
    .data(listLands)
    .enter()
    .append("rect")
    .attr("x", (canvasWidth - margin.right))
    .attr("y", function(d, i){ return (margin.top + 30*i)})
    .attr("height", 8)
    .attr("width", 8)
    .style("fill", function(d){ return colorScale(d) });

  // make the text behind the bar for every country
  canvas.selectAll("labels")
    .data(listLands)
    .enter()
    .append("text")
    .attr("dx", (canvasWidth - margin.right + 10))
    .attr("dy", function(d, i){ return (margin.top + 30*i + 8)})
    .style("font-size", "10px")
    .text(function(d){ return d });

  // makes sure g (the y axis) starts at the right place
  canvas.append("g")
    .attr("transform", "translate("+ margin.left +"," + margin.top +")")
    .call(y_axis);

  // makes sure g (the x axis) starts at the right place
  canvas.append("g")
    .attr("transform", "translate( " + margin.left + "," + (height+margin.top) +")")
    .call(x_axis);

  // text label for the x axis
  canvas.append("text")
    .attr("transform","translate(" + (width/2) + " ," + (canvasHeight - margin.bottom + 40) + ")")
    .style("text-anchor", "middle")
    .text("The Woman Percentage in working industries");

  // add title of the graph
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

  // saves all the data that is going to be used
  graphStyle = ({width: width, height: height, margin: margin,xScale: xScale,
    yScale: yScale,canvas: canvas,colorScale: colorScale,listLands: listLands});

  return graphStyle;
}

function doFunction (requests) {
  // get the 2 differend datasets
  dataset1 = transformResponse(requests[0], 0);
  dataset2 = transformResponse(requests[1], 1);

  // get make the setup to store the data
  var dataDict = {};
  var yRange = [];
  var xRange = [];

  var land;
  // loop over the x data points
  dataset1.forEach(function(data, i) {
    // if land doesnt exist make new key and append datapoint
    if (land !== data["Country"]) {
      dataDict[data["Country"]] = {};
      dataDict[data["Country"]][data["time"]] = {};
      dataDict[data["Country"]][data["time"]]["WomenPercentage"] = data["datapoint"];
    // if land exists append to key and append datapoint
    } else {
      dataDict[data["Country"]][data["time"]] = {};
      dataDict[data["Country"]][data["time"]]["WomenPercentage"] = data["datapoint"];
    }
    // make land land so program knows it is already a key
    land = data["Country"];
    xRange.push(data["datapoint"]);
  });
  // loop over the x data points
  dataset2.forEach(function(data, i) {
    // append data if point exists
    if (dataDict[data["Country"]][data["time"]] != undefined) {
      dataDict[data["Country"]][data["time"]]["ConsumerConf"] = data["datapoint"]
    }
    yRange.push(data["datapoint"]);
  });

  // return the data that is going to be used
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

        // store name as country
        if (type === 0) {
          var country = data.structure.dimensions.series[1].values[index]["name"];
        }

        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){


                // set up temporary object
                let tempObj = {};

                // add country to dict
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
