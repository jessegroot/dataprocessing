// Name: Jesse Groot
// Student number: 11012579

/**
This file makes the sunburst
**/

function makeSunburst(pieData, style, land) {
  // makes sure the space whering the sunburst comes is empty
  style.canvasSun.selectAll("g").remove()
  style.canvasSun.selectAll("text").remove()

  // gets data in right format
  var data = getDataSun(pieData, style);
  var radius = 200;

  // Gets the data in right format
  var partition = data => d3.partition()
    .size([2 * Math.PI, radius])
  (d3.hierarchy(data)
    .sum(d => d.size)
    .sort((a, b) => b.value - a.value));

  var root = partition(data);

  // collorscale for imp and export
  var color = d3.scaleOrdinal().range(d3.quantize(d3.interpolateRainbow, data.children.length + 1));

  var format = d3.format(",d");

  // add g (each part of the sunburst)
  var g = style.canvasSun.append("g");


  var arc = d3.arc()
    // select the angle
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius / 2)
    // selects the layer of the sunburst (inner/outer radius donut)
    .innerRadius(d => d.y0)
    .outerRadius(d => d.y1 - 1)

  // select part of the donut
  g.append("g")
      .attr("fill-opacity", 0.6)
    .selectAll("path")
    .data(root.descendants().filter(d => d.depth))
    .enter().append("path")
      // make the outer layer of the sunburst (innerlayers take up all space of the outer layers)
      .attr("fill", d => { while (d.depth > 1) {d = d.parent}; return color(d.data.name); })
      .attr("d", arc)

  g.append("g")
    .attr("text-anchor", "middle")
    .selectAll("text")
    // select all names
    .data(root.descendants().filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
    // set them into the sunburst
    .enter().append("text")
      .attr("transform", function(d) {
        var x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        var y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 90 ? 0 : 90})`;
      })
      .attr("dy", "0.35em")
      .text(d => d.data.name);

  // transform to middle
  style.canvasSun.selectAll("g")
    .attr("transform","translate(" + (radius/2) + " ," + (radius/2) + ")")

  // get land in the middle of the sunburst
  style.canvasSun.append("text")
    .attr("y", radius+5)
    .attr("x", radius)
    .style("text-anchor", "middle")
    .text(function(d){ return land });
}
