function range() {

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

    // function for the y grid lines
    function make_x_axis() {
      return d3.svg.axis()
          .scale(xScale)
          .orient("top")
          .ticks(5)
    }

    // Compute the new slope y-scale.
    var xScale = d3.scale.linear()
        .domain([-.1,.1])
        .range([0, rangewidth]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickSize(0)
        .ticks(5)
        .tickFormat(tickFormat);

    var symbol = d3.svg.symbol().type('triangle-up')
        .size(5);

    var confidence = g.selectAll("rect.confidence")
        .data(pVal);

    //Draw the symbols
    var triangle = g.selectAll('path')
        .data(pVal)
        .enter()
        .append('path')
        .attr("class",function(d){ return "significant-" + sig; })
        .attr('d',symbol)
        .attr('stroke','#666')
        .attr('stroke-width',0)
        .attr('transform',function(d,i){ return "translate("+ xScale( pVal - (lb/2)) + ","+ (15) +")"; })
      .transition()
        .duration(duration)
        .attr('stroke-width',7);

    //Draw the y grid lines
    var xGrid = g.append("g")            
        .attr("class", "grid")
        .attr("transform", "translate(0," + rangemargin.top + ")")
        .call(make_x_axis()
            .tickSize(-rangeheight + rangemargin.top + rangemargin.bottom + 5)
            .tickFormat("")
            .tickPadding(10)
        );

    var confidence = confidence.enter().append("rect")
        .attr("class",function(d){ return "significant-" + sig; })
        .attr("width", 0)
        .attr("height", rangeheight / 5)
        .attr("y", 12)
        .attr("x", xScale( pVal - (lb/2)) )
      .transition()
        .duration(duration)
        .attr("x", xScale( pVal - lb ) )
        .attr("width", xScale( lb ) );

    //Add the x-axis
    var xAxisAppend = g.append("g")
      .attr("class","x-axis")
      .attr("transform", "translate(0, " + (rangeheight - rangemargin.bottom - rangemargin.top) + ")")
      .call(xAxis);

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