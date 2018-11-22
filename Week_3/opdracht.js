// Name: Jesse Groot
// Student number: 11012579

/**
This program draws a graph of the etmaalsontemperatuur in berkhout.
**/

// variables that may change per graph
var titleGraph = "Gemiddelde etmaalsom temperatuur in Berkhout";
var yValues = "etmaal som in graden celsius";
var xValues = "months";
var valueDisplayVactor = 0.1;

// range of the grap in canvas
var graphXRange = [35, 680];
var graphYRange = [40, 350];

function main() {
  // get json file name and call XMLHttpRequest
  var fileName = "data.json";
  var txtFile = new XMLHttpRequest();
  txtFile.onreadystatechange = function() {
      // When file loaded
      if (txtFile.readyState === 4 && txtFile.status == 200) {
        // get json in variable
        data = JSON.parse(txtFile.responseText);

        // get string with dates
        datums = Object.keys(data);

        // make string for temps and minMaxTemp
        temps = [];
        minMaxTemp = [];

        // for each key
        datums.forEach(function(key) {
          // get real temp and push it in list
          temp = parseInt(data[key]["temp"])*valueDisplayVactor;
          temps.push(temp);
          // store temp if its the new min or max temp
          if (minMaxTemp.length === 0) {
            minMaxTemp = [temp, temp];
          } else if (minMaxTemp[0] > temp) {
            minMaxTemp[0] = temp;
          } else if (minMaxTemp[1] < temp) {
            minMaxTemp[1] = temp;
          };
        });

        // get min/max values for graph min/max
        function round(number, increment, offset) {
          return Math.ceil((number - offset) / increment ) * increment + offset;
        };
        minMaxTemp[0] = round(minMaxTemp[0],5,0)-5;
        minMaxTemp[1] = round(minMaxTemp[1],5,0);

        makeGraph(datums, temps, minMaxTemp);
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
  function rightY(oldY) {
    return (400 - oldY);
  };

  // title op myCanvas
  ctx.font= "20px Arial";
  ctx.fillText(titleGraph,5,28);

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
  ctx.font= "12px Arial";
  ctx.rotate(-Math.PI/2);
  // ctx.textAlign = "center";
  ctx.fillText(yValues,-300,15);
  ctx.rotate(Math.PI/2);
  // made by & date on myCanvas
  ctx.font= "10px Arial";
  ctx.fillText("Made By Jesse Groot 22/11/2018",550,25);
};

function makeGraph(datums, temps, minMaxTemp) {
  // gets your canvas from the HTML
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');

  // calculates the right Y and X cordinate in canvas for graph
  function rightY(oldY) {
    return (400 - oldY - graphYRange[0]);
  };
  function rightX(oldX) {
    return (oldX + graphXRange[0]);
  };

  // calculates how many picsels 1 day is (x axis)
  daysDiff = datums.length;
  graffDiffX = graphXRange[1] - graphXRange[0];
  increaseX = graffDiffX/daysDiff;

  //calculates how many picsels 1 degree is (y axis)
  tempDiff = minMaxTemp[1] - minMaxTemp[0];
  graffDiffY = graphYRange[1] - graphYRange[0];
  increaseY = graffDiffY/tempDiff;

  // begin lines and style
  ctx.beginPath();
  ctx.strokeStyle = 'grey';
  ctx.lineWidth = 1;

  // get the x-axis and their values
  for (var temp = minMaxTemp[0]; temp < (minMaxTemp[1]+5); temp += 5) {
    ctx.font= "10px Arial";
    ctx.fillText(temp,rightX(-15),rightY(increaseY*(temp-minMaxTemp[0])));
    ctx.moveTo(rightX(increaseX*0), rightY(increaseY*(temp-minMaxTemp[0])));
    ctx.lineTo(rightX(increaseX*daysDiff), rightY(increaseY*(temp-minMaxTemp[0])));
  };

  // the months with their name, amount of days
  var month = ([["01", "Jan", 31], ["02", "Feb", 28], ["03", "Mar", 31], ["04", "Apr", 30],
  ["05", "May", 31], ["06", "Jun", 30], ["07", "Jul", 31], ["08", "Aug", 31], ["09", "Sep", 30],
  ["10", "Okt", 31], ["11", "Nov", 30], ["12", "Dec", 31]]);

  // give start month, last month, start date, start year for drawings.
  startMonthInt = (parseInt(datums[0].substring(4,6)) - 1);
  lastMonthInt = parseInt(datums[daysDiff-1].substring(4,6));
  startDate = parseInt(datums[0].substring(6,8));
  startYear = parseInt(datums[0].substring(0,4));

  // get days left of first and days past of last month
  daysLeft = (month[startMonthInt][2] - startDate + 1);
  daysPast = parseInt(datums[daysDiff-1].substring(6,8));

  // get the amount of months
  firstDate = new Date(datums[0].substring(0,4) + "-" + datums[0].substring(4,6) + "-" + datums[0].substring(6,8));
  lastDate = new Date(datums[daysDiff-1].substring(0,4) + "-" + datums[daysDiff-1].substring(4,6) + "-" + datums[daysDiff-1].substring(6,8));
  monthsDiff = (lastDate.getMonth() - firstDate.getMonth() + (12 * (lastDate.getFullYear() - firstDate.getFullYear())));

  // get currentX for x-axis labeling
  currentX = daysLeft;
  // loop over the months + 1
  for (var i = 0; i <= (monthsDiff + 1) ; i++) {
    // if month doesnt exist it needs to reset it also marks end of a year
    if (startMonthInt === 12){
      startMonthInt = 0;
      ctx.moveTo(rightX(increaseX*currentX), rightY(-18));
      ctx.lineTo(rightX(increaseX*currentX), rightY(-30));
      ctx.fillText(startYear,rightX(increaseX*(currentX*(1/2))-15),rightY(-26));
    };
    // first labeling always starts at 0
    if (i === 0) {
      ctx.moveTo(rightX(increaseX*0), rightY(-3));
      ctx.lineTo(rightX(increaseX*0), rightY(-15));
      ctx.moveTo(rightX(increaseX*0), rightY(-18));
      ctx.lineTo(rightX(increaseX*0), rightY(-30));
    // else get correct first distance for labeling (depended on days of month left)
    } else if (i === 1) {
      ctx.moveTo(rightX(increaseX*currentX), rightY(-3));
      ctx.lineTo(rightX(increaseX*currentX), rightY(-15));
      // if less than 10 days no labeling of the month (because of space)
      if (currentX > 10) {
        ctx.fillText(month[startMonthInt][1],rightX(increaseX*(currentX*(1/2)-5)),rightY(-11));
      };
      // go to next month
      startMonthInt += 1;
    // last month and year labeling
    } else if (i > monthsDiff) {
      if (daysPast > 3) {
        currentX = currentX + daysPast;
        ctx.moveTo(rightX(increaseX*currentX), rightY(-3));
        ctx.lineTo(rightX(increaseX*currentX), rightY(-15));
        ctx.moveTo(rightX(increaseX*currentX), rightY(-18));
        ctx.lineTo(rightX(increaseX*currentX), rightY(-30));
        // if more than 10 days past give a label
        if (daysPast > 10) {
          ctx.fillText(month[startMonthInt][1],rightX(increaseX*(currentX-(daysPast*(1/2)-8))),rightY(-11));
        };
        if (startMonthInt >= 1) {
          ctx.fillText(startYear,rightX(increaseX*(currentX-((startMonthInt*30)*(1/2)-15))),rightY(-26));
        };
      };
    // if normal full month than normal labeling
    } else {
      currentX = currentX + month[startMonthInt][2];
      ctx.moveTo(rightX(increaseX*currentX), rightY(-3));
      ctx.lineTo(rightX(increaseX*currentX), rightY(-15));
      ctx.fillText(month[startMonthInt][1],rightX(increaseX*(currentX-month[startMonthInt][2]*(1/2)-5)),rightY(-11));
      startMonthInt += 1;
    };
  };

  // plot the graph information
  for (rounds = 0; rounds < datums.length; rounds++) {
    if (rounds == 0) {
      // starts drawing at begin temp in graff
      ctx.moveTo(rightX(increaseX*rounds), rightY(increaseY*(temps[rounds]+5)));
    } else {
      // makes line to next temp in graff
      ctx.lineTo(rightX(increaseX*rounds), rightY(increaseY*(temps[rounds]+5)));
      ctx.moveTo(rightX(increaseX*rounds), rightY(increaseY*(temps[rounds]+5)));
    };
  };

  // draw all lins
  ctx.stroke();
}

// call functions
main();
opmaak();
