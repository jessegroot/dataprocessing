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

        var style = graph_data(data)
        makeGraph(data, style)
      };
  };
  txtFile.open("GET", fileName);
  txtFile.send();
};


function graph_data(data) {

  lands = Object.keys(data)
  listLands = []
  listYValues = []
  listTotalYValues = []
  listValuesLands = []

  list1 = []
  list2 = []
  list3 = []
  list4 = []

  lands.forEach(function(land) {
    listYValues.push(parseInt(data[land]["EXP"]/1000))
    listYValues.push(parseInt(data[land]["IMP"]/1000))
    listTotalYValues.push(parseInt(data[land]["EXP"]/1000)+parseInt(data[land]["IMP"]/1000))
    listLands.push(land)
    list1.push(parseInt(data[land]["realIMP"]/1000))
    list2.push(parseInt(data[land]["IMP"]/1000) - parseInt(data[land]["realIMP"]/1000))
    list3.push(parseInt(data[land]["realEXP"]/1000))
    list4.push(parseInt(data[land]["EXP"]/1000) - parseInt(data[land]["realEXP"]/1000))
  })
  listValuesLands.push(list1, list2, list3, list4)

  importValues = d3.stack()
    .keys(d3.range(2))
    (d3.transpose(listValuesLands)) // stacked yz
    .map((data, i) => data.map(([y0, y1]) => [y0, y1, i]))

  exportValues = d3.stack()
    .keys(d3.range(2,4))
    (d3.transpose(listValuesLands)) // stacked yz
    .map((data, i) => data.map(([y0, y1]) => [y0, y1, i]))

  listValuesLands = []
  listValuesLands.push(list1, list3, list2, list4)

  impExpStacked = d3.stack()
    .keys(d3.range(4))
    (d3.transpose(listValuesLands)) // stacked yz
    .map((data, i) => data.map(([y0, y1]) => [y0, y1, i]))

  // neurtal data of the chatterplot
  var canvasBarchardWidth = 900,
      canvasBarchardHeight = 500,
      margin = { top: 30, right: 80, bottom: 50, left: 60 };

  // neurtal data of the chatterplot
  var canvasSunWidth = 400,
      marginSun = { top: 30, right: 30, bottom: 50, left: 50 };

  // make width and height for graph (exluding space for labels)
  var width = canvasBarchardWidth - margin.left - margin.right;
  var height = canvasBarchardHeight - margin.bottom - margin.top;

  // make canvasBarchard in correct place for chatterplot
  canvasBarchard = d3.select(".barContainer")
    .append("svg")
    .attr("width", canvasBarchardWidth)
    .attr("height", canvasBarchardHeight);

  canvasSun = d3.select("#graphs").select(".pieContainter")
    .append("svg")
    .attr("width", canvasSunWidth)
    .attr("height", canvasSunWidth);

  // saves all the data that is going to be used
  graphStyle = ({width: width, height: height, impExpStacked: impExpStacked,
    margin: margin, canvasSun: canvasSun, marginSun: marginSun, listYValues: listYValues,
    listRealYValues: listTotalYValues, importValues: importValues,
    expertValues: exportValues, listLands: listLands,
    barData: listValuesLands, canvasBarchard: canvasBarchard});

  getLayout(graphStyle);

  return graphStyle
}

function getLayout(style) {

  // Title BarChard
  style.canvasBarchard.append("text")
    .attr("transform","translate( " + (style.width/2+style.margin.left) + "," + (style.margin.top - 10) + ")")
    .style("text-anchor", "middle")
    .text("Import/Export Countries and their pass on resorces");

  style.canvasBarchard.append("text")
  .attr("transform","translate( " + (style.margin.left) + "," + (style.height/2) + ")")
  .text("trade of county per thousand goods")
  .attr("y", 13)
  .attr("x", (-style.height/2))
  .attr("dy", ".35em")
  .attr("transform", "rotate(270)")
  .style("text-anchor", "middle");
}

function getDataSun(pieData, style) {
 var data = {name: "Sunburst", children: []}

 var realImp, realExp, imp, exp;

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
 data["children"].push({name: "Import", children: [{name: "RealImport", size: realImp}, {name: "ForExport", size: (imp-realImp)}]})
 data["children"].push({name: "Export", children: [{name: "RealExport", size: realExp}, {name: "Imported", size: (exp-realExp)}]})

 return data
}
