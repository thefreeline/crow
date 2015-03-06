$(document).ready(function(){
  // Scroll text with overflow
$(document).on('mouseover','.scroll_on_hover',function() {
    $(this).removeClass("ellipsis");
    var maxscroll = $(this).width();
    var speed = maxscroll * 50;
    $(this).animate({
        scrollLeft: maxscroll + 80
    }, speed, "linear");
});

$(document).on('mouseout','.scroll_on_hover',function() {
    $(this).stop();
    $(this).addClass("ellipsis");
    $(this).animate({
        scrollLeft: 0
    }, 'slow');
});

})
/************
*************
OPTION CONTROLLERS
*************
************/
// Highest Concern Controls
$(document).on('click', '#li-hc-2012-ar', function () {
  // console.log("Inside Click Highest Concern")
    // $("#dropdown-super-agg").text($(this).text());
    // var concatAgg = $(this).text();
    d3.selectAll('svg').remove();
    d3.selectAll('.d3-tip').remove();
    $(".spinner").addClass("in").removeClass("hidden");
    //$("#chart-container-hc-2012-sm").addClass("in").removeClass("hidden");
    //$("#container-hc-2012-sm .controls").addClass("in").removeClass("hidden");
    updateHighestConcern(resultCat,concatAgg);
});

$(document).on('click', '#dropdown-ul-agg li a', function () {
    $("#dropdown-agg").text($(this).text());
    $("#hc-ar-agg").text($(this).text());
    var concatAgg = $(this).text();
    d3.selectAll('svg').remove();
    d3.selectAll('.d3-tip').remove();
    updateHighestConcern(resultCat,concatAgg);
});

// Size Map Controls
$(document).on('click', '#li-hc-2012-sm', function () {
  // console.log("Inside Click Size Map")
    // $("#dropdown-super-agg").text($(this).text());
    // var concatAgg = $(this).text();
    d3.selectAll('svg').remove();
    d3.selectAll('.d3-tip').remove();
    updateSizeMap(sizemapResultCat,agg);
});

$(document).on('click', '#dropdown-ul-agg li a', function () {
    $("#dropdown-agg").text($(this).text());
    $("#hc-sm-agg").text($(this).text());
    var agg = $(this).text();
    d3.selectAll('svg').remove();
    d3.selectAll('.d3-tip').remove();
    updateSizeMap(sizemapResultCat,agg);
});

/************
*************
PRESENTATION CONTROLLERS
*************
************/

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



// USe jquery lettering to fix header kerning
/*$(document).ready(function() {
  $("#title-nw").lettering();
});*/

//Define default chart filters (updateHighestConcern)
var resultCat = "Poor",
    concatAgg = "National--National"

//Define initial chart filters (size map)
var sizemapResultCat = "Poor",
    agg = "WSA9_Ecoregions"

/************
*************
DIMENSION CONTROLLERS
*************
************/

    //BULLET DIMENISIONS
  var bulletmargin = {top: 0, right: 40, bottom: 0, left: 200},
    bulletcontainer = 500,
    bulletwidth = 500 - bulletmargin.left - bulletmargin.right,
    bulletheight = 50 - bulletmargin.top - bulletmargin.bottom,
    //SLOPE DIMENISIONS
    slopemargin = {top: 10, right: 10, bottom: 10, left: 15},
    slopecontainer = 90,    
    slopewidth = 90 - slopemargin.left - slopemargin.right,
    slopeheight = 50 - slopemargin.top - slopemargin.bottom,
    //RANGE DIMENISIONS
    rangemargin = {top: 0, right: 15, bottom: 0, left: 15},
    rangecontainer = 175,
    rangewidth = 175 - rangemargin.left - rangemargin.right,
    rangeheight = 50 - rangemargin.top - rangemargin.bottom,
    //SIZE MAP DIMENSIONS
    sizemapmargin = {top: 0, right: 0, bottom: 0, left: 0},
    sizemapcontainer = 765,
    sizemapwidth = 765 - sizemapmargin.left - sizemapmargin.right,
    sizemapheight = 30 - sizemapmargin.top - sizemapmargin.bottom;


var bulletchart = d3.bullet()
    .width(bulletwidth)
    .height(bulletheight);


/************
*************
HIGHEST CONCERN (ANY REGION) CONTROLLERS
*************
************/
function updateHighestConcern(filterResult, filterConcatAgg) {  

  d3.csv("data/2007_2012_Condition_Data.csv", function(error, data) {  

    var duration = 250;
   
    // Create empty array to store concatenated agg values
    // console.log("filteragg",filterConcatAgg)

    var supagg = filterConcatAgg.substring(0,filterConcatAgg.indexOf("--"));
    var agg = filterConcatAgg.substring(filterConcatAgg.indexOf("--")+2);
    // console.log("agg",agg);
    // console.log("supagg",supAgg);
    var concatAgg = [];
    // For each d, concatenate super agg and aggregation level
    data.forEach(function(d){
      var newAgg = d["Super-Aggregation"] + "--" + d["Aggregation Level"];
      concatAgg.push(newAgg);
    })
    // Filter out unique values
    concatAgg = $.unique(concatAgg);

    // console.log("concat",concatAgg);
    //Create array of unique values
    //var resultCat = d3.set(data.map(function(d) { return d["Result Category"];   })).values();  
    //var superAgg =  d3.set(data.map(function(d) { return d["Super-Aggregation"]; })).values();
    //var aggLevel =  d3.set(data.map(function(d) { return d["Aggregation Level"]; })).values();

    d3.select("#dropdown-ul-agg").selectAll("li")
        .data(concatAgg)
      .enter().append("li")
        .attr("role","presentation")
      .insert("a")
        .attr("role","menuitem")
        .attr("tabindex","-1")
        .attr("href","#")
        .html(function(d){ return d; });

    data = data.filter(function(d){ 
      // console.log("Result Cat: ",filterResult);
      // console.log("Super Agg: ",supagg);
      // console.log("Agg Level: ",agg)
      return ( d["Result Category"] == filterResult && supagg == d["Super-Aggregation"] && agg == d["Aggregation Level"] ); 
    });

      // console.log(data);

  
    var bulletsvg = d3.select("#d3-bullet").selectAll("svg")
        .data(data)
      .enter().append("svg")
        .attr("class", "bullet")
        .attr("width", bulletwidth + bulletmargin.left + bulletmargin.right)
        .attr("height", bulletheight + bulletmargin.top + bulletmargin.bottom)

    var bulletborder = bulletsvg.append("rect")
        .attr("class", "border")
        .attr("width",bulletcontainer)
        .attr("height", bulletheight + bulletmargin.top + bulletmargin.bottom)

    var bulletg = bulletsvg.append("g")
        .attr("transform", "translate(" + bulletmargin.left + "," + bulletmargin.top + ")")
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


    /*************
    **************
    Start Slope Graphs
    **************
    *************/
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
        .attr("transform", "translate(" + (rangemargin.left + rangemargin.right) + ",0)")
        .call(range);

    /*************
    **************
    SPINNER HELPER
    **************
    *************/
    $(".spinner").removeClass("in").addClass("hidden");
    // $("#info-container-hc-2012-ar").addClass("in").removeClass("hidden");
    $("#chart-header").addClass("in").removeClass("hidden");
     $("#chart-container-hc-2012-ar").addClass("in").removeClass("hidden");
    
  });
}

/************
*************
HIGHEST CONCERN (ANY REGION) CONTROLLERS
*************
************/

function updateSizeMap(filterResult, filterAgg) {  

  d3.selectAll('.sizemap-hr-title').remove();

  agg = filterAgg;
  resultCat = filterResult;

  d3.csv("data/2007_2012_Condition_Data.csv", function(error, data) {  

    // Define Super Aggregation Levels prior to filtering data - Used to populated Controls
    var supAggLevel =  d3.set(data.map(function(d) { return d["Super-Aggregation"]; })).values();
    /*************
    **************
    DATA FILTER
    **************
    *************/
    data = data.filter(function(d){ 
      return ( d["Result Category"] == resultCat && agg == d["Super-Aggregation"] ); 
    });

    var aggLevel =  d3.set(data.map(function(d) { return d["Aggregation Level"]; })).values();
    var metric = d3.set(data.map(function(d) { return d["Metric"]; })).values();

    // console.log(metric);

    // Populate Filters 
    d3.select("#dropdown-ul-agg").selectAll("li")
        .data(supAggLevel)
      .enter().append("li")
        .attr("role","presentation")
      .insert("a")
        .attr("role","menuitem")
        .attr("tabindex","-1")
        .attr("href","#")
        .html(function(d){ return d; });


    /*************
    **************
    START SIZE MAPS 
    **************
    *************/

    metric.forEach(function(d,i){
      metric = d;
      console.log(i)
      filterdata = data.filter(function(d,i){ return d["Metric"] == metric; })
       //console.log(filterdata);

        var sizemapHeader = d3.select("#d3-sizemap-hr").selectAll("div")
            .data(filterdata)
          .enter().append("div")
            .attr("class", "sizemap-hr-title ellipsis scroll_on_hover")
            // .html(function(d){ 
              // console.log(d["Aggregation Level"]); 
            // });
            .html(function(d){ console.log(d["Aggregation Level"]); return d["Aggregation Level"]; });

        var sizemapsvg = d3.select("#d3-sizemap")
            .append("svg")
            .attr("class", "sizemap")
            .attr("width", sizemapcontainer)
            .attr("height", sizemapheight + sizemapmargin.top + sizemapmargin.bottom)

        var sizemapborder = sizemapsvg.append("rect")
            .attr("class", "border")
            .attr("width",sizemapcontainer)
            .attr("height", sizemapheight + sizemapmargin.top + sizemapmargin.bottom)

        
        var sizemapg = sizemapsvg.selectAll(".sizemap-row")
              .data(filterdata)
            .enter().append("g")
              .attr("transform", function(d,i) { return "translate(" + ( 200 + ((sizemapheight+10) * i)) + ",0)"; })
              .attr("class","sizemap-row")
              .call(sizemap);

        var sizemaptitle = sizemapsvg.selectAll("g .sizemap-title")
                .data(filterdata)
              .enter().append("g")
                .style("text-anchor", "end")
                .attr("transform", "translate(190," + sizemapheight / 2 + ")")
                .attr("class","sizemap-title")

            sizemaptitle.append("text")
                .attr("class", "title")
                .text(function(d,i) { if (i==0){ return d["Metric"]; } } );

            sizemaptitle.append("text")
                .attr("class", "subtitle")
                .attr("dy", "1em")
                .text()
                .exit;
    })
  })
    /*************
    **************
    SPINNER HELPER
    **************
    *************/
    $(".spinner").removeClass("in").addClass("hidden");
    $("#chart-header").addClass("in").removeClass("hidden");
    // $("#container-hc-2012-sm .controls").addClass("in").removeClass("hidden");
};


updateHighestConcern(resultCat,concatAgg);
//updateSizeMap(sizemapResultCat,agg);
