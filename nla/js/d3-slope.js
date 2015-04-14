function slope(d) {

	var duration = 500,
	tickFormat = d3.format(".0%"),
    radius = 3,
	slopeG = d3.selectAll("#d3-slope g"),
	rowCount = 0,
	axisFlag = 0;

    slopeG.each(function(d,i) { 
// console.log("slopedata",d)

    	var g = d3.select(this);

    	var slopesub = g.selectAll("g .slope-sub")
	          	.data(d.values)
	        .enter()
		          .append("g")
		          .attr("class","slope-sub")
		          .attr("data-loc",function(){  
		            i = rowCount; 
		            rowCount++; 
		            return "chart-loc-" + i; 
		          })
		          .attr("height", function(d){ return slopeheight + slopemargin.top + slopemargin.bottom; })
		          .attr("transform", function(d,i) { return "translate(0," + ((slopeheight + slopemargin.top + slopemargin.bottom)*i) + ")"; })          

		slopesub.each(function(d,j) {

			var slopesvg = d3.select(this.parentNode.parentNode);

	        var slopeborder = slopesvg.insert("rect",":first-child")
	                .attr("class", "border")
	                // .attr("data-loc",j)
	                .attr("width",slopecontainer)
	                .attr("height", slopeheight + slopemargin.top + slopemargin.bottom)
	                .attr("transform",function(d){ return "translate(0," + ( (slopeheight + slopemargin.top + slopemargin.bottom) * j )  + ")"; })
			
        	var gsub = d3.select(this);
        	data = gsub.data();

			var startSlope 	= +d[nla0712_ce_estp1],
			  	endSlope 	= +d[nla0712_ce_estp2],
			  	barend      = (+d[nla0712_ce_ucb95pctp2] - +d[nla0712_ce_ucb95pctp1]),
			  	barstart    = (+d[nla0712_ce_lcb95pctp2] - +d[nla0712_ce_lcb95pctp1]),
			  	barwidth    = Math.abs(barstart - barend);

			  	// console.log("startSlope",startSlope);
			  	// console.log("endSlope",endSlope);

			var tip = d3.tip()
		            .attr('class', 'd3-tip')
		            .html(function(d) { 
			              var d = this.data();

			              return '<div id="tooltip-table"><table>' 	+
			              '<tr><td>Metric Category: </td><td>'		+ d[0][nla12_ce_metcat] + '</td>' +
			              '<tr><td>Indicator: </td><td>'      		+ d[0][nla12_ce_indic] + '</td>' +
			              '<tr><td>2007 Estimate.P_1: </td><td>'    + d3.round(d[0][nla0712_ce_estp1],2) + '</td>' +
			              '<tr><td>2007 Estimate.P_2: </td><td>'    + d3.round(d[0][nla0712_ce_estp2],2) + '</td>' +
			              '<tr><td>Significant at 95%: </td><td>'   + "" + '</td>' +
			              '</div></table>' 
			        })
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
			  .domain([100,0])
			  .range([0,slopeheight]);

			var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")
				.ticks(3)
				.tickSize(0)
				.tickFormat(tickFormat);
	   
	   		// Draw lines
			var lines = gsub.selectAll("line")
				.data([d]);

		if (barwidth !== 0) {
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
				  	// .attr("class","measure")
				  	.attr("class",function(d){ 
		                if ( Math.min(barstart,barwidth) < 0 && Math.max(barstart,barwidth) > 0 ) {
		                  return "measure significant-No"; 
		                } else {
		                  return "measure significant-Yes"; 
		                }
		             });

			// Draw nodes
			/*var nodes = gsub.selectAll("circle")
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
				  .attr("class","measure-end");*/
		}

			// If axisFlag == 0, add the axis to the axis container
        if(axisFlag==0) {

          var xAxis = d3.svg.axis()
              .scale(yScale)
              .orient("top")
              .tickSize(0)
              .ticks(0)
              .tickFormat(tickFormat);

          //Add the x-axis
          var xAxissvg = d3.select("#d3-slope-axis")
              .append("svg")
              .attr("class","axis-container")              
              .attr("width", slopewidth + slopemargin.left + slopemargin.right )

          var xAxisAppend = xAxissvg.append("g")
              .attr("transform", "translate(" + slopemargin.left + ",20)")
              .call(xAxis);

        }
			//Append y-axis
			/*if(i==0) {
				var yAxisAppend = gsub.append("g")
					.attr("class", "axis")
					.attr("transform", "translate(" + (slopemargin.left  - 5) + ",0)")
					.call(yAxis);
			}*/

			//Draw the y grid lines
		    gsub.append("g")            
		        .attr("class", "grid")
		        .attr("transform", "translate(" + (slopemargin.left  - 5) + ",0)")
		        .call(make_y_axis()
		            .tickSize(-slopewidth + slopemargin.left - radius)
		            .tickFormat("")
		            .tickPadding(150)
		        );
		// console.log(axisFlag);
		axisFlag++;
		}); // end of subslope.each
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