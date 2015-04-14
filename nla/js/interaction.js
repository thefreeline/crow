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
$(document).on('click', '#view-trend', function () {
    d3.selectAll('svg').remove();
    d3.selectAll('.d3-tip').remove();
    $(".spinner").addClass("in").removeClass("hidden");
    updateHighestConcern(conditionCat,"National--National");
});

$(document).on('click', '#view-size', function () {
    d3.selectAll('svg').remove();
    d3.selectAll('.d3-tip').remove();
    $(".spinner").addClass("in").removeClass("hidden");
    updateSizeMap(sizemap_filter_category,sizemap_filter_subpop, sizemap_filter_indic);
});

$(document).on('click', '#dropdown-ul-agg li a', function () {
    
    var concatAgg = $(this).text();

    $("#dropdown-agg").text($(this).text());
    $("#hc-ar-agg").text($(this).text());
    var concatAgg = $(this).text();
    d3.selectAll('svg').remove();
    d3.selectAll('.d3-tip').remove();
    updateHighestConcern(conditionCat,concatAgg);
});

// SIZE MAP TYPE FILTER
$(document).on('click', '#dropdown-ul-type-sizemap li a', function () {

    var sizemap_filter_subpop = $(this).text(),
        sizemap_filter_category = "Highest Concern",
        sizemap_filter_indic = $("#dropdown-indic-sizemap").text().trim();

    $("#dropdown-type-sizemap").text($(this).text());
    $("#hc-ar-agg").text($(this).text());

    // d3.selectAll('svg').remove();
    d3.selectAll('.d3-tip').remove();
    
    updateSizeMap(sizemap_filter_category,sizemap_filter_subpop, "(All)");

});


// SIZE MAP INDICATOR FILTER
/*$(document).on('click', '#dropdown-ul-indic-sizemap li a', function () {

    var sizemap_filter_subpop = $("#dropdown-type-sizemap").text().trim();
        sizemap_filter_category = "Highest Concern",
        sizemap_filter_indic = $(this).text(),

    $("#dropdown-indic-sizemap").text($(this).text());
    $("#hc-ar-agg").text($(this).text());

    d3.selectAll('svg').remove();
    d3.selectAll('.d3-tip').remove();
    
    updateSizeMap(sizemap_filter_category,sizemap_filter_subpop, sizemap_filter_indic);

});
*/







/************
*************
HIGHLIGHTING
*************
************/
$(document).on("click",".bullet-sub", function(){
    var el = $(this),
    thisClass = el.attr("class"),
    thisClasses = thisClass.split(" "),
    thisLoc = el.data("loc"),
    bulletClass = $(".bullet-sub"), 
    slopeClass = $(".slope-sub"),
    rangeClass = $(".range-sub"),
    switchCount = 0;

    bulletClass.attr("class",function(index, classNames) {
        var classes = classNames.split(" ");
        // console.log(classes);

        // If no dim and no highlight, highlight this, dim all others 
        if ( (classes.indexOf("dim") < 0) && ( classes.indexOf("highlight") < 0 ) ) {  
            el.attr("class",'bullet-sub highlight');
            return classNames + ' dim';
        } 
        else if ( thisClasses.indexOf("highlight") > -1 ) {
            el.attr("class",'bullet-sub dim');
        } 
        else {
            el.attr("class",'bullet-sub highlight');
        }

        if ( classes.indexOf("highlight") > -1 ) {
            switchCount ++;
        }

        /*if ( switchCount == 0 ) {
                return "bullet-sub";
            }*/
    });

    slopeClass.attr("class",function(index, classNames) {
        var slopeClasses = classNames.split(" "),
            thisClasses = thisClass.split(" "),
            slopeLoc = $(this).data("loc");

            // console.log("Slope Classes",slopeClasses);

        if ( ( thisClasses.indexOf("dim") < 0 ) && ( thisClasses.indexOf("highlight") < 0 ) ) { 
            $(this).attr("class",'slope-sub dim'); 
            if ( thisLoc == slopeLoc ) {  
                $(this).attr("class",'slope-sub highlight');   
            } 
        }
        else if ( thisClasses.indexOf("highlight") > -1 ) {
            if ( thisLoc == slopeLoc ) {  
                $(this).attr("class",'slope-sub dim');
            } 
        } 
        else {
            if ( thisLoc == slopeLoc ) {  
                $(this).attr("class",'slope-sub highlight');
            } 
        }
    })

    rangeClass.attr("class",function(index, classNames) {
        var rangeClasses = classNames.split(" "),
            thisClasses = thisClass.split(" "),
            rangeLoc = $(this).data("loc");

            // console.log("Range Classes",rangeClasses);

        if ( ( thisClasses.indexOf("dim") < 0 ) && ( thisClasses.indexOf("highlight") < 0 ) ) { 
            $(this).attr("class",'range-sub dim'); 
            if ( thisLoc == rangeLoc ) {  
                $(this).attr("class",'range-sub highlight');   
            } 
        }
        else if ( thisClasses.indexOf("highlight") > -1 ) {
            if ( thisLoc == rangeLoc ) {  
                $(this).attr("class",'range-sub dim');
            } 
        } 
        else {
            if ( thisLoc == rangeLoc ) {  
                $(this).attr("class",'range-sub highlight');
            } 
        }
    })

    // If all highlights are turned off (switchCount == 0), reset all classes to default
    if ( switchCount == 0 ) {
        bulletClass.attr("class",function(index, classNames) {
            return "bullet-sub";
        })
        slopeClass.attr("class",function(index, classNames) {
            return "slope-sub";
        })
        rangeClass.attr("class",function(index, classNames) {
            return "range-sub";
        })
        
    }
})

// SIZE MAP HIGHLIGHTING
$(document).on("click",".sizemap-sub", function(){
    var el = $(this),
    thisClass = el.attr("class"),
    thisClasses = thisClass.split(" "),
    thisLoc = el.data("loc"),
    sizemapClass = $(".sizemap-sub"), 
    switchCount = 0;

    sizemapClass.attr("class",function(index, classNames) {
        var classes = classNames.split(" ");

        // If no dim and no highlight, highlight this, dim all others 
        if ( (classes.indexOf("dim") < 0) && ( classes.indexOf("highlight") < 0 ) ) {  
            el.attr("class",'sizemap-sub highlight');
            return classNames + ' dim';
        } 
        else if ( thisClasses.indexOf("highlight") > -1 ) {
            el.attr("class",'sizemap-sub dim');
        } 
        else {
            el.attr("class",'sizemap-sub highlight');
        }

        if ( classes.indexOf("highlight") > -1 ) {
            switchCount ++;
        }
    });

    // If all highlights are turned off (switchCount == 0), reset all classes to default
    if ( switchCount == 0 ) {
        sizemapClass.attr("class",function(index, classNames) {
            return "sizemap-sub";
        })
    };
});


/************
*************
MOBILE TOOTIP HELPER
*************
************/
$(document).on("click","body", function(){
    $(".d3-tip").css("opacity","0")
});

var toggleChartViewStart = function(chartId) {
        $(".spinner").addClass("in").removeClass("hidden");
        $(".tab-pane").removeClass("active");
        $(chartId).addClass("active").removeClass("hidden fade");        
        $("#chart-header").addClass("hidden");
        $("#chart-header-map").addClass("hidden");
        $(chartId + " #controls").addClass("hidden");
        $("#chart-" + chartId).addClass("hidden");
    }

var toggleChartViewEnd = function(chartId) {
        $(".spinner").removeClass("in").addClass("hidden");
        $("#chart-header").removeClass("hidden");
        $("#chart-header-map").removeClass("hidden");
        $(chartId + " #controls").removeClass("hidden");
        $("#chart-" + chartId).removeClass("hidden");
    }

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