url="/api"
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 0,
  bottom: 30,
  left: 0
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#area1")
  .append("svg")
  .classed("chart1")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from hours-of-tv-watched.csv
d3.json(url).then(function(Data) {

  console.log(Data);

  // Cast the hours value to a number for each piece of tvData
  Data.forEach(function(d) {
    d.co2 = +d.co2;
  });

  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
  var xBandScale = d3.scaleBand()
    .domain(Data.map(d => d.country))
    .range([0, chartWidth])
    .padding(0.1);

  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(Data, d => d.co2)])
    .range([chartHeight, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale);//.ticks(10);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // Create one SVG rectangle per piece of tvData
  // Use the linear and band scales to position each rectangle within the chart
  chartGroup.selectAll(".bar")
    .data(Data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xBandScale(d.country))
    .attr("y", d => yLinearScale(d.co2))
    .attr("width", xBandScale.bandwidth())
    .attr("height", d => chartHeight - yLinearScale(d.co2));
});


// ----------------------------------

url3="/api3"
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
  .classed("chart3")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// var url3 = "/api3"

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
    data.Natural_Gas = +data.Natural_Gas
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
  var CoalMax = d3.max(vaData, d => d.Coal);

  // find the max of the evening data
  var Petroleum_ProductsMax = d3.max(vaData, d => d.Petroleum_Products);

  // find the max of the evening data
  // var Natural_GasMax = d3.max(vaData, d => d.Natural_Gas);

  var yMax;
  if (CoalMax > Petroleum_ProductsMax) {
    yMax = CoalMax;
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
    .attr("transform", `translate(${width / 20}, ${height + margin.top + 20})`)
    .attr("text-anchor", "left")
    .attr("font-size", "20px")
    .attr("fill", "orange")
    .text("Petroleum Products");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 20}, ${height + margin.top + 37})`)
    .attr("text-anchor", "left")
    .attr("font-size", "20px")
    .attr("fill", "green")
    .text("Coal");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 20}, ${height + margin.top + 54})`)
    .attr("text-anchor", "left")
    .attr("font-size", "20px")
    .attr("fill", "blue")
    .text("Natural Gas");

}).catch(function (error) {
  console.log(error);
});
