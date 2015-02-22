(function() {

d3.bullet = function(d) {
  
  var orient = "left", // TODO top & bottom
      reverse = false,
      duration = 500,
      width = 380,
      height = 30,
      tickFormat = d3.format(".0%");

  // For each small multiple…
  function bullet(g) {
   
    var bulletG = d3.selectAll("#d3-bullet g");

    bulletG.each(function(d, i) {

      var startrange = [+d["Lower Bound 2007"]],
          endrange = [+d["Upper Bound 2007"]],
          proportion = [+d["Proportion 2007"]],
          startconfidence = [+startrange - .05],
          endconfidence = [+startconfidence + .15],
          g = d3.select(this);

      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) { 
          var d = this.data();
  console.log(this);
          return '<div id="tooltip-table"><table>' +
          '<tr><td>Super-Aggregation: </td><td>' + d[0]["Super-Aggregation"] + '</td>' +
          '<tr><td>Aggregation Level: </td><td>' + d[0]["Aggregation Level"] + '</td>' +
          '<tr><td>Proportion: </td><td>' + d[0]["Proportion 2007"] + '</td>' +
          '<tr><td>Lower Bound: </td><td>' + d[0]["Lower Bound 2007"] + '</td>' +
          '<tr><td>Upper Bound: </td><td>' + d[0]["Upper Bound 2007"] + '</td>' +
          '</div></table>' })
        .offset([0, 0]);

      var bulletsvg = d3.select("#d3-bullet").selectAll("svg")
      bulletsvg.call(tip);

      // function for the y grid lines
      function make_x_axis() {
        return d3.svg.axis()
            .scale(x1)
            .orient("bottom")
            .ticks(10)
      }

      // Compute the new x-scale.
      var x1 = d3.scale.linear()
          .domain([0,1])
          .range(reverse ? [width, 0] : [0, width]);

      // Retrieve the old x-scale, if this is an update.
      var x0 = this.__chart__ || d3.scale.linear()
          .domain([0, Infinity])
          .range(x1.range());

      // Stash the new scale.
      this.__chart__ = x1;

      var xAxis = d3.svg.axis()
        .scale(x1)
        .orient("bottom")
        .tickSize(0)
        .ticks(10)
        .tickFormat(tickFormat);

      // Derive width-scales from the x-scales.
      var w0 = bulletWidth(x0),
          w1 = bulletWidth(x1);

      //Draw the y grid lines
      var xGrid = g.append("g")            
          .attr("class", "grid")
          .attr("transform", "translate(0," + bulletmargin.top + ")")
          .call(make_x_axis()
              .tickSize(bulletheight - bulletmargin.bottom - bulletmargin.top - 5 )
              .tickFormat("")
              .tickPadding(10)
          );

      // Update the confidence rects.
      var confidence = g.selectAll("rect.confidence")
          //.data(startconfidence);
          .data([d]);

      confidence.enter().append("rect")
          .attr("class", function(d,i) { return "confidence"; })
          .attr("width", 0)
          .attr("height", (bulletheight - bulletmargin.top - bulletmargin.bottom - 5))
          .attr("y", bulletmargin.top)
          .attr("x", 0 )
        .transition()
          .duration(duration)
          .attr("x", function(d) { 
            if ( x1( startconfidence ) < 0 ) { sc = 0; } else { sc = x1( startconfidence ); }  return sc; })
          .attr("width", x1( endconfidence-startconfidence ) );

      // Update the measure rects.
      var measure = g.selectAll("rect.measure")
          .data([d]);

      measure.enter().append("rect")
          .attr("class", function(d, i) { return "measure"; })
          .attr("width", 0)
          .attr("height", bulletheight / 3)
          .attr("x", reverse ? x0 : 0)
          .attr("y", 11)
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
          .attr("width", x1(proportion))
          .attr("x", 0);


      // Update the range rects.
      var range = g.selectAll("rect.range")
          .data([d]);

      range.enter().append("rect")
          .attr("class", function(d,i) { return "range s" + i; })
          .attr("width", 0)
          .attr("height", bulletheight / 4.5)
          .attr("y", 13.25)
          .attr("x", 0 )
        .on('mouseover', function() {
          tip.show;
          d3.select(this)
            .classed('opacity-hover',true)
            .classed('stroke-hover',true)
            .call(tip.show)
        })
        .on('mouseout',  function() {
          tip.hide;
          d3.select(this)
            .classed('opacity-hover',false)
            .classed('stroke-hover',false)
            .call(tip.hide)
        })
        .transition()
          .duration(duration)
        //.attr("x", function(d,i) { return d[1]  })
          .attr("x", x1( startrange ) )
          .attr("width", x1( endrange-startrange ) );

      //Add the x-axis
      var xAxisAppend = g.append("g")
        .attr("class","x-axis")
        .attr("transform", "translate(0," + (bulletheight - bulletmargin.top - bulletmargin.bottom) + ")")
        .call(xAxis);

      var label = g.append("g")
        .style("text-anchor", "start")
        .attr("class", "label-ul-bounds")
        .attr("transform", function(d,i) { return "translate(" + (x1(startrange) + x1(endrange-startrange) + 5)  + ",22)"; })
      
      label.append("text")
          .attr("class", function(d){ 
            if($("#button-toggle-labels").hasClass("toggle-on")) { 
              return "active"; 
            } 
          })
          .text(function(d) { return startrange + "-" + endrange; });


      /*// Compute the tick format.
      var format = tickFormat || x1.tickFormat(8);

      // Update the tick groups.
      var tick = g.selectAll("g.tick")
          .data(x1.ticks(8), function(d) {
            return this.textContent || format(d);
          });

      // Initialize the ticks with the old scale, x0.
      var tickEnter = tick.enter().append("g")
          .attr("class", "tick")
          .attr("transform", bulletTranslate(x0))
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
          .attr("transform", bulletTranslate(x1))
          .style("opacity", 1);

      // Transition the updating ticks to the new scale, x1.
      var tickUpdate = tick.transition()
          .duration(0)
          .attr("transform", bulletTranslate(x1))
          .style("opacity", 1);

      tickUpdate.select("line")
          .attr("y1", height)
          .attr("y2", height * 7 / 6);

      tickUpdate.select("text")
          .attr("y", height * 7 / 6);

      // Transition the exiting ticks to the new scale, x1.
      tick.exit().transition()
          .duration(0)
          .attr("transform", bulletTranslate(x1))
          .style("opacity", 1e-6)
          .remove();*/
    });
    //d3.timer.flush();
  }

  // measures (actual, forecast)
  bullet.measures = function(x) {
    if (!arguments.length) return measures;
    measures = x;
    return bullet;
  };

  bullet.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return bullet;
  };

  bullet.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return bullet;
  };

  bullet.tickFormat = function(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return bullet;
  };

  bullet.duration = function(x) {
    if (!arguments.length) return duration;
    duration = x;
    return bullet;
  };

  return bullet;
};

  function bulletRanges(d) {
    range = {"range":[]}
    console.log(range)
    startrange = d["Lower Bound 2007"];
    endrange = d["Upper Bound 2007"];
    return d.ranges;
  }

  function bulletMarkers(d) {
    return d.markers;
  }

  function bulletMeasures(d) {
    return d.measures;
  }

  function bulletTranslate(x) {
    return function(d) {
      return "translate(" + x(d) + ",0)";
    };
  }

  function bulletWidth(x) {
    var x0 = x(0);
    //console.log("x0",x0);
    return function(d) {
      //console.log(Math.abs(x(d) - x0));
      return Math.abs(x(d) - x0);
    };
  }

})();


