$(document).on('click', '.dropdown-menu li a', function () {
    $("#dropdownMenu1").text($(this).text());
    console.log("Selected Option:"+$(this).text());
});



var margin = {top: 5, right: 40, bottom: 20, left: 120},
    width = 960 - margin.left - margin.right,
    height = 50 - margin.top - margin.bottom;

var chart = d3.bullet()
    .width(width)
    .height(height);


//d3.json("data/bullets.json", function(error, data) {
//d3.csv("data/test.csv", function(error, data) {
d3.csv("data/2007_Condition_Data.csv", function(error, data) {  
  
  //Create array of unique values
  var resultCat = d3.set(data.map(function(d) { return d["Result Category"]; })).values();
console.log(resultCat);

  data = data.filter( function(d){ return d["Result Category"] == "Poor"; })
//console.log(data);

  d3.select("#dropdown-ul").selectAll("li")
      .data(resultCat)
    .enter().append("li")
      .attr("role","presentation")
    .insert("a")
      .attr("role","menuitem")
      .attr("tabindex","-1")
      .attr("href","#")
      .html(function(d){ return d; });

      //<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Action</a></li>


  var svg = d3.select("#d3-chart-2").selectAll("svg")
      .data(data)
    .enter().append("svg")
    //.filter( function(d) { return d["Result Category"] == "Poor"; })
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
