function slope(d) {

	var duration = 500,
	tickFormat = d3.format(".0%"),
    radius = 3,
	slopeG = d3.selectAll("#d3-slope g");


    slopeG.each(function(d, i) {   
		var startSlope = [+d["Proportion 2007"]],
		  	endSlope = [+d["Proportion 2012"]],
		  	g = d3.select(this);

		var tip = d3.tip(d)
	      .attr('class', 'd3-tip')
	      .html(function(d) { 
	      	var d = this.data();
	        return '<div id="tooltip-table"><table>' +
	        //'<tr><td>Metric Category: </td><td> ' + d[0]["Metric"] + '</td>' +
	        '<tr><td>Indicator: </td><td> ' + d[0]["Metric"] + '</td>' +
	        '<tr><td>2007 Value: </td><td> ' + d[0]["Proportion 2007"] + '</td>' +
	        '<tr><td>2012 Value: </td><td> ' + d[0]["Proportion 2012"] + '</td>' +
	        '<tr><td>Significant at 95%: </td><td> ' + d[0]["Significant"] + '</td>' +
	        '</div></table>' })
	      .offset([0, 0]);

	    var slopesvg = d3.select("#d3-slope").selectAll("svg");
	    slopesvg.call(tip);

    	// function for the y grid lines
		function make_y_axis() {
		  return d3.svg.axis()
		      .scale(yScale)
		      .orient("left")
		      .ticks(3)
		}

		// Compute the new slope y-scale.
		var yScale = d3.scale.linear()
		  .domain([1,0])
		  .range([0,slopeheight]);

		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")
			.ticks(3)
			.tickSize(0)
			.tickFormat(tickFormat);
   
   		// Draw lines
		var lines = g.selectAll("line")
			.data([d]);

		var slope = lines.enter()
			.append("line")
			  .attr("x1", radius + slopemargin.left)
			  .attr("x2", radius + slopemargin.left)
			  .attr("y1", yScale(startSlope))
			  .attr("y2", yScale(startSlope))
			.on('mouseover', function(d) {
	          d3.select(this)
	            .classed('opacity-hover',true)
	            .classed('stroke-hover',true)
	            .call(tip.show)
	        })
			.on('mouseout', function(d) {
	          d3.select(this)
	            .classed('opacity-hover',false)
	            .classed('stroke-hover',false)
	            .call(tip.hide)
	        })
			.transition()
			  .duration(duration)
			  .attr("x2", slopewidth-slopemargin.right)
			  .attr("y2", yScale(endSlope))
			  .attr("class","measure");

		// Draw nodes
		var nodes = g.selectAll("circle")
        	.data([d])

		var startNode = nodes.enter()
			.append("circle")
			  .attr("r",radius)
			  .attr("cx", radius + slopemargin.left)
			  .attr("cy",yScale(startSlope))
			  .attr("class","measure-start")
			.on('mouseover', function(d) {
	          d3.select(this)
	            .classed('opacity-hover',true)
	            .classed('stroke-hover',true)
	            .call(tip.show)
	        })
			.on('mouseout', function(d) {
	          d3.select(this)
	            .classed('opacity-hover',false)
	            .classed('stroke-hover',false)
	            .call(tip.hide)
	        });

		var endNode = nodes.enter()
			.append("circle")
			  .attr("r",radius)
			  .attr("cx",radius + slopemargin.left)
			  .attr("cy",yScale(startSlope))
			.on('mouseover', function(d) {
	          d3.select(this)
	            .classed('opacity-hover',true)
	            .classed('stroke-hover',true)
	            .call(tip.show)
	        })
			.on('mouseout', function(d) {
	          d3.select(this)
	            .classed('opacity-hover',false)
	            .classed('stroke-hover',false)
	            .call(tip.hide)
	        })
			.transition()
			  .duration(duration)
			  .attr("cx",slopewidth-slopemargin.right)
			  .attr("cy",yScale(endSlope))
			  .attr("class","measure-end");

		//Append y-axis
		var yAxisAppend = g.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + (slopemargin.left  - 5) + ",0)")
			.call(yAxis);

		//Draw the y grid lines
	    g.append("g")            
	        .attr("class", "grid")
	        .attr("transform", "translate(" + (slopemargin.left  - 5) + ",0)")
	        .call(make_y_axis()
	            .tickSize(-slopewidth + slopemargin.left - radius)
	            .tickFormat("")
	            .tickPadding(150)
	        );
    }) //End of slopeG.each

};

function slopetranslate(x) {
  return function(d) {
    console.log(x(d));
    return "translate(" + "10," + x(d) + ")";
  };
}

function tickFormat(x) {
	if (!arguments.length) return tickFormat;
	tickFormat = x;
	return tickFormat;
};