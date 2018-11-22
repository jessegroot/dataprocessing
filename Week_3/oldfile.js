// scripts.js
//
// DataProccesing
// Jesse Groot 11012579
//
// Javascript for html

// makes the variables needed in every function
datesArray = [];
tempArray = [];
minmaxTemp = [];
var response;

function main(){
  // loads the text file
  filename = "WeerDeBilt.txt"
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if(this.readyState === 4 && this.status === 200) {
      response = this.responseText;
      // console.log("failure");
    }
  }
  request.open("GET", filename, false);
  request.send();
}

function obtainData(){
  // creates arrays for every line in text file
  values = response.split("\n");
  for (element = 0; element < values.length - 1; element++){
    // makes 2 arrays 1 with date and one with temp
    split = values[element].split(",");
    datesArray.push(split[0]);
    tempArray.push(split[1]);
  };

  // function to add characters in a string by Base33
  String.prototype.splice = function(idx, rem, str) {
      return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
  };

  for (day = 0; day < 364; day++){
    // converges dates from 20163515 to 2016-03-15
    datesArray[day] = datesArray[day].splice(4, 0, "-");
    datesArray[day] = datesArray[day].splice(7, 0, "-");
    // turns days in milliseconds
    datesArray[day] = new Date(datesArray[day]);
    if (day == 0){
      firstDay = ((datesArray[0])/1);
    };
    // turns milliseconds to days 1 to 365
    datesArray[day] = ((((datesArray[day])/1) - firstDay) / 86400000 + 1);
  }
  minTemp = 0;
  maxTemp = 0;
  // calculates the minimum and maximum temp
  for (rounds = 0; rounds < tempArray.length; rounds++){
    if (Number(tempArray[rounds]) < (Number(minTemp))){
      minTemp = tempArray[rounds];
    } else if (Number(tempArray[rounds]) > (Number(maxTemp))){
      maxTemp = tempArray[rounds];
    }
  }
  // pushes it so it can be used in every function
  minmaxTemp.push(minTemp, maxTemp)
}

function letsStartBasics(){
  // gets your canvas from the HTML
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');

  // calculates the right Y cordinate in canvas
  function rightY(oldY){
    return (400 - oldY);
  }

  // calculates how many picsels 1 degree is (y axis)
  domainGraffY = [30, 370]
  tempDiff = minmaxTemp[1] - minmaxTemp[0];
  graffDiffY = domainGraffY[1] - domainGraffY[0];
  increaseY = graffDiffY/tempDiff;

  // calculates how many picsels 1 day is (x axis)
  domainGraffX = [30, 580]
  daysDiff = datesArray[363] - datesArray[0]
  graffDiffX = domainGraffX[1] - domainGraffX[0]
  increaseX = graffDiffX/daysDiff

  // function gives the location of the temp in y coords
  function giveYCoord(temp){
    yCoord = (temp - minmaxTemp[0]) * increaseY
    return Math.round(rightY(yCoord + 30));
  }
  // function gives the location of the days in x coords
  function giveXCoord(days){
    xCoord = days * increaseX
    return (Math.round(xCoord)+30);
  }

  // sets the collor of the lines
  ctx.fillStyle = 'rgb(0, 0, 0)';

  // starts drawing
  ctx.beginPath();
  // sets begin location of the drawing
  ctx.moveTo(30, rightY(370));
  // draws a line to the given location
  ctx.lineTo(30, rightY(30));
  ctx.moveTo(30, rightY(100));
  ctx.lineTo(600, rightY(100));
  // hardcodes months
  month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"," Okt", "Nov", "Dec"]
  for (months = 0; months < 12; months++){
    // sets locations on the x axis
    ctx.moveTo(30 + (months*((580-30)/11)), rightY(100)); // starts at
    ctx.lineTo(30 + (months*((580-30)/11)), rightY(95));

    // sets text at the locations on the x axis
    ctx.font = '12px serif';
    ctx.fillText(month[months], 30 + (months*((580-30)/11)), rightY(80));
  }

  for (rounds = 0; rounds < 6; rounds++){
    // sets locations on the y axis
    ctx.moveTo(30, rightY(100 + ((370-100)/5)*rounds));
    ctx.lineTo(25, rightY(100 + ((370-100)/5)*rounds));

    // sets text at the locations on the y axis
    ctx.font = '12px serif';
    ctx.fillText((Math.round(minmaxTemp[1]/5 * rounds)/10), 5, rightY(100 + ((370-100)/5)*rounds));
  }

  for (rounds = 0; rounds < 2; rounds++){
    // sets locations on the y axis
    ctx.moveTo(30, rightY(100 + ((30-100)/2)*(rounds+1)));
    ctx.lineTo(25, rightY(100 + ((30-100)/2)*(rounds+1)));

    // sets text at the locations on the y axis
    ctx.font = '12px serif';
    ctx.fillText((Math.round(minmaxTemp[0]/2 * (rounds + 1))/10), 5, rightY(100 + ((30-100)/2)*(rounds+1)));
  }

  for (rounds = 0; rounds < datesArray.length; rounds++){
    if (rounds == 0){
      // starts drawing at begin temp in graff
      ctx.moveTo(giveXCoord(datesArray[rounds]), giveYCoord(tempArray[rounds]));
    } else{
      // makes line to next temp in graff
      ctx.lineTo(giveXCoord(datesArray[rounds]), giveYCoord(tempArray[rounds]));
    }
  }

  // sets title
  ctx.font = '20px serif';
  ctx.fillText("Weer in de Bilt jan-dec 2016", 40, rightY(380));
  ctx.stroke();
}

main();
obtainData();
letsStartBasics();
