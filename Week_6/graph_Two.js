// Name: Jesse Groot
// Student number: 11012579

/**
This file makes the sunburst
**/

function makePieChard(pieData, style, land) {
  // makes sure the space whering the sunburst comes is empty
  style.canvasSun.selectAll("g").remove()
  style.canvasSun.selectAll("text").remove()

  // gets data in right format
  data = getDataSun(pieData, style);
  radius = 200;

  // Gets the data in right format
  partition = data => d3.partition()
    .size([2 * Math.PI, radius])
  (d3.hierarchy(data)
    .sum(d => d.size)
    .sort((a, b) => b.value - a.value));

  var root = partition(data);

  // collorscale for imp and export
  color = d3.scaleOrdinal().range(d3.quantize(d3.interpolateRainbow, data.children.length + 1));

  format = d3.format(",d");

  // add g (each part of the sunburst)
  var g = style.canvasSun.append("g");

  arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius / 2)
    .innerRadius(d => d.y0)
    .outerRadius(d => d.y1 - 1)

  g.append("g")
      .attr("fill-opacity", 0.6)
    .selectAll("path")
    .data(root.descendants().filter(d => d.depth))
    .enter().append("path")
      .attr("fill", d => { while (d.depth > 1) {d = d.parent}
        console.log(d.data.name); return color(d.data.name); })
      .attr("d", arc)
    .append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

  g.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants().filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
    .enter().append("text")
      .attr("transform", function(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 90 ? 0 : 90})`;
      })
      .attr("dy", "0.35em")
      .text(d => d.data.name);

  document.body.appendChild(style.canvasSun.node());

  var box = g.node().getBBox();

  style.canvasSun.selectAll("g")
    .attr("transform","translate(" + (radius/2) + " ," + (radius/2) + ")")

  console.log(land)
  style.canvasSun.append("text")
    .attr("y", radius+5)
    .attr("x", radius)
    .style("text-anchor", "middle")
    .text(function(d){ return land });

  style.canvasSun.selectAll("svg").remove()
      .attr("width", box.width)
      .attr("height", box.height)
      .attr("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);

  return style.canvasSun.node();

}
