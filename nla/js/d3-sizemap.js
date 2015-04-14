function sizemap(d) {

// console.log("Size Data before sG each:",d)

  var duration = 500,
  tickFormat = d3.format(".0%"),
  radius = 3,
  sizemapG = d3.selectAll("#d3-sizemap g.sizemap-row"),
  rowCount = 0;

  sizemapG.each(function(d, i) {  
 
  	var g = d3.select(this);
// console.log("g:",g);
// console.log("g data:",d);

    var sizemapsub = g.selectAll("g .sizemap-sub")
        .data(d.values)
      .enter().append("g")
        .attr("class","sizemap-sub")
        
    sizemapsub.attr("data-loc",function(){  
          i = rowCount; 
          rowCount++; 
          return "chart-loc-" + i; 
        })
        .attr("height", function(d){ return sizemapheight + sizemapmargin.top + sizemapmargin.bottom; })
        .attr("transform", function(d,i) { return "translate(40," + ((sizemapheight + sizemapmargin.top + sizemapmargin.bottom)*i) + ")"; })          

    sizemapsub.each(function(d, j) {

      var sizemapsvg = d3.select(this.parentNode.parentNode);
      
      var sizemapborder = sizemapsvg.insert("rect",":first-child")
            .attr("class", "border")
            .attr("width",sizemapcontainer)
            .attr("height", sizemapheight + sizemapmargin.top + sizemapmargin.bottom)
            .attr("transform",function(d){ return "translate(0," + ( (sizemapheight + sizemapmargin.top + sizemapmargin.bottom) * j )  + ")"; });

      var subg = d3.select(this);
      // console.log("subg",subg);
      // console.log("subg d",d);

      // Append indicator titles
      var sizemaptitle = subg.append("g")
            .style("text-anchor", "start")
            .attr("transform", "translate(-150," + sizemapheight / 1.5 + ")")

        sizemaptitle.append("text")
            .attr("class", "title indicator")
            .text(function(d,i) { return d["key"].replace(/_/g," "); });

    	// Define the tootip
    	var tip = d3.tip(d)
  	      .attr('class', 'd3-tip')
  	      .html(function(d) { 
  	      	var d = this.data();
            // console.log(d);
  	        return '<div id="tooltip-table"><table>' +
  	        //'<tr><td>Metric Category: </td><td> ' + d[0]["Metric"] + '</td>' +
  	        '<tr><td>Indicator: </td><td> '      + d[0][nla12_ce_indic]   + '</td>' +
  	        '<tr><td>Subpopulation: </td><td> '  + d[0][nla12_ce_subpop]  + '</td>' +
  	        '<tr><td>2012 Value: </td><td> '     + d[0][nla12_ce_estp]    + '</td>' +
  	        /*'<tr><td>Significant at 95%: </td><td> ' + d[0]["Significant"] + '</td>' +*/
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
          .domain([0,100])
          .range([3,sizemapheight]);

    	var size = subg.selectAll("rect")
  			.data(d.values);

    	var sizeRect = size.enter()
    		.append("rect")

      sizeRect
    		  .attr("x",function(d,i){ return ( ( ( (sizemapheight + sizemapmargin.top + sizemapmargin.bottom) - x(d[nla12_ce_estp] ) ) / 2 ) + (( sizemapheight + 10) *i) ) ; })
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
    			.attr("y",function(d){ return ( ((sizemapheight + sizemapmargin.top + sizemapmargin.bottom) - x(d[nla12_ce_estp]) ) / 2 ) ; })
            	.attr("height",function(d){ return x(d[nla12_ce_estp]); } )
    		      .attr("width",function(d){ /*console.log(d[nla12_ce_estp]);*/ return x(d[nla12_ce_estp]); } )
              
              // gsub.append("g").attr("transform","translate(350,20)").style("text-anchor","middle").append("text").text(function(d,i){ if(i==0){return d[nla12_ce_indic]};});
})
  })
}