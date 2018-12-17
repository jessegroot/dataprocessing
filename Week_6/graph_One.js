// Name: Jesse Groot
// Student number: 11012579

/**
This program makes graph one (it also calls graph two)
**/

function makeGraph(data, style) {

  console.log(style.impExpStacked)
  n = style.impExpStacked.length

  var xScale = d3.scaleLinear()
    .domain([0, style.listLands.length]) // werkt niet moet met style.listLands
    .range([style.margin.left, style.width + style.margin.left]);
  var y = d3.scaleLinear()
    .domain([0, d3.max(style.listYValues)])
    .range([style.height + style.margin.top, style.margin.top]);

  // make a scale that every land gets his own color
  var colorScale = d3.scaleOrdinal()
    .domain(0, impExpStacked.length)
    .range(d3.schemeCategory10)

  var bandWidth = style.width/style.listLands.length

  // make the x and y axis somehow also does labeling....
  var xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(function(d) { return style.listLands[d]; })
      .ticks(style.listLands.length-1);
  var yAxis = d3.axisLeft()
    .scale(y);

  var pieList = []

  const rect = style.canvasBarchard.selectAll("g")
    .data(style.impExpStacked)
    .enter().append("g")
      .attr("fill", (d, i) => colorScale(parseInt(i/2)))
    .selectAll("rect")
    .data(d => d)
    .enter().append("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("y", style.height - style.margin.bottom)
      .attr("width", bandWidth)
      .attr("height", 0)
      .on("click", function(d, i) {
        style.impExpStacked.forEach(function(d) {
          pieList.push(d[i])
        })
        makePieChard(pieList, style, style.listLands[i])
        pieList = []
      } );

  style.canvasBarchard.append("g")
    .attr("transform", "translate( 0," + (style.height + style.margin.top) + ")")
    .call(xAxis)
      .selectAll("text")
        .attr("y", -2)
        .attr("x", 7)
        .attr("dy", ".35em")
        .attr("transform", "rotate(60)")
        .style("text-anchor", "start");

  const axis = style.canvasBarchard.append("g")
    .attr("transform", "translate( "+ (style.margin.left) +", 0)")
    .call(yAxis);

  function transitionGrouped() {
    y.domain([0, d3.max(style.listYValues)]);
    axis.transition()
      .call(yAxis)

    rect.transition()
        .duration(500)
        .delay((d, i) => i * 20)
        .attr("x", (d, i) => xScale(i) + bandWidth / n * d[2])
        .attr("width",bandWidth / n)
      .transition()
        .attr("y", d => y(d[1] - d[0]))
        .attr("height", d => y(0) - y(d[1] - d[0]));
  }

  function transitionStacked() {
    y.domain([0, d3.max(style.listRealYValues)]);
    axis.transition()
      .call(yAxis)

    rect.transition()
        .duration(500)
        .delay((d, i) => i * 20)
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
      .transition()
        .attr("x", (d, i) => xScale(i))
        .attr("width", bandWidth);
  }

  transitionStacked();

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
