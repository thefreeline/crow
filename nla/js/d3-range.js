function range(d) {

  var duration = 500,
  tickFormat = d3.format(".0%"),
  radius = 3,
  rangeG = d3.selectAll("#d3-range g"),
  rowCount = 0,
  axisFlag = 0;

  rangeG.each(function(d) {   

      g = d3.select(this);

      var rangesub = g.selectAll("g .range-sub")
              .data(d.values)
          .enter()
              .append("g")
              .attr("class","range-sub")
              .attr("data-loc",function(){  
                i = rowCount; 
                rowCount++; 
                return "chart-loc-" + i; 
              })
              .attr("height", function(d){ return rangeheight + rangemargin.top + rangemargin.bottom; })
              .attr("transform", function(d,i) { return "translate(0," + ((rangeheight + rangemargin.top + rangemargin.bottom)*i) + ")"; })          

      rangesub.each(function(d,j) {

          var rangesvg = d3.select(this.parentNode.parentNode);

          var rangeborder = rangesvg.insert("rect",":first-child")
                  .attr("class", "border")
                  // .attr("data-loc",j)
                  .attr("width",rangecontainer)
                  .attr("height", rangeheight + rangemargin.top + rangemargin.bottom)
                  .attr("transform",function(d){ return "translate(0," + ( (rangeheight + rangemargin.top + rangemargin.bottom) * j )  + ")"; })
      
          var gsub = d3.select(this);

          // console.log(d);

          var triangle      = +d[nla0712_ce_diffestp],
              barend        = (+d[nla0712_ce_ucb95pctp2] - +d[nla0712_ce_ucb95pctp1]),
              // barend      = +d[nla0712_ce_lcb95pctu2] - +d[nla0712_ce_lcb95pctp1]; // SHOULD THIS BE lcbP2???
              barstart      = (+d[nla0712_ce_lcb95pctp2] - +d[nla0712_ce_lcb95pctp1]),
              barwidth      = Math.abs(barstart - barend); 

              // console.log("triangle",+d[nla0712_ce_diffestp]);
              // console.log("barstart",barstart);
              // console.log("barend",barend);
              // console.log("barwidth",barwidth);
              

          var tip = d3.tip()
              .attr('class', 'd3-tip')
              .html(function(d) { 
                var d = this.data();  
                // console.log(d);       
                return '<div id="tooltip-table"><table>'  +
                '<tr><td>Metric Category: </td><td>'      + d[0][nla12_ce_metcat]    + '</td>' +
                '<tr><td>Indicator: </td><td>'            + d[0][nla12_ce_indic]     + '</td>' +
                '<tr><td>Confidence Interval: </td><td>'  + d3.round( barwidth,3 )   + '</td>' +
                '<tr><td>DiffEst.P: </td><td>'            + d3.round( d[0][nla0712_ce_diffestp],2 )   + '</td>' +
                '<tr><td>LB2-LB1: </td><td>'              + d3.round( barstart,2 )   + '</td>' +
                // '<tr><td>Significant? </td><td>' + d[0]["Significant"] + '<' +
                '</div></table>' })
              .offset([0, 0]);

          var rangesvg = d3.select("#d3-range").selectAll("svg")
          rangesvg.call(tip);

          // Compute the new slope y-scale.
          var xScale = d3.scale.linear()
              .domain([-10,10])
              .range([0, rangewidth-rangemargin.left-rangemargin.right]);


          var symbol = d3.svg.symbol().type('diamond')
              .size(5);

          var confidence = gsub.selectAll("rect.confidence")
              .data(triangle);

      if (barwidth !== 0) {

          //Draw the symbols
          var triangle = gsub.selectAll('path')
              .data([d])
              .enter()
              .append('path')
              .attr("class",function(d){ 
                if ( Math.min(barstart,barwidth) < 0 && Math.max(barstart,barwidth) > 0 ) {
                  return "significant-No"; 
                } else {
                  return "significant-Yes"; 
                }
              })
              .attr('d',symbol)
              .attr('stroke','#666')
              .attr('stroke-width',0)
              .attr('transform',function(d,i){ return "translate("+ xScale(triangle) + "," + (rangeheight/2) + ")"; })
            .on('mouseover', function(d) {
                d3.select(this)
                  // .classed('opacity-hover',true)
                  // .classed('stroke-hover',true)
                  .call(tip.show)
              })
              .on('mouseout',  function() {
                d3.select(this)
                  // .classed('opacity-hover',false)
                  // .classed('stroke-hover',false)
                  .call(tip.hide)
              })
            .transition()
              .duration(duration)
              .attr('stroke-width',5);

       } // end if(barwidth !== 0)


          var confidence = confidence.data([d]).enter().append("rect")
              .attr("class",function(d){ 
                if ( Math.min(barstart,barwidth) < 0 && Math.max(barstart,barwidth) > 0 ) {
                  return "significant-No"; 
                } else {
                  return "significant-Yes"; 
                }
              })
              .attr("width", 0)
              .attr("height", rangeheight / 5)
              .attr("y", (( rangeheight / 2 ) - ( (rangeheight / 5)/2 )) )
              .attr("x", xScale( barstart ) )
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
              .attr("x", xScale( Math.min(barstart,barend) ) )
              .attr("width", Math.abs(xScale(barwidth)-57.5) );


          //Add the x-axis
          if (axisFlag==0) {

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("top")
                .tickSize(5)
                .ticks(5)
                .tickFormat(function(d) { return d + "%"; });

            //Add the x-axis
            var xAxissvg = d3.select("#d3-range-axis")
                .append("svg")
                .attr("class","axis-container")
                .attr("width", rangewidth + rangemargin.left + rangemargin.right )

            var xAxisAppend = xAxissvg.append("g")
                .attr("transform", "translate(" + (rangemargin.left + rangemargin.right) + ",20)")
                .call(xAxis);
          }

          // function for the y grid lines
          function make_gridlines() {
            return d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(5)
          }

          var xGrid = gsub.append("g")            
              .attr("class", "grid")
              .attr("transform", "translate(0,0)")
              .call(make_gridlines()
                  .tickSize(rangeheight)
                  .tickFormat("")
                  .tickPadding(10)
              );


        axisFlag++;
      }) // End rangesub.each
  }) //End of rangeG.each

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