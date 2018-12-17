// Name: Jesse Groot
// Student number: 11012579

/**
This program makes graph one (it also calls graph two)
**/

function makeGraph(data, style) {

  // make a scale for the xAxis
  var xScale = d3.scaleLinear()
    .domain([0, style.listLands.length])
    .range([style.margin.left, style.width + style.margin.left]);
  // make a scale for the yAxis
  var y = d3.scaleLinear()
    .domain([0, d3.max(style.listYValues)])
    .range([style.height + style.margin.top, style.margin.top]);

  // make a scale that imp&exp gets an other color than fake exp&imp
  var colorScale = d3.scaleOrdinal()
    .domain(0, style.impExpStacked.length)
    .range(d3.schemeCategory10)

  // make the width that one land takes in barchard
  var bandWidth = style.width/style.listLands.length

  // make the x and y axis
  var xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(function(d) { return style.listLands[d]; })
      // makes sure every land gets an label
      .ticks(style.listLands.length);
  var yAxis = d3.axisLeft()
    .scale(y);

  // make list for data needed to make piechard.
  var pieList = []

  // make the bars
  var rect = style.canvasBarchard.selectAll("g")
    // from this data
    .data(style.impExpStacked)
    .enter().append("g")
      // give collor based which stacked layer
      .attr("fill", (d, i) => colorScale(parseInt(i/2)))
    // select all rect
    .selectAll("rect")
    // for all the vallues in d
    .data(d => d)
    // append a rect
    .enter().append("rect")
      // from these x and y (animation)
      .attr("x", (d, i) => xScale(i))
      .attr("y", style.height + style.margin.top)
      // from this width and hight (animation)
      .attr("width", bandWidth)
      .attr("height", 0)
      // give onclick to make sunburst
      .on("click", function(d, i) {
        // push needed data
        style.impExpStacked.forEach(function(d) {
          pieList.push(d[i])
        })
        // make sunburst
        makeSunburst(pieList, style, style.listLands[i])
        pieList = []
      } );

  // append xAxis
  style.canvasBarchard.append("g")
    .attr("transform", "translate( 0," + (style.height + style.margin.top) + ")")
    .call(xAxis)
      // append the text rotated with 60 degrees on the correct spot
      .selectAll("text")
        .attr("y", -2)
        .attr("x", 7)
        .attr("dy", ".35em")
        .attr("transform", "rotate(60)")
        .style("text-anchor", "start");

  // call yAxis
  var axis = style.canvasBarchard.append("g")
    .attr("transform", "translate( "+ (style.margin.left) +", 0)")
    .call(yAxis);

  // makes stacked bar grouped
  function transitionGrouped() {
    // adjust yAxis
    y.domain([0, d3.max(style.listYValues)]);
    axis.transition()
      .call(yAxis)

    // select all rects
    rect.transition()
        // select the ms it takes and delay
        .duration(500)
        .delay((d, i) => i * 20)
        // select x coords and bandwidth
        .attr("x", (d, i) => xScale(i) + bandWidth / style.impExpStacked.length * d[2])
        .attr("width",bandWidth /style.impExpStacked.length)
      // way of displacements and height
      .transition()
        .attr("y", d => y(d[1] - d[0]))
        .attr("height", d => y(0) - y(d[1] - d[0]));
  }

  // makes grouped bar stacked
  function transitionStacked() {
    // adjust yAxis
    y.domain([0, d3.max(style.listRealYValues)]);
    axis.transition()
      .call(yAxis)

    rect.transition()
        .duration(500)
        .delay((d, i) => i * 20)
        // sellect new y coords and hight
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
      // way of displacemts and width
      .transition()
        .attr("x", (d, i) => xScale(i))
        .attr("width", bandWidth);
  }

  // start the graph stacked
  transitionStacked();

  // make the places you can adjest the barchard to grouped and stacked with onclick
  texten = ["Stacked", "Grouped"];

  d3.select(".chooice").select("ul").selectAll("text")
    .data(texten)
    .enter()
    .append("a")
    .append("text")
    .text(function(d){ return d })
    .on("click", function(d,i) {
      if (i == 0) transitionStacked();
      else transitionGrouped();
    });


}
