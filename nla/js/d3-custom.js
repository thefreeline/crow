
$(document).ready(function(){

  $(document).on('click', '#dropdown-ul-result-cat li a', function () {
      $("#dropdown-result-cat").text($(this).text());
      var resultCat = $(this).text();
      d3.selectAll('svg').remove();
      d3.selectAll('.d3-tip').remove();
//console.log(resultCat,superAgg,aggLevel);
      update(resultCat,superAgg,aggLevel);
      //console.log(filter);
  });

  $(document).on('click', '#dropdown-ul-super-agg li a', function () {
      $("#dropdown-super-agg").text($(this).text());
      var superAgg = $(this).text();
      d3.selectAll('svg').remove();
      d3.selectAll('.d3-tip').remove();
//console.log(resultCat,superAgg,aggLevel);
      update(resultCat,superAgg,aggLevel);
      //console.log(filter);
  });

  $(document).on('click', '#dropdown-ul-agg-level li a', function () {
      $("#dropdown-agg-level").text($(this).text());
      var aggLevel = $(this).text();
      d3.selectAll('svg').remove();
      d3.selectAll('.d3-tip').remove();
//console.log(resultCat,superAgg,aggLevel);      
      update(resultCat,superAgg,aggLevel);
      //console.log(filter);
  });

});

//Define initial chart filters
var resultCat = "Poor",
    superAgg = "National",
    aggLevel = "National";


var margin = {top: 5, right: 40, bottom: 20, left: 200},
    bulletwidth = 560 - margin.left - margin.right,
    slopewidth = 70,
    rangewidth = 140,
    height = 50 - margin.top - margin.bottom;

var bulletchart = d3.bullet()
    .width(bulletwidth)
    .height(height);



//var slopechart = d3.slope();

var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) { 
        return '<div id="tooltip-table"><table>' +
        '<tr><td>Super-Aggregation: </td><td>' + d["Super-Aggregation"] + '</td>' +
        '<tr><td>Aggregation Level: </td><td>' + d["Aggregation Level"] + '</td>' +
        '<tr><td>Proportion: </td><td>' + d["Proportion 2007"] + '</td>' +
        '<tr><td>Lower Bound: </td><td>' + d["Lower Bound 2007"] + '</td>' +
        '<tr><td>Upper Bound: </td><td>' + d["Upper Bound 2007"] + '</td>' +
        '</div></table>' })
      .offset([0, 0]);


function update(filterResult, filterSupAgg, filterAggLevel) {

  d3.csv("data/2007_2012_Condition_Data.csv", function(error, data) {  


    console.log(filterResult, filterSupAgg, filterAggLevel);

    //Create array of unique values
    var resultCat = d3.set(data.map(function(d) { return d["Result Category"];   })).values();  
    var superAgg =  d3.set(data.map(function(d) { return d["Super-Aggregation"]; })).values();
    var aggLevel =  d3.set(data.map(function(d) { return d["Aggregation Level"]; })).values();

    var duration = 250;
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

  
    var bulletsvg = d3.select("#d3-bullet").selectAll("svg")
        .data(data)
      .enter().append("svg")
        .attr("class", function(d){ /*console.log("About to call");*/ return "bullet"; })
        .attr("width", bulletwidth + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(bulletchart);

    bulletsvg.call(tip);

    var title = bulletsvg.append("g")
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


    /*************/
    /** 
    /** Start Slope Graphs
    /** 
    /*************/
    var slopesvg = d3.select("#d3-slope").selectAll("svg")
        .data(data)
      .enter().append("svg")
        .attr("class", "slope")
        .attr("width", slopewidth)
        .attr("height", height + margin.top + margin.bottom)
      
    var slopeG = slopesvg.append("g");
    
    slopeG.each(function(d, i) {   
      var startSlope = [+d["Proportion 2007"]],
          endSlope = [+d["Proportion 2012"]],
          g = d3.select(this);

      // Compute the new slope y-scale.
      var ySlope = d3.scale.linear()
          .domain([0,1])
          .range([0, height + margin.top]);

    
      var lines = g.selectAll("line")
        .data(startSlope);
        
      lines.enter()
        .append("line")
          .attr("x1", 4)
          .attr("x2", 4)
          .attr("y1", ySlope(startSlope))
          .attr("y2", ySlope(startSlope))
        .transition()
          .duration(duration)
          .attr("x1", 4)
          .attr("x2", slopewidth-4)
          .attr("y1", ySlope(startSlope))
          .attr("y2", ySlope(endSlope))
          .attr("class","measure");

      var nodes = g.selectAll("circle")
        .data(startSlope)

      var startNode = nodes.enter()
        .append("circle")
          .attr("r",3)
          .attr("cx",4)
          .attr("cy",ySlope(startSlope))
          .attr("class","measure-start")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

      var endNode = nodes.enter()
        .append("circle")
          .attr("r",0)
          .attr("cx",4)
          .attr("cy",ySlope(startSlope))
        .transition()
          .duration(duration)
          .attr("r",3)
          .attr("cx",slopewidth-4)
          .attr("cy",ySlope(endSlope))
          .attr("class","measure-end")
        //.on('mouseover', tip.show)
        //.on('mouseout', tip.hide);
    }) //End of slopeG.each

    /*************/
    /** 
    /** Start CI Range Graphs
    /** 
    /*************/
    var rangesvg = d3.select("#d3-range").selectAll("svg")
        .data(data)
      .enter().append("svg")
        .attr("class", "range")
        .attr("width", rangewidth)
        .attr("height", height + margin.top + margin.bottom)
      
    var rangeG = rangesvg.append("g");
    
    rangeG.each(function(d, i) {   
      var pVal = [+d["DiffEst"]]
          lb = [+d["LB2-LB1"]],
          sig = [d["Significant"]],
          g = d3.select(this);

      // Compute the new slope y-scale.
      var xRange = d3.scale.linear()
          .domain([0,10])
          .range([0, rangewidth]);

      var symbol = d3.svg.symbol().type('triangle-up')
          .size(5);

      var confidence = g.selectAll("rect.confidence")
          .data(pVal);

      confidence.enter().append("rect")
          .attr("class",function(d){ return "significant-" + sig; })
          .attr("width", 0)
          .attr("height", height)
          .attr("y", 0)
          .attr("x", 0 )
        .transition()
          .duration(250)
          .attr("x", xRange( pVal - lb ) )
          .attr("width", xRange( lb ) )
          .attr("height", height / 5)
          .attr("y", height / 2.5);

      var triangle = g.selectAll('path')
        .data(pVal)
        .enter()
        .append('path')
        .attr("class",function(d){ return "significant-" + sig; })
        .attr('d',symbol)
        .attr('stroke','#666')
        .attr('stroke-width',7)
        .attr('transform',function(d,i){ return "translate("+ xRange( pVal - (lb/2)) + ","+ (15) +")"; });

          console.log("x",xRange( pVal - (lb/2) ))
          console.log("width", xRange( lb ))

      // Compute the tick format.
      var format = tickFormat || xRange.tickFormat(8);

      /*// Update the tick groups.
      var tick = g.selectAll("g.tick")
          .data(xRange.ticks(8), function(d) {
            console.log(format(d));
            return format(d);
          });

      // Initialize the ticks with the old scale, x0.
      var tickEnter = tick.enter().append("g")
          .attr("class", "tick")
          .attr("transform", translate(xRange))
          .style("opacity", 1e-6);

      tickEnter.append("line")
          .attr("y1", height)
          .attr("y2", height * 7 / 6);

      tickEnter.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "1em")
          .attr("y", height * 7 / 6)
          .text(format);

      // Transition the entering ticks to the new scale, x1.
      tickEnter.transition()
          .duration(0)
          .attr("transform", translate(xRange))
          .style("opacity", 1);

      // Transition the updating ticks to the new scale, x1.
      var tickUpdate = tick.transition()
          .duration(0)
          .attr("transform", translate(xRange))
          .style("opacity", 1);

      tickUpdate.select("line")
          .attr("y1", height)
          .attr("y2", height * 7 / 6);

      tickUpdate.select("text")
          .attr("y", height * 7 / 6);

      // Transition the exiting ticks to the new scale, x1.
      tick.exit().transition()
          .duration(0)
          .attr("transform", translate(xRange))
          .style("opacity", 1e-6)
          .remove();*/
    }) //End of slopeG.each


  });
}

function translate(x) {
  return function(d) {
    return "translate(" + x(d) + ",0)";
  };
}

function tickFormat(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return tickFormat;
  };
update(resultCat,superAgg,aggLevel);
