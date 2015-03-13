(function() {

d3.bullet = function(d) {

  d3.csv(NLA0712_Change_Estimates, function(error, data) {  
    console.log(data)

  })
  
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
         
        var g = d3.select(this);
        // console.log("G::", g);
        // console.log("   ::Data Level 1:: ",i,d)

        var bulletsub = g.selectAll("g .bullet-sub")
            .data(d.values /*, function(d) {return d.values;} */)
          .enter()
            .append("g")
            .attr("class","bullet-sub")
            .attr("height", function(d){ return bulletheight + bulletmargin.top + bulletmargin.bottom; })
            .attr("transform", function(d,i) { return "translate(0," + ((bulletheight + bulletmargin.top + bulletmargin.bottom)*i) + ")"; })
            

      bulletsub.each(function(d, j) {

        var gsub = d3.select(this);
        
          // console.log(gsub)

          // console.log(j,"::Each Data::",d)
          
        var startrange      = +d[nla12_ce_lcb95pctp]/100,
            endrange        = +d[nla12_ce_ucb95pctp]/100,
            proportion      = +d[nla12_ce_estp]/100,
            startconfidence = +startrange - .05,
            endconfidence   = +startconfidence + .15;
            
            // console.log(startrange)
            // console.log(endrange)
            // console.log(proportion)
            // console.log(startconfidence)
            // console.log(endconfidence)

      var bullettitle = gsub.append("g")
          .style("text-anchor", "start")
          .attr("transform", "translate(-150," + bulletheight / 1.5 + ")")

      bullettitle.append("text")
          .attr("class", "title indicator")
          .text(function(d,i) { return d[nla12_ce_indic].replace(/_/g," "); });

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .html(function(d) { 
              var d = this.data();

              return '<div id="tooltip-table"><table>' +
              '<tr><td>Type: </td><td>'           + d[0][nla12_ce_type] + '</td>' +
              '<tr><td>Subpopulation: </td><td>'  + d[0][nla12_ce_subpop] + '</td>' +
              '<tr><td>Indicator: </td><td>'      + d[0][nla12_ce_indic] + '</td>' +
              '<tr><td>Category: </td><td>'       + d[0][nla12_ce_cat] + '</td>' +
              '<tr><td>Proportion: </td><td>'     + d3.round(d[0][nla12_ce_estp]/100,2) + '</td>' +
              '<tr><td>Lower Bound: </td><td>'    + d3.round(d[0][nla12_ce_lcb95pctp]/100,2) + '</td>' +
              '<tr><td>Upper Bound: </td><td>'    + d3.round(d[0][nla12_ce_ucb95pctp]/100,2) + '</td>' +
              '</div></table>' })
            .offset([0, 0]);

        var bulletsvg = d3.select("#d3-bullet").selectAll("svg")
        bulletsvg.call(tip);

        // function for the y grid lines
        function make_x_axis() {
          return d3.svg.axis()
              .scale(x1)
              .orient("bottom")
              .ticks(5)
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


        // Derive width-scales from the x-scales.
        var w0 = bulletWidth(x0),
            w1 = bulletWidth(x1);

        //Draw the y grid lines
        if(i==0 && j==0) {

          var xAxis = d3.svg.axis()
              .scale(x1)
              .orient("bottom")
              .tickSize(0)
              .ticks(5)
              .tickFormat(tickFormat);

          //Add the x-axis
          var xAxisAppend = bulletsub.append("g")
              .attr("class","x-axis")
              .attr("transform", "translate(0,0)")
              .call(xAxis);

          var xGrid = gsub.append("g")            
              .attr("class", "grid")
              .attr("transform", "translate(0,10)")
              .call(make_x_axis()
                  .tickSize(bulletheight-15)
                  .tickFormat("")
                  .tickPadding(10)
              );
        } else {

          var xGrid = gsub.append("g")            
              .attr("class", "grid")
              .attr("transform", "translate(0,0)")
              .call(make_x_axis()
                  .tickSize(bulletheight)
                  .tickFormat("")
                  .tickPadding(10)
              );

          var xAxis = d3.svg.axis()
              .scale(x1)
              .orient("bottom")
              .tickSize(0)
              .ticks(0)
              .tickFormat(tickFormat);

          //Add the x-axis
          var xAxisAppend = bulletsub.append("g")
              .attr("class","x-axis")
              .attr("transform", "translate(0,0)")
              .call(xAxis);
        }
        // Update the confidence rects.
        /*var confidence = gsub.selectAll("rect.confidence")
            //.data(startconfidence);
            .data([d]);

        confidence.enter().append("rect")
            .attr("class", function(d,i) { return "confidence"; })
            .attr("width", 0)
            .attr("height", (bulletheight - 10))
            .attr("y", 5)
            .attr("x", 0 )
          .transition()
            .duration(duration)
            .attr("x", function(d) { 
              if ( x1( startconfidence ) < 0 ) { sc = 0; } else { sc = x1( startconfidence ); }  return sc; })
            .attr("width", x1( endconfidence-startconfidence ) );*/

        // Update the measure rects.
        var measure = gsub.selectAll("rect.measure")
            .data([d]);

        measure.enter().append("rect")
            .attr("class", function(d, i) { return "measure"; })
            .attr("width", 0)
            .attr("height", bulletheight / 3)
            .attr("x", reverse ? x0 : 0)
            .attr("y", (( bulletheight / 2 ) - ( (bulletheight / 3)/2 )) )
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
        var range = gsub.selectAll("rect.range")
            .data([d]);

        range.enter().append("rect")
            .attr("class","range")
            .attr("width", 0)
            .attr("height", bulletheight / 4.5)
            .attr("y", (( bulletheight / 2 ) - ( (bulletheight / 4.5)/2 )) )
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
              .attr("x", x1( startrange ) )
              .attr("width", x1( endrange-startrange ) );

        // add the toggle labels
        var label = gsub.append("g")
            .style("text-anchor", "start")
            .attr("class", "label-ul-bounds")
            .attr("transform", function(d,i) { return "translate(" + (x1(startrange) + x1(endrange-startrange) + 5)  + ",22)"; })
        
        label.append("text")
            .attr("class", function(d){ 
              if($("#button-toggle-labels").hasClass("toggle-on")) { 
                return "active"; 
              } 
            })
            .text(function(d) { return d3.round(startrange,2) + "-" + d3.round(endrange,2); });
      })
    });
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

