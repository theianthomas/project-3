// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("#area2")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var url3 = "/api4"

// Step 3:
// Import data from the va_data.csv file
// =================================

// d3.json(url3).then(function(data))
d3.json(url3).then(function (vaData) {
  // Step 4: Parse the data
  // Format the data and convert to numerical and date values
  // =================================
  // Create a function to parse date and time
  var parseTime = d3.timeParse("%Y");

  // Format the data
  vaData.forEach(function (data) {
    data.Year = parseTime(data.Year);
    data.Coal = +data.Coal;
    data.Petroleum_Products = +data.Petroleum_Products;
    data.Natural_Gas = +data.Natural_Gas;
    data.Total = +data.Total
  });

  // Step 5: Create the scales for the chart
  // =================================
  var xTimeScale = d3.scaleTime()
    .domain(d3.extent(vaData, d => d.Year))
    .range([0, width]);

  var yLinearScale = d3.scaleLinear().range([height, 0]);

  // Step 6: Set up the y-axis domain
  // ==============================================
  // @NEW! determine the max y value
  // find the max of the morning data
  var TotalMax = d3.max(vaData, d => d.Total);

  // find the max of the evening data
  var Petroleum_ProductsMax = d3.max(vaData, d => d.Petroleum_Products);

  // find the max of the evening data
  // var Natural_GasMax = d3.max(vaData, d => d.Natural_Gas);

  var yMax;
  if (TotalMax > Petroleum_ProductsMax) {
    yMax = TotalMax;
  }
  else {
    yMax = Petroleum_ProductsMax;
  }

  // var yMax = morningMax > eveningMax ? morningMax : eveningMax;

  // Use the yMax value to set the yLinearScale domain
  yLinearScale.domain([0, yMax]);

  // Step 7: Create the axes
  // =================================
  var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y"));
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 8: Append the axes to the chartGroup
  // ==============================================
  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Add y-axis
  chartGroup.append("g").call(leftAxis);

  // Step 9: Set up two line generators and append two SVG paths
  // ==============================================

  // Line generator for morning data
  var line1 = d3.line()
    .x(d => xTimeScale(d.Year))
    .y(d => yLinearScale(d.Coal));

  // Line generator for evening data
  var line2 = d3.line()
    .x(d => xTimeScale(d.Year))
    .y(d => yLinearScale(d.Petroleum_Products));

  // Line generator for evening data
  var line3 = d3.line()
    .x(d => xTimeScale(d.Year))
    .y(d => yLinearScale(d.Natural_Gas));

  var line4 = d3.line()
    .x(d => xTimeScale(d.Year))
    .y(d => yLinearScale(d.Total));

  // Append a path for line1
  chartGroup
    .append("path")
    .attr("d", line1(vaData))
    .classed("line green", true);

  // Append a path for line2
  chartGroup
    .data([vaData])
    .append("path")
    .attr("d", line2)
    .classed("line orange", true);

  // Append a path for line3
  chartGroup
    .data([vaData])
    .append("path")
    .attr("d", line3)
    .classed("line blue", true);

  // Append a path for line4
  chartGroup
    .data([vaData])
    .append("path")
    .attr("d", line4)
    .classed("line red", true);

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Million Metric Tons of CO2");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Year");

  // Add color coded titles to the x-axis

  chartGroup.append("text")

    // Position the text
    // Center the text:
    // (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor)
    .attr("transform", `translate(${width / 25}, ${height + margin.top + 37})`)
    .attr("text-anchor", "left")
    .attr("font-size", "20px")
    .attr("fill", "orange")
    .text("Petroleum Products");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 4}, ${height + margin.top + 20})`)
    .attr("text-anchor", "left")
    .attr("font-size", "20px")
    .attr("fill", "green")
    .text("Coal");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 4}, ${height + margin.top + 37})`)
    .attr("text-anchor", "left")
    .attr("font-size", "20px")
    .attr("fill", "blue")
    .text("Natural Gas");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 25}, ${height + margin.top + 20})`)
    .attr("text-anchor", "left")
    .attr("font-size", "20px")
    .attr("fill", "red")
    .text("Total");

  // append circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(vaData)
    .enter()
    .append("circle")
    .attr("cx", d => xTimeScale(d.Year))
    .attr("cy", d => yLinearScale(d.Total))
    .attr("r", "5")
    .attr("fill", "red")
    // .attr("stroke-width", "1")
    .attr("stroke", "black");

  // Date formatter to display dates nicely
  var dateFormatter = d3.timeFormat("%Y");

  // Step 1: Initialize Tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`<strong>${dateFormatter(d.Year)}<strong><hr>${d.Total}
          Total Emissions`);
    });

  // Step 2: Create the tooltip in chartGroup.
  chartGroup.call(toolTip);

  // Step 3: Create "mouseover" event listener to display tooltip
  circlesGroup.on("mouseover", function (d) {
    toolTip.show(d, this);
  })
    // Step 4: Create "mouseout" event listener to hide tooltip
    .on("mouseout", function (d) {
      toolTip.hide(d);
   });

}).catch(function (error) {
  console.log(error);
});
