function range(d) {

  var duration = 500,
  tickFormat = d3.format(".0%"),
  radius = 3,
  rangeG = d3.selectAll("#d3-range g");

  rangeG.each(function(d, i) {   

//console.log(d);

    var pVal = [+d["DiffEst"]]
        lb = [+d["LB2-LB1"]],
        sig = [d["Significant"]],
        g = d3.select(this);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) { 
          var d = this.data();         
          return '<div id="tooltip-table"><table>' +
          '<tr><td>DiffEst: </td><td>' + d[0]["DiffEst"] + '</td>' +
          '<tr><td>LB2-LB1: </td><td>' + d[0]["LB2-LB1"] + '</td>' +
          '<tr><td>Significant? </td><td>' + d[0]["Significant"] + '</td>' +
          '</div></table>' })
        .offset([0, 0]);

    var rangesvg = d3.select("#d3-range").selectAll("svg")
    rangesvg.call(tip);

    // function for the y grid lines
    function make_x_axis() {
      return d3.svg.axis()
          .scale(xScale)
          .orient("bottom")
          .ticks(5)
    }

    // Compute the new slope y-scale.
    var xScale = d3.scale.linear()
        .domain([-1,1])
        .range([0, rangewidth-rangemargin.left-rangemargin.right]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickSize(0)
        .ticks(5)
        .tickFormat(tickFormat);

    var symbol = d3.svg.symbol().type('diamond')
        .size(5);

    var confidence = g.selectAll("rect.confidence")
        .data(pVal);

    //Draw the symbols
    var triangle = g.selectAll('path')
        .data([d])
        .enter()
        .append('path')
        .attr("class",function(d){ return "significant-" + sig; })
        .attr('d',symbol)
        .attr('stroke','#666')
        .attr('stroke-width',0)
        .attr('transform',function(d,i){ return "translate("+ xScale( pVal - (lb/2)) + "," + (rangeheight/2) + ")"; })
      .on('mouseover', function(d) {
          d3.select(this)
            .classed('opacity-hover',true)
            .classed('stroke-hover',true)
            .call(tip.show)
        })
        .on('mouseout',  function() {
          d3.select(this)
            .classed('opacity-hover',false)
            .classed('stroke-hover',false)
            .call(tip.hide)
        })
      .transition()
        .duration(duration)
        .attr('stroke-width',7);

    //Draw the y grid lines
    if(i==0) {
      var xGrid = g.append("g")            
          .attr("class", "grid")
          .attr("transform", "translate(0,10)")
          .call(make_x_axis()
              .tickSize(rangeheight - 15)
              .tickFormat("")
              .tickPadding(10)
          );
    } else {
      var xGrid = g.append("g")            
          .attr("class", "grid")
          .attr("transform", "translate(0,5)")
          .call(make_x_axis()
              .tickSize(rangeheight - 10)
              .tickFormat("")
              .tickPadding(10)
          );
    }

    var confidence = confidence.data([d]).enter().append("rect")
        .attr("class",function(d){ return "significant-" + sig; })
        .attr("width", 0)
        .attr("height", rangeheight / 5)
        .attr("y", (( rangeheight / 2 ) - ( (rangeheight / 5)/2 )) )
        .attr("x", xScale( pVal - (lb/2)) )
      .on('mouseover', function(d) {
          d3.select(this)
            .classed('opacity-hover',true)
            .classed('stroke-hover',true)
            .call(tip.show)
        })
        .on('mouseout',  function() {
          d3.select(this)
            .classed('opacity-hover',false)
            .classed('stroke-hover',false)
            .call(tip.hide)
        })
      .transition()
        .duration(duration)
        .attr("x", xScale( pVal - lb ) )
        .attr("width", xScale( lb ) );

    //Add the x-axis
    if (i==0) {
      var xAxisAppend = g.append("g")
        .attr("class","x-axis")
        .attr("transform", "translate(0,0)")
        .call(xAxis);
    }

  }) //End of slopeG.each

  function rangetranslate(x) {
    return function(d) {
      console.log(x(d));
      return "translate(" + "10," + x(d) + ")";
    };
  }

  function tickFormat(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return tickFormat;
  }
};