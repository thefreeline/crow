$(document).ready(function(){

  $(document).on('click', '#dropdown-ul-result-cat li a', function () {
      $("#dropdown-result-cat").text($(this).text());
      var resultCat = $(this).text();
      d3.selectAll('svg').remove();
      d3.selectAll('.d3-tip').remove();
//console.log(resultCat,superAgg,aggLevel);
      //update(resultCat,superAgg,aggLevel);
      update(resultCat,superAgg);
      //console.log(filter);
  });

  $(document).on('click', '#dropdown-ul-super-agg li a', function () {
      $("#dropdown-super-agg").text($(this).text());
      var superAgg = $(this).text();
      d3.selectAll('svg').remove();
      d3.selectAll('.d3-tip').remove();
//console.log(resultCat,superAgg,aggLevel);
      // update(resultCat,superAgg,aggLevel);
      update(resultCat,superAgg);
      //console.log(filter);
  });

  $(document).on('click', '#dropdown-ul-agg-level li a', function () {
      $("#dropdown-agg-level").text($(this).text());
      var aggLevel = $(this).text();
      d3.selectAll('svg').remove();
      d3.selectAll('.d3-tip').remove();
//console.log(resultCat,superAgg,aggLevel);      
      // update(resultCat,superAgg,aggLevel);
      update(resultCat,superAgg);
      //console.log(filter);
  });

});

//Toggle bullet label visibility
$("#button-toggle-labels").on("click", function(el){
  var toggleBut = $("#button-toggle-labels"),
      labels = $(".label-ul-bounds text");
  
  if(!toggleBut.hasClass("toggle-on")){
    toggleBut.addClass("toggle-on")
    $(labels).attr("class","active");
  } else if(toggleBut.hasClass("toggle-on")) {
    toggleBut.removeClass("toggle-on")
    $(labels).attr("class","inactive");
  }
})

// Scroll text with overflow
$(".scroll_on_hover").mouseover(function() {
    $(this).removeClass("ellipsis");
    var maxscroll = $(this).width();
    var speed = maxscroll * 15;
    $(this).animate({
        scrollLeft: maxscroll
    }, speed, "linear");
});

$(".scroll_on_hover").mouseout(function() {
    $(this).stop();
    $(this).addClass("ellipsis");
    $(this).animate({
        scrollLeft: 0
    }, 'slow');
});

// USe jquery lettering to fix header kerning
/*$(document).ready(function() {
  $("#title-nw").lettering();
});*/

//Define initial chart filters
var resultCat = "Poor",
    superAgg = "National";
    //aggLevel = "National";

    //BULLET DIMENISIONS
var bulletmargin = {top: 5, right: 40, bottom: 5, left: 200},
    bulletcontainer = 500,
    bulletwidth = 500 - bulletmargin.left - bulletmargin.right,
    bulletheight = 50 - bulletmargin.top - bulletmargin.bottom,
    //SLOPE DIMENISIONS
    slopemargin = {top: 10, right: 10, bottom: 10, left: 15},
    slopecontainer = 90,    
    slopewidth = 90 - slopemargin.left - slopemargin.right,
    slopeheight = 50 - slopemargin.top - slopemargin.bottom,
    //RANGE DIMENISIONS
    rangemargin = {top: 5, right: 15, bottom: 5, left: 15},
    rangecontainer = 175,
    rangewidth = 175 - rangemargin.left - rangemargin.right;
    rangeheight = 50 - rangemargin.top - rangemargin.bottom;


var bulletchart = d3.bullet()
    .width(bulletwidth)
    .height(bulletheight);

/*var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) { 
        return '<div id="tooltip-table"><table>' +
        '<tr><td>Super-Aggregation: </td><td>' + d["Super-Aggregation"] + '</td>' +
        '<tr><td>Aggregation Level: </td><td>' + d["Aggregation Level"] + '</td>' +
        '<tr><td>Proportion: </td><td>' + d["Proportion 2007"] + '</td>' +
        '<tr><td>Lower Bound: </td><td>' + d["Lower Bound 2007"] + '</td>' +
        '<tr><td>Upper Bound: </td><td>' + d["Upper Bound 2007"] + '</td>' +
        '</div></table>' })
      .offset([0, 0]);*/

/*var slopetip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) { 
        return '<div id="tooltip-table"><table>' +
        '<tr><td>Metric: </td><td>' + d["Super-Aggregation"] + '</td>' +
        '<tr><td>Indicator: </td><td>' + d["Aggregation Level"] + '</td>' +
        '<tr><td>2007 Value: </td><td>' + d["Proportion 2007"] + '</td>' +
        '<tr><td>2012 Value: </td><td>' + d["Proportion 2012"] + '</td>' +
        '<tr><td>Significant at 95%: </td><td>' + d["Significant"] + '</td>' +
        '</div></table>' })
      .offset([0, 0]);*/


//function update(filterResult, filterSupAgg, filterAggLevel) {
function update(filterResult, filterSupAgg) {  

  d3.csv("data/2007_2012_Condition_Data.csv", function(error, data) {  

//console.log(filterResult, filterSupAgg, filterAggLevel);

    //Create array of unique values
    //var resultCat = d3.set(data.map(function(d) { return d["Result Category"];   })).values();  
    var superAgg =  d3.set(data.map(function(d) { return d["Super-Aggregation"]; })).values();
    //var aggLevel =  d3.set(data.map(function(d) { return d["Aggregation Level"]; })).values();

    var duration = 250;
  //console.log(resultCat);

    /*d3.select("#dropdown-ul-result-cat").selectAll("li")
        .data(resultCat)
      .enter().append("li")
        .attr("role","presentation")
      .insert("a")
        .attr("role","menuitem")
        .attr("tabindex","-1")
        .attr("href","#")
        .html(function(d){ return d; });*/

    d3.select("#dropdown-ul-super-agg").selectAll("li")
        .data(superAgg)
      .enter().append("li")
        .attr("role","presentation")
      .insert("a")
        .attr("role","menuitem")
        .attr("tabindex","-1")
        .attr("href","#")
        .html(function(d){ return d; });

    /*d3.select("#dropdown-ul-agg-level").selectAll("li")
        .data(aggLevel)
      .enter().append("li")
        .attr("role","presentation")
      .insert("a")
        .attr("role","menuitem")
        .attr("tabindex","-1")
        .attr("href","#")
        .html(function(d){ return d; });*/

    data = data.filter( function(d){ return d["Result Category"] == filterResult && filterSupAgg == d["Super-Aggregation"]; });

// console.log(data);

  
    var bulletsvg = d3.select("#d3-bullet").selectAll("svg")
        .data(data)
      .enter().append("svg")
        .attr("class", "bullet")
        .attr("width", bulletwidth + bulletmargin.left + bulletmargin.right)
        .attr("height", bulletheight/* + bulletmargin.top + bulletmargin.bottom*/)

    var bulletborder = bulletsvg.append("rect")
        .attr("class", "border")
        .attr("width",bulletcontainer)
        .attr("height", bulletheight/* + bulletmargin.top + bulletmargin.bottom*/)

    var bulletg = bulletsvg.append("g")
        .attr("transform", function(d,i) {
          console.log(i)
          if (i==0) {
            return "translate(" + bulletmargin.left + "," + bulletmargin.top + ")";
          } else {
            return "translate(" + bulletmargin.left + "," + 0/*bulletmargin.top*/ + ")";
          }
        })
        .call(bulletchart);

    var bullettitle = bulletg.append("g")
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + bulletheight / 2 + ")")

    bullettitle.append("text")
        .attr("class", "title")
        .text(function(d) { return d.Metric; });

    bullettitle.append("text")
        .attr("class", "subtitle")
        .attr("dy", "1em")
        .text();


    /*************/
    /** 
    /** Start Slope Graphs
    /** 
    /*************/
    var slopesvg = d3.select("#d3-slope").selectAll("svg")
        .data(data)
      .enter().append("svg")
        .attr("class", "slope")
        .attr("width", slopecontainer)
        .attr("height", slopeheight + slopemargin.top + slopemargin.bottom)

    var slopeborder = slopesvg.append("rect")
        .attr("class", "border")
        .attr("width",slopecontainer)
        .attr("height", slopeheight + slopemargin.top + slopemargin.bottom)
      
    var slopeG = slopesvg.append("g")
      .attr("transform", "translate(" + slopemargin.left + "," + slopemargin.top + ")")
      .call(slope);

    
    
    /*************/
    /** 
    /** Start CI Range Graphs
    /** 
    /*************/
    var rangesvg = d3.select("#d3-range").selectAll("svg")
        .data(data)
      .enter().append("svg")
        .attr("class", "range")
        .attr("width", rangecontainer)
        .attr("height", rangeheight + rangemargin.top + rangemargin.bottom)
      
    var rangeborder = rangesvg.append("rect",":last-child")
        .attr("class", "border")
        .attr("width",rangecontainer)
        .attr("height", rangeheight + rangemargin.top + rangemargin.bottom)
      
    var rangeG = rangesvg.append("g")
        .attr("transform", "translate(" + rangemargin.left + "," + rangemargin.top + ")")
        .call(range);
  });
}




//update(resultCat,superAgg,aggLevel);
update(resultCat,superAgg);
