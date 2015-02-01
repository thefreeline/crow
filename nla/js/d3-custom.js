
$(document).ready(function(){

  $(document).on('click', '#dropdown-ul-result-cat li a', function () {
      $("#dropdown-result-cat").text($(this).text());
      var resultCat = $(this).text();
      d3.selectAll('svg').remove();
      d3.selectAll('.d3-tip').remove();
      update(resultCat,superAgg,aggLevel);
      //console.log(filter);
  });

  $(document).on('click', '#dropdown-ul-super-agg li a', function () {
      $("#dropdown-super-agg").text($(this).text());
      var superAgg = $(this).text();
      d3.selectAll('svg').remove();
      d3.selectAll('.d3-tip').remove()
      update(resultCat,superAgg,aggLevel);
      //console.log(filter);
  });

  $(document).on('click', '#dropdown-ul-agg-level li a', function () {
      $("#dropdown-agg-level").text($(this).text());
      var superAgg = $(this).text();
      d3.selectAll('svg').remove();
      d3.selectAll('.d3-tip').remove()
      update(resultCat,superAgg,aggLevel);
      //console.log(filter);
  });

});

//Define initial chart filters
var resultCat = "Poor",
    superAgg = "Fed_nonFed",
    aggLevel = "BLM";


var margin = {top: 5, right: 40, bottom: 20, left: 120},
    width = 960 - margin.left - margin.right,
    height = 50 - margin.top - margin.bottom;

var chart = d3.bullet()
    .width(width)
    .height(height);

var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) { 
        return '<div id="tooltip-table"><table>' +
        '<tr><td>Super-Aggregation: </td><td>' + d["Super-Aggregation"] + '</td>' +
        '<tr><td>Aggregation Level: </td><td>' + d["Aggregation Level"] + '</td>' +
        '<tr><td>Proportion: </td><td>' + d["Proportion"] + '</td>' +
        '<tr><td>Lower Bound: </td><td>' + d["Lower Bound"] + '</td>' +
        '<tr><td>Upper Bound: </td><td>' + d["Upper Bound"] + '</td>' +
        '</div></table>' })
      .offset([0, 0]);


//d3.json("data/bullets.json", function(error, data) {
//d3.csv("data/test.csv", function(error, data) {

function update(filterResult, filterSupAgg, filterAggLevel) {

  d3.csv("data/2007_Condition_Data.csv", function(error, data) {  

//console.log("running update with filter:",filter)    

    

    //Create array of unique values
    var resultCat = d3.set(data.map(function(d) { return d["Result Category"]; })).values();
    var superAgg = d3.set(data.map(function(d) { return d["Super-Aggregation"]; })).values();
    var aggLevel = d3.set(data.map(function(d) { return d["Aggregation Level"]; })).values();
  //console.log(resultCat);

    d3.select("#dropdown-ul-result-cat").selectAll("li")
        .data(resultCat)
      .enter().append("li")
        .attr("role","presentation")
      .insert("a")
        .attr("role","menuitem")
        .attr("tabindex","-1")
        .attr("href","#")
        .html(function(d){ return d; });

    d3.select("#dropdown-ul-super-agg").selectAll("li")
        .data(superAgg)
      .enter().append("li")
        .attr("role","presentation")
      .insert("a")
        .attr("role","menuitem")
        .attr("tabindex","-1")
        .attr("href","#")
        .html(function(d){ return d; });

    d3.select("#dropdown-ul-agg-level").selectAll("li")
        .data(aggLevel)
      .enter().append("li")
        .attr("role","presentation")
      .insert("a")
        .attr("role","menuitem")
        .attr("tabindex","-1")
        .attr("href","#")
        .html(function(d){ return d; });

    data = data.filter( function(d){ return d["Result Category"] == filterResult && d["Super-Aggregation"] == filterSupAgg && d["Aggregation Level"] == filterAggLevel; });

console.log(data);

    var svg = d3.select("#d3-chart-2").selectAll("svg")
        .data(data)
      .enter().append("svg")
        .attr("class", function(d){ console.log("About to call"); return "bullet"; })
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(chart);

    svg.call(tip);

    var title = svg.append("g")
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + height / 2 + ")")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    title.append("text")
        .attr("class", "title")
        .text(function(d) { return d.Metric; });

    title.append("text")
        .attr("class", "subtitle")
        .attr("dy", "1em")
        .text(function(d) { return d["Super-Aggregation"] + ": " + d["Result Category"]; });

  });
}

update(resultCat,superAgg,aggLevel);
