function sizemap(d) {

//console.log("d",d)

  var duration = 500,
  tickFormat = d3.format(".0%"),
  radius = 3,
  sizemapG = d3.selectAll("#d3-sizemap g.sizemap-row");

  sizemapG.each(function(d, i) {  
  	var g = d3.select(this);

  	/************
	*************
	DEFINE TOOLTIP
	*************
	************/

  	var tip = d3.tip(d)
	      .attr('class', 'd3-tip')
	      .html(function(d) { 
	      	var d = this.data();
	        return '<div id="tooltip-table"><table>' +
	        //'<tr><td>Metric Category: </td><td> ' + d[0]["Metric"] + '</td>' +
	        '<tr><td>Indicator: </td><td> ' + d[0]["Metric"] + '</td>' +
	        '<tr><td>Subpopulation: </td><td> ' + d[0]["Aggregation Level"] + '</td>' +
	        '<tr><td>2012 Value: </td><td> ' + d[0]["Proportion 2012"] + '</td>' +
	        '<tr><td>Significant at 95%: </td><td> ' + d[0]["Significant"] + '</td>' +
	        '</div></table>' })
	      .offset([0, 0]);

    var sizemapsvg = d3.select("#d3-sizemap").selectAll("svg");
    sizemapsvg.call(tip);
  	
  	/************
	*************
	DEFINE CHART MULTIPLES
	*************
	************/

  	// Compute the new slope y-scale.
    var x = d3.scale.linear()
        .domain([0,1])
        .range([0,25]);

  	var size = g.selectAll("rect")
			.data([d]);

	var sizeRect = size.enter()
		.append("rect")
		  .attr("x",function(d){ return ( (sizemapheight + sizemapmargin.top + sizemapmargin.bottom) / 2 ) ; })
		  .attr("y",function(d){ return ( (sizemapheight + sizemapmargin.top + sizemapmargin.bottom) / 2 ) ; })
		  .attr("height",0)
		  .attr("width",0)
		  .attr("class","estimate")
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
        	.attr("x",function(d){ return ( ((sizemapheight + sizemapmargin.top + sizemapmargin.bottom) - x(d["Proportion 2012"]) ) / 2 ) ; })
			.attr("y",function(d){ return ( ((sizemapheight + sizemapmargin.top + sizemapmargin.bottom) - x(d["Proportion 2012"]) ) / 2 ) ; })
        	.attr("height",function(d){ return x(d["Proportion 2012"]); } )
		  	.attr("width",function(d){ return x(d["Proportion 2012"]); } );

  })
}