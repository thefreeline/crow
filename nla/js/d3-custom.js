var margin = {top: 5, right: 40, bottom: 20, left: 120},
    width = 960 - margin.left - margin.right,
    height = 50 - margin.top - margin.bottom;

var chart = d3.bullet()
    .width(width)
    .height(height);


//d3.json("data/bullets.json", function(error, data) {
//d3.csv("data/test.csv", function(error, data) {
d3.csv("data/2007_Condition_Data.csv", function(error, data) {  

  //datafilter(data);

  var svg = d3.select("#d3-chart-2").selectAll("svg")
      .data(data)
    .enter().append("svg")
    .filter( function(d) { return d["Result Category"] == "Poor"; })
      .attr("class", "bullet")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(chart);

  var title = svg.append("g")
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + height / 2 + ")");

  title.append("text")
      .attr("class", "title")
      .text(function(d) { return d.Metric; });

  title.append("text")
      .attr("class", "subtitle")
      .attr("dy", "1em")
      .text(function(d) { return d.Metric; });
});

function datafilter(d){
  console.log(d)
  //var sector = document.getElementById("sec");
  //var sec = sector.options[sector.selectedIndex].value;
  var resultCat = "Poor"
  data = d.filter(function(d) { return d["Result Category"]  == resultCat;});
  return data;
}