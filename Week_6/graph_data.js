// Name: Jesse Groot
// Student number: 11012579

/**
This file loads the data for all graphs in different functions and calls graph 1
**/

window.onload = function() {
  main();
};

function main() {
  // get json file name and call XMLHttpRequest
  var fileName = "data.json";
  var txtFile = new XMLHttpRequest();
  txtFile.onreadystatechange = function() {
      // When file loaded
      if (txtFile.readyState === 4 && txtFile.status == 200) {
        // get json in variable
        var data = JSON.parse(txtFile.responseText);

        // get variables for graphs
        var style = graph_data(data)
        makeGraph(data, style)
      };
  };
  txtFile.open("GET", fileName);
  txtFile.send();
};


function graph_data(data) {

  // make list that will be used
  var lands = Object.keys(data)
  // list for labeling xAxis
  var listLands = []
  // list for grouped yAxis
  var listYValues = []
  // list for stacked yAxis
  var listTotalYValues = []
  // list for bars
  var listValuesLands = [[],[],[],[]]

  // push values in correct list for d3
  lands.forEach(function(land) {
    listYValues.push(parseInt(data[land]["EXP"]/1000))
    listYValues.push(parseInt(data[land]["IMP"]/1000))
    listTotalYValues.push(parseInt(data[land]["EXP"]/1000)+parseInt(data[land]["IMP"]/1000))
    listLands.push(land)
    listValuesLands[0].push(parseInt(data[land]["realIMP"]/1000))
    listValuesLands[2].push(parseInt(data[land]["IMP"]/1000) - parseInt(data[land]["realIMP"]/1000))
    listValuesLands[1].push(parseInt(data[land]["realEXP"]/1000))
    listValuesLands[3].push(parseInt(data[land]["EXP"]/1000) - parseInt(data[land]["realEXP"]/1000))
  })

  // stacked list for bars
  var impExpStacked = d3.stack()
    .keys(d3.range(4))
    (d3.transpose(listValuesLands)) // stacked yz
    .map((data, i) => data.map(([y0, y1]) => [y0, y1, i]))

  // size of bargraph and margins
  var canvasBarchardWidth = 900,
      canvasBarchardHeight = 500,
      margin = { top: 30, right: 80, bottom: 50, left: 60 };

  // size of sunburst and margins
  var canvasSunWidth = 400,
      marginSun = { top: 30, right: 30, bottom: 50, left: 50 };

  // make width and height for graph (exluding space for labels)
  var width = canvasBarchardWidth - margin.left - margin.right;
  var height = canvasBarchardHeight - margin.bottom - margin.top;

  // make canvasBarchard in correct place for barchard
  canvasBarchard = d3.select(".barContainer")
    .append("svg")
    .attr("width", canvasBarchardWidth)
    .attr("height", canvasBarchardHeight);

  // make canvasSun for the sunburst
  canvasSun = d3.select("#graphs").select(".pieContainter")
    .append("svg")
    .attr("width", canvasSunWidth)
    .attr("height", canvasSunWidth);

  // saves all the data that is going to be used
  var graphStyle = ({width: width, height: height, impExpStacked: impExpStacked,
    margin: margin, canvasSun: canvasSun, marginSun: marginSun, listYValues: listYValues,
    listRealYValues: listTotalYValues, listLands: listLands, canvasBarchard: canvasBarchard});

  // make labels for barchard
  getLayout(graphStyle);

  // return info needed for graphs
  return graphStyle
}

function getLayout(style) {

  // Title BarChard
  style.canvasBarchard.append("text")
    .attr("transform","translate( " + (style.width/2+style.margin.left) + "," + (style.margin.top - 10) + ")")
    .style("text-anchor", "middle")
    .text("Import/Export Countries and their pass on resorces");

  // y label
  style.canvasBarchard.append("text")
  .attr("transform","translate( " + (style.margin.left) + "," + (style.height/2) + ")")
  .text("trade in goods of counties per thousand")
  .attr("y", 13)
  .attr("x", (-style.height/2))
  .attr("dy", ".35em")
  .attr("transform", "rotate(270)")
  .style("text-anchor", "middle");
}

function getDataSun(pieData, style) {
  // get right data format for sunburst
  var data = {name: "Sunburst", children: []}

  // make the variables
  var realImp, realExp, imp, exp;

  // pair the right values to the right variable
  pieData.forEach(function(d,i) {
   if (i === 0) {
     realImp = d[1]
   } else if (i === 1) {
     realExp = d[1] - realImp
   } else if (i === 2) {
     imp = d[1] - realExp
   } else {
     exp = d[1] - imp
   }
  })

  // set data in format
  data["children"].push({name: "Import", children: [{name: "RealImport", size: realImp}, {name: "ForExport", size: (imp-realImp)}]})
  data["children"].push({name: "Export", children: [{name: "RealExport", size: realExp}, {name: "Imported", size: (exp-realExp)}]})

  return data
}
