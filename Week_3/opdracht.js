var data = 1;

titleGraph = "Gemiddelde etmaalsom temperatuur in 2017"
yValues = "etmaal som in graden celsius"
xValues = "months"
graphXRange = [35, 680]
graphYRange = [40, 350]
valueDisplayVactor = 0.1

function main(){
  var fileName = "data.json";
  var txtFile = new XMLHttpRequest();
  txtFile.onreadystatechange = function() {
      if (txtFile.readyState === 4 && txtFile.status == 200) {
        data = JSON.parse(txtFile.responseText);

        datums = Object.keys(data);

        temps = []
        minmaxTemp = [];
        datums.forEach(function(key){
          temp = parseInt(data[key]["temp"])*valueDisplayVactor;
          temps.push(temp);
          if (minmaxTemp.length === 0) {
            minmaxTemp = [temp, temp]
          } else if (minmaxTemp[0] > temp) {
            minmaxTemp[0] = temp
          } else if (minmaxTemp[1] < temp) {
            minmaxTemp[1] = temp
          };
        });

        function round(number, increment, offset) {
          return Math.ceil((number - offset) / increment ) * increment + offset;
        }
        minmaxTemp[0] = round(minmaxTemp[0],5,0)-5
        minmaxTemp[1] = round(minmaxTemp[1],5,0)

        makeGraph(datums, temps, minmaxTemp);
      };
  };
  txtFile.open("GET", fileName);
  txtFile.send();
};

function opmaak() {
  // gets your canvas from the HTML
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');

  // calculates the right Y cordinate in canvas
  function rightY(oldY){
    return (400 - oldY);
  }

  // title op myCanvas
  ctx.font= "20px Arial";
  ctx.fillText(titleGraph,30,28);

  // starts drawing to draw square where in the graph will show.
  ctx.beginPath();
  ctx.lineWidth = 2;
  // sets begin location of the drawing
  ctx.moveTo(1, rightY(365));
  // draws a line to the given location
  ctx.lineTo(1, rightY(1));
  ctx.moveTo(699, rightY(365)); ctx.lineTo(699, rightY(1));
  ctx.moveTo(1, rightY(1)); ctx.lineTo(699, rightY(1));
  ctx.moveTo(699, rightY(365)); ctx.lineTo(1, rightY(365));
  // visualize drawing
  ctx.stroke();

  // Y-text op myCanvas
  ctx.font= "10px Arial";
  ctx.rotate(-Math.PI/2);
  // ctx.textAlign = "center";
  ctx.fillText(yValues,-350,10);
  ctx.rotate(Math.PI/2);
  // made by & date on myCanvas
  ctx.font= "10px Arial";
  ctx.fillText("Made By Jesse Groot",590,25);

}

function makeGraph(datums, temps, minmaxTemp) {
  // gets your canvas from the HTML
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');

  // calculates the right Y cordinate in canvas for graph
  function rightY(oldY){
    return (400 - oldY - graphYRange[0]);
  }
  function rightX(oldX){
    return (oldX + graphXRange[0]);
  }

  // calculates how many picsels 1 day is (x axis)
  daysDiff = datums.length
  graffDiffX = graphXRange[1] - graphXRange[0]
  increaseX = graffDiffX/daysDiff

  //calculates how many picsels 1 degree is (y axis)
  tempDiff = minmaxTemp[1] - minmaxTemp[0];
  graffDiffY = graphYRange[1] - graphYRange[0];
  increaseY = graffDiffY/tempDiff;

  ctx.beginPath();
  ctx.strokeStyle = 'grey';
  ctx.lineWidth = 1;

  for (var temp = minmaxTemp[0]; temp < (minmaxTemp[1]+5); temp += 5) {
    ctx.font= "10px Arial";
    ctx.fillText(temp,rightX(-15),rightY(increaseY*(temp-minmaxTemp[0])));
    ctx.moveTo(rightX(increaseX*0), rightY(increaseY*(temp-minmaxTemp[0])));
    ctx.lineTo(rightX(increaseX*daysDiff), rightY(increaseY*(temp-minmaxTemp[0])));
  };

  var month = ([["01", "Jan", 31], ["02", "Feb", 28], ["03", "Mar", 31], ["04", "Apr", 30],
  ["05", "May", 31], ["06", "Jun", 30], ["07", "Jul", 31], ["08", "Aug", 31], ["09", "Sep", 30],
  ["10", "Okt", 31], ["11", "Nov", 30], ["12", "Dec", 31]])
  startMonth = 0;

  startDate = datums[0].substring(6,8)

  for (var i = 0; i < month.length ; i++) {
    if (datums[0].substring(4,6) === month[i][0]) {
      startMonth = month[i][1]
      daysLeft = month[i][2] - parseInt(startDate) + 1
    };
  };

  firstDate = datums[0].substring(0,4) + "-" + datums[0].substring(4,6) + "-" + datums[0].substring(6,8)
  lastDate = datums[daysDiff-1].substring(0,4) + "-" + datums[daysDiff-1].substring(4,6) + "-" + datums[daysDiff-1].substring(6,8)

  console.log(lastDate)

  // monthsDiff = (lastDate.getMonth() - firstDate.getMonth() + (12 * (lastDate.getFullYear() - firstDate.getFullYear())));

  // console.log(monthsDiff)


  d = new Date("2018-01-01")
  console.log(d.getTime());

  // for (var

  //https://jessegroot.github.io/dataprocessing/homework/week_3/knmi.html

  ctx.stroke();
}

main();
opmaak();
